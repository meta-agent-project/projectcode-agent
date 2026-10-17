// projectcode 따라치기 점검
// 사용: node check-follow.mjs [--branch lecture] [--out .projectcode/code] [--student react-blog] [--build]
// 저장소 루트에서 실행한다. 학생 코드 폴더에 npm install이 되어 있어야 한다.
// 따라치기.md를 시작 키트(lecture 첫 커밋)에 한 단계씩 그대로 적용하고 단계마다 본다.
// - 적용한 결과가 그 단계의 lecture 커밋과 같은가
// - 상대 경로 import가 있는 파일을 가리키는가. 대소문자까지 본다. Windows는 몰라도 Mac은 오류다
// - default와 이름 붙은 내보내기가 import와 맞는가
// - 쓰는 이름이 모두 import되거나 선언됐는가
// - 패키지 import가 그 단계의 package.json에 있는가
// - --build를 주면 단계마다 vite build가 되는가
// 끝에 HTML 복사 글자가 그 lecture 커밋의 파일 전체와 같은지 본다.

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { createRequire } from "node:module"

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : fallback
}
const branch = arg("--branch", "lecture")
const out = arg("--out", ".projectcode/code")
const student = arg("--student", "react-blog")
const build = process.argv.includes("--build")

const require = createRequire(path.resolve(student, "package.json"))
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default

const git = (args, input) =>
  execFileSync("git", ["-c", "core.quotepath=false", ...args], { input, maxBuffer: 1 << 30 })

// 커밋마다 학생 코드 폴더의 파일과 blob을 읽는다. 내용은 cat-file 한 번으로 모아 읽는다
const commits = git(["log", "--reverse", "--format=%h", branch]).toString().trim().split("\n")
const subjects = git(["log", "--reverse", "--format=%s", branch]).toString().trim().split("\n")
const listings = commits.map((c) =>
  git(["ls-tree", "-r", c, "--", student])
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [meta, file] = l.split("\t")
      return { file: file.slice(student.length + 1), blob: meta.split(" ")[2] }
    }),
)
const blobs = new Map()
{
  const want = [...new Set(listings.flat().map((x) => x.blob))]
  const buf = git(["cat-file", "--batch"], want.join("\n") + "\n")
  let pos = 0
  while (pos < buf.length) {
    const nl = buf.indexOf(10, pos)
    const [hash, , size] = buf.subarray(pos, nl).toString().split(" ")
    const start = nl + 1
    blobs.set(hash, buf.subarray(start, start + Number(size)).toString("utf8"))
    pos = start + Number(size) + 1
  }
}
const tree = (i) => new Map(listings[i].map((x) => [x.file, blobs.get(x.blob)]))

// 따라치기.md를 단계와 파일 블록으로 나눈다
const lines = fs.readFileSync(path.join(out, "따라치기.md"), "utf8").replace(/\r\n/g, "\n").split("\n")
const steps = []
let step = null
for (let i = 0; i < lines.length; i++) {
  const l = lines[i]
  let m
  if ((m = l.match(/^### (\S+) (.*)$/))) {
    step = { id: m[1], title: m[2], ops: [] }
    steps.push(step)
  } else if (l === "#### 삭제할 파일") {
    const op = { kind: "del", files: [] }
    for (i++; i < lines.length && !lines[i].startsWith("#"); i++) {
      const mm = lines[i].match(/^- (.+)$/)
      if (mm) op.files.push(mm[1])
    }
    i--
    step.ops.push(op)
  } else if ((m = l.match(/^#### (새 파일|수정 파일|덮어쓸 파일) (.+)$/))) {
    const kind = { "새 파일": "new", "수정 파일": "mod", "덮어쓸 파일": "over" }[m[1]]
    while (!lines[i].startsWith("```")) i++
    const body = []
    for (i++; lines[i] !== "```"; i++) body.push(lines[i])
    step.ops.push({ kind, file: m[2], body })
  }
}

// 수정 파일은 학생처럼 고칠 자리를 글자로 찾아 바꾼다. 줄 번호는 보지 않는다
function applyMod(text, body, file) {
  const errs = []
  const hunks = []
  let h = null
  for (const l of body) {
    if (l.startsWith("@@") || !h) {
      h = { old: [], neu: [] }
      hunks.push(h)
      if (l.startsWith("@@")) continue
    }
    const c = l[0]
    const s = l.slice(1)
    if (c === " " || l === "") {
      h.old.push(s)
      h.neu.push(s)
    } else if (c === "-") h.old.push(s)
    else if (c === "+") h.neu.push(s)
    else if (c !== "\\") errs.push(`${file}: 알 수 없는 줄 ${l}`)
  }
  const cur = text.split("\n")
  let from = 0
  for (const hk of hunks) {
    let found = -1
    let count = 0
    for (let k = 0; k + hk.old.length <= cur.length; k++) {
      if (hk.old.every((x, j) => cur[k + j] === x)) {
        count++
        if (found < 0 && k >= from) found = k
      }
    }
    if (found < 0) {
      errs.push(`${file}: 고칠 자리를 찾지 못함 (${hk.old.find((x) => x.trim()) ?? ""})`)
      continue
    }
    if (count > 1) errs.push(`${file}: 고칠 자리가 ${count}곳 (${hk.old.find((x) => x.trim()) ?? ""})`)
    cur.splice(found, hk.old.length, ...hk.neu)
    from = found + hk.neu.length
  }
  return { text: cur.join("\n"), errs }
}

const GLOBALS = new Set([
  "window", "document", "localStorage", "sessionStorage", "console", "setTimeout", "clearTimeout",
  "setInterval", "clearInterval", "alert", "confirm", "prompt", "Promise", "Date", "JSON", "Object",
  "Array", "Number", "String", "Math", "Boolean", "Error", "encodeURIComponent", "decodeURIComponent",
  "undefined", "NaN", "Infinity", "fetch", "URL", "URLSearchParams", "Map", "Set", "parseInt",
  "parseFloat", "isNaN", "Symbol", "FormData", "process",
])
const parse = (code) => parser.parse(code, { sourceType: "module", plugins: ["jsx"] })

function resolveRel(state, fromFile, spec) {
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), spec))
  const cands = [base, `${base}.jsx`, `${base}.js`, `${base}/index.jsx`, `${base}/index.js`]
  const file = cands.find((c) => state.has(c))
  if (file) return { file }
  const lower = cands.map((c) => c.toLowerCase())
  return { caseOnly: [...state.keys()].find((k) => lower.includes(k.toLowerCase())) }
}

function exportsOf(code) {
  const named = new Set()
  let def = false
  for (const n of parse(code).program.body) {
    if (n.type === "ExportDefaultDeclaration") def = true
    if (n.type !== "ExportNamedDeclaration") continue
    if (n.declaration?.id) named.add(n.declaration.id.name)
    for (const d of n.declaration?.declarations ?? []) named.add(d.id.name)
    for (const s of n.specifiers ?? []) {
      if (s.exported.name === "default") def = true
      else named.add(s.exported.name)
    }
  }
  return { named, def }
}

function checkImports(state) {
  const errs = []
  const notes = []
  const pkg = JSON.parse(state.get("package.json") ?? "{}")
  const deps = new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.devDependencies ?? {})])
  for (const [file, code] of state) {
    if (!/\.(jsx?|mjs)$/.test(file) || !(file.startsWith("src/") || !file.includes("/"))) continue
    if (file.startsWith("eslint")) continue
    let ast
    try {
      ast = parse(code)
    } catch (e) {
      errs.push(`${file}: 문법 오류 ${e.message}`)
      continue
    }
    for (const n of ast.program.body) {
      if (n.type !== "ImportDeclaration") continue
      const spec = n.source.value
      if (!spec.startsWith(".")) {
        const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]
        if (!deps.has(name)) errs.push(`${file}: 패키지 ${name}가 package.json에 없음`)
        continue
      }
      const r = resolveRel(state, file, spec)
      if (!r.file) {
        errs.push(`${file}: ${spec}를 찾지 못함${r.caseOnly ? ` (대소문자만 다른 ${r.caseOnly}가 있음)` : ""}`)
        continue
      }
      if (!/\.jsx?$/.test(r.file)) continue
      let ex
      try {
        ex = exportsOf(state.get(r.file))
      } catch {
        continue
      }
      for (const s of n.specifiers) {
        if (s.type === "ImportDefaultSpecifier" && !ex.def) errs.push(`${file}: ${spec}에 export default가 없음`)
        if (s.type === "ImportSpecifier" && !ex.named.has(s.imported.name))
          errs.push(`${file}: ${spec}에 ${s.imported.name} 내보내기가 없음`)
      }
    }
    traverse(ast, {
      Program(p) {
        for (const [name, b] of Object.entries(p.scope.bindings))
          if (b.kind === "module" && !b.referenced) notes.push(`${file}: import ${name}를 쓰지 않음`)
      },
      ReferencedIdentifier(p) {
        const name = p.node.name
        if (p.node.type === "JSXIdentifier") {
          if (!/^[A-Z]/.test(name)) return
          if (p.parentPath.isJSXMemberExpression() && p.parentPath.node.property === p.node) return
        }
        if (p.scope.hasBinding(name) || GLOBALS.has(name)) return
        errs.push(`${file}: ${name}가 정의되지 않음`)
      },
    })
  }
  return { errs, notes }
}

// 단계마다 학생 폴더를 임시 폴더에 쓰고 node_modules를 이어 붙여 빌드한다
const tmp = build ? fs.mkdtempSync(path.join(os.tmpdir(), "check-follow-")) : null
function buildStep(state, n) {
  const dir = path.join(tmp, String(n))
  for (const [f, c] of state) {
    fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true })
    fs.writeFileSync(path.join(dir, f), c)
  }
  const link = path.join(dir, "node_modules")
  fs.symlinkSync(path.resolve(student, "node_modules"), link, "junction")
  try {
    execFileSync(process.execPath, ["node_modules/vite/bin/vite.js", "build", "--outDir", path.join(tmp, `dist-${n}`), "--logLevel", "error"], { cwd: dir, stdio: "pipe" })
    return null
  } catch (e) {
    return (e.stdout + "\n" + e.stderr).trim().split("\n").slice(0, 8).join("\n    ")
  } finally {
    fs.unlinkSync(link)
  }
}

const report = []
let errCount = 0
const copies = []
if (steps.length !== commits.length - 1) {
  report.push(`단계 ${steps.length}개, lecture 커밋 ${commits.length - 1}개로 수가 다름`)
  errCount++
}
let state = tree(0)
for (let s = 0; s < Math.min(steps.length, commits.length - 1); s++) {
  const st = steps[s]
  const errs = []
  for (const op of st.ops) {
    if (op.kind === "del") {
      for (const f of op.files) if (!state.delete(f)) errs.push(`지울 파일이 없음 ${f}`)
      continue
    }
    if (op.kind === "new") {
      if (state.has(op.file)) errs.push(`새 파일인데 이미 있음 ${op.file}`)
      state.set(op.file, op.body.map((l) => l.slice(1)).join("\n") + "\n")
    } else if (op.kind === "over") state.set(op.file, op.body.join("\n") + "\n")
    else if (!state.has(op.file)) errs.push(`고칠 파일이 없음 ${op.file}`)
    else {
      const r = applyMod(state.get(op.file), op.body, op.file)
      errs.push(...r.errs)
      state.set(op.file, r.text)
    }
    copies.push({ step: st.id, file: op.file, want: tree(s + 1).get(op.file) ?? "" })
  }
  const want = tree(s + 1)
  for (const [f, c] of want) if (state.get(f) !== c) errs.push(`lecture와 다름 ${f}${state.has(f) ? "" : " (없음)"}`)
  for (const f of state.keys()) if (!want.has(f)) errs.push(`lecture에 없는 파일 ${f}`)
  const ic = checkImports(state)
  errs.push(...ic.errs)
  if (build) {
    const fail = buildStep(state, s + 1)
    if (fail) errs.push(`빌드 실패\n    ${fail}`)
  }
  errCount += errs.length
  if (errs.length || ic.notes.length) {
    report.push(`${st.id} ${st.title} (${commits[s + 1]} ${subjects[s + 1]})`)
    for (const e of errs) report.push(`  오류 ${e}`)
    for (const e of ic.notes) report.push(`  참고 ${e}`)
  }
}
if (tmp) fs.rmSync(tmp, { recursive: true, force: true })

const html = fs.readFileSync(path.join(out, "따라치기.html"), "utf8")
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
const areas = [...html.matchAll(/<textarea hidden id="c\d+">([\s\S]*?)<\/textarea>/g)].map((m) => unesc(m[1]))
let copyDiff = 0
if (areas.length !== copies.length) {
  report.push(`복사 버튼 ${areas.length}개, 파일 블록 ${copies.length}개로 수가 다름`)
  copyDiff++
}
for (let i = 0; i < Math.min(areas.length, copies.length); i++) {
  if (areas[i].trimEnd() === copies[i].want.trimEnd()) continue
  report.push(`복사 글자 다름 ${copies[i].step} ${copies[i].file}`)
  copyDiff++
}

report.push(`단계 ${steps.length}개, 오류 ${errCount}개${build ? ", 빌드 포함" : ""}`)
report.push(`복사 ${copies.length}개 중 다름 ${copyDiff}개`)
console.log(report.join("\n"))
process.exit(errCount + copyDiff ? 1 : 0)
