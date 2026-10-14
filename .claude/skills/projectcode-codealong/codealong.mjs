// projectcode 따라치기 엔진
// 사용: node codealong.mjs [--branch lecture] [--out .projectcode/code] [--student react-blog]
// lecture 브랜치의 커밋을 차례로 읽어 따라치기와 합류 지점마다 완성 문서를 쓴다.
// 문서마다 MD와 HTML 두 가지를 같은 내용으로 쓴다. HTML은 브라우저로 열고 복사 버튼을 쓴다.
// 커밋 하나가 따라치기 한 단계다. 첫 커밋은 시작 키트를 복사한 상태라 따라치기에 넣지 않는다.

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name)
  return i > 0 ? process.argv[i + 1] : fallback
}
const branch = arg("--branch", "lecture")
const out = arg("--out", ".projectcode/code")
const student = arg("--student", "react-blog")

const git = (args) =>
  execFileSync("git", ["-c", "core.quotepath=false", ...args], { encoding: "utf8", maxBuffer: 1 << 28 })

// roadmap에서 강의 이름, 장 순서, 합류 지점, 따라치기 시작 장, 바꾼 단계 제목을 읽는다
const roadmap = readFileSync(".projectcode/roadmap.md", "utf8")
const section = (title) => (roadmap.split(new RegExp(`^## ${title}\\s*$`, "m"))[1] || "").split(/^## /m)[0]
const lectureTitle = (roadmap.match(/^강의: (.+)$/m) || [])[1] || "따라치기"
const chapters = {}
for (const line of roadmap.split("\n")) {
  const m = line.match(/^\| (\d+) \| ([a-z0-9-]+) \| ([^|]+) \|/)
  if (m) chapters[m[2]] = { no: m[1], name: m[3].trim() }
}
// - component-split: 그림완성, 통째로 screens
// 통째로 장이 없으면 합류 장 끝까지 통째로 준다. 있으면 그 장까지 통째로, 뒤는 단계 diff다
// - 따라치기: 처음부터 또는 - 따라치기: board-list부터
const joins = {}
let followFrom = null
for (const line of section("합류 지점").split("\n")) {
  const f = line.match(/^- 따라치기: (.+)$/)
  if (f) {
    followFrom = f[1].trim() === "처음부터" ? null : f[1].trim().replace(/부터$/, "")
    continue
  }
  const m = line.match(/^- ([a-z0-9-]+): ([^,]+?)(?:, 통째로 ([a-z0-9-]+))?\s*$/)
  if (m) joins[m[1]] = { name: m[2].trim(), whole: m[3] || m[1] }
}
// - join T1: 입력값을 객체로 기억하기
const titles = {}
for (const line of section("따라치기 제목").split("\n")) {
  const m = line.match(/^- ([a-z0-9-]+) (T\d+): (.+)$/)
  if (m) titles[`${m[1]} ${m[2]}`] = m[3].trim()
}

// contract.md 실행에서 서버와 프론트 줄을 준비 절로 쓴다
const prep = []
if (existsSync(".projectcode/contract.md")) {
  const contract = readFileSync(".projectcode/contract.md", "utf8")
  const run = (contract.split(/^## 실행\s*$/m)[1] || "").split(/^## /m)[0]
  for (const line of run.split("\n")) if (/^- (서버|프론트)/.test(line)) prep.push(line.slice(2))
  const port = run.match(/npm run dev \((\d+)\)/)
  if (port) prep.push(`브라우저: http://localhost:${port[1]}`)
}

const trailer = (msg, key) => (msg.match(new RegExp(`^${key}: (.+)$`, "m")) || [])[1]
const hashes = git(["rev-list", "--reverse", branch]).trim().split("\n")
const steps = hashes.map((h) => {
  const msg = git(["show", "-s", "--format=%B", h])
  const chapter = trailer(msg, "Chapter")
  const task = trailer(msg, "Task")
  const subject = msg.split("\n")[0].replace(/^\[[^\]]+\] /, "")
  return { h, chapter, task, subject: titles[`${chapter} ${task}`] || subject }
})

// 학생이 붙여 넣는 순서. 설정, components, pages, index.css, main.jsx, App.jsx
// App.jsx는 모든 page를 불러오므로 마지막이어야 붙이는 도중에 에러가 나지 않는다
function rank(rel) {
  if (!rel.startsWith("src/")) return 1
  if (rel.startsWith("src/components/")) return 2
  if (rel.startsWith("src/pages/")) return 3
  if (rel === "src/index.css") return 5
  if (rel === "src/main.jsx") return 6
  if (rel === "src/App.jsx") return 7
  return 4
}
const byRank = (a, b) => rank(a.rel) - rank(b.rel) || a.rel.localeCompare(b.rel)

function lang(rel) {
  const ext = rel.split(".").pop()
  return { jsx: "jsx", js: "js", css: "css", json: "json", html: "html", md: "md" }[ext] || ""
}

function changes(from, to) {
  const range = from ? [from, to] : [`${to}^`, to]
  return git(["diff", "--name-status", "--no-renames", ...range, "--", student])
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, path] = line.split("\t")
      return { status, path, rel: path.slice(student.length + 1) }
    })
    .sort(byRank)
}

const show = (h, path) => git(["show", `${h}:${path}`]).replace(/\n$/, "")

// 파일 블록. kind: new(새 파일), modify(수정 파일), overwrite(덮어쓸 파일)
// lines는 MD 코드 블록에 들어갈 줄, full은 바뀐 뒤 전체 코드
function fileBlock(kind, h, c) {
  const full = show(h, c.path)
  let lines
  if (kind === "new") lines = full.split("\n").map((l) => `+${l}`)
  else if (kind === "modify") {
    const d = git(["diff", `${h}^`, h, "--", c.path])
    lines = d.slice(d.indexOf("@@")).replace(/\n$/, "").split("\n")
  } else lines = full.split("\n")
  return { t: "file", kind, rel: c.rel, lang: kind === "overwrite" ? lang(c.rel) : "diff", lines, full }
}

const chapterTitle = (chapter) => {
  const ch = chapters[chapter] || { no: "", name: "" }
  return { t: "h2", text: `${ch.no} ${chapter} ${ch.name}`, id: chapter }
}

// 단계 하나: 제목, 삭제할 파일, 새 파일, 수정 파일
function stepBlocks(i, stepNo) {
  const step = steps[i]
  const no = (chapters[step.chapter] || { no: "" }).no
  const blocks = [{ t: "h3", text: `${no}-${stepNo} ${step.subject}` }]
  const list = changes(null, step.h)
  const deleted = list.filter((c) => c.status === "D")
  if (deleted.length) blocks.push({ t: "delete", items: deleted.map((c) => c.rel) })
  for (const c of list.filter((c) => c.status !== "D"))
    blocks.push(fileBlock(c.status === "A" ? "new" : "modify", step.h, c))
  return blocks
}

const prepBlocks = () => (prep.length ? [{ t: "h2", text: "준비", id: "prep" }, { t: "list", items: prep }] : [])

// ---------- MD ----------
const LABEL = { new: "새 파일", modify: "수정 파일", overwrite: "덮어쓸 파일" }
function toMd(blocks) {
  const md = []
  for (const b of blocks) {
    if (b.t === "h1") md.push(`# ${b.text}`, "")
    else if (b.t === "h2") md.push(`## ${b.text}`, "")
    else if (b.t === "h3") md.push(`### ${b.text}`, "")
    else if (b.t === "p") md.push(b.text, "")
    else if (b.t === "list") md.push(...b.items.map((x) => `- ${x}`), "")
    else if (b.t === "delete") md.push("#### 삭제할 파일", "", ...b.items.map((x) => `- ${x}`), "")
    else if (b.t === "file") md.push(`#### ${LABEL[b.kind]} ${b.rel}`, "", "```" + b.lang, ...b.lines, "```", "")
  }
  return md.join("\n")
}

// ---------- HTML ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
let copyId = 0
function toHtml(title, blocks) {
  const toc = blocks.filter((b) => b.t === "h2").map((b) => `<a href="#${esc(b.id)}">${esc(b.text)}</a>`)
  const body = []
  for (const b of blocks) {
    if (b.t === "h1") body.push(`<h1>${esc(b.text)}</h1>`)
    else if (b.t === "h2") body.push(`<h2 id="${esc(b.id)}">${esc(b.text)}</h2>`)
    else if (b.t === "h3") body.push(`<h3>${esc(b.text)}</h3>`)
    else if (b.t === "p") body.push(`<p>${esc(b.text)}</p>`)
    else if (b.t === "list") body.push(`<ul>${b.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`)
    else if (b.t === "delete")
      body.push(`<div class="file"><div class="head"><span class="tag del">삭제할 파일</span></div><ul class="dels">${b.items.map((x) => `<li><code>${esc(x)}</code></li>`).join("")}</ul></div>`)
    else if (b.t === "file") {
      const a = ++copyId
      const rows = b.lines
        .map((l) => {
          const cls = b.kind === "overwrite" ? "" : l.startsWith("@@") ? "hunk" : l[0] === "+" ? "add" : l[0] === "-" ? "rem" : ""
          return `<span class="ln ${cls}">${esc(l) || " "}</span>`
        })
        .join("")
      const buttons =
        b.kind === "overwrite"
          ? `<button data-copy="f${a}">코드 복사</button>`
          : `<button data-copy="d${a}">diff 복사</button><button data-copy="f${a}">바뀐 뒤 전체 코드 복사</button>`
      body.push(
        `<div class="file"><div class="head"><span class="tag ${b.kind}">${LABEL[b.kind]}</span><code class="path">${esc(b.rel)}</code><span class="btns">${buttons}</span></div>` +
          `<pre><code>${rows}</code></pre>` +
          `<textarea hidden id="d${a}">${esc(b.lines.join("\n"))}</textarea><textarea hidden id="f${a}">${esc(b.full)}\n</textarea></div>`,
      )
    }
  }
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
:root{--bg:#ffffff;--fg:#1f2328;--muted:#59636e;--line:#d1d9e0;--code:#f6f8fa;--add:#dafbe1;--add-fg:#116329;--rem:#ffebe9;--rem-fg:#a40e26;--hunk:#ddf4ff;--accent:#0969da}
@media (prefers-color-scheme: dark){:root{--bg:#0d1117;--fg:#e6edf3;--muted:#9198a1;--line:#3d444d;--code:#151b23;--add:#12261e;--add-fg:#6fdd8b;--rem:#25171c;--rem-fg:#ff9492;--hunk:#121d2f;--accent:#4493f8}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,"Malgun Gothic",sans-serif}
main{max-width:980px;margin:0 auto;padding:24px 16px 80px}
nav{display:flex;flex-wrap:wrap;gap:6px 14px;padding:12px 0;border-bottom:1px solid var(--line);margin-bottom:8px}
nav a{color:var(--accent);text-decoration:none;font-size:14px}
h1{font-size:26px;margin:8px 0 4px}h2{font-size:22px;margin:40px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--line)}h3{font-size:18px;margin:28px 0 8px}
.file{border:1px solid var(--line);border-radius:8px;margin:12px 0;overflow:hidden}
.head{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;background:var(--code);border-bottom:1px solid var(--line)}
.tag{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;border:1px solid var(--line)}
.tag.new{color:var(--add-fg)}.tag.modify{color:var(--accent)}.tag.overwrite{color:var(--muted)}.tag.del{color:var(--rem-fg)}
.path{font-size:14px}
.btns{margin-left:auto;display:flex;gap:6px}
button{font:inherit;font-size:13px;padding:3px 10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--fg);cursor:pointer}
button.done{color:var(--add-fg);border-color:var(--add-fg)}
pre{margin:0;overflow-x:auto;background:var(--bg)}
pre code{display:block;min-width:max-content;font:13.5px/1.5 ui-monospace,Consolas,"D2Coding",monospace}
.ln{display:block;padding:0 12px;white-space:pre}
.ln.add{background:var(--add)}.ln.rem{background:var(--rem)}.ln.hunk{background:var(--hunk);color:var(--muted)}
.dels{margin:0;padding:8px 12px 8px 32px}
</style>
</head>
<body>
<main>
${toc.length ? `<nav>${toc.join("")}</nav>` : ""}
${body.join("\n")}
</main>
<script>
document.addEventListener("click", async (e) => {
  const b = e.target.closest("button[data-copy]")
  if (!b) return
  const text = document.getElementById(b.dataset.copy).value
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const t = document.createElement("textarea")
    t.value = text
    document.body.appendChild(t)
    t.select()
    document.execCommand("copy")
    t.remove()
  }
  const old = b.textContent
  b.textContent = "복사했다"
  b.classList.add("done")
  setTimeout(() => { b.textContent = old; b.classList.remove("done") }, 1200)
})
</script>
</body>
</html>
`
}

function write(name, title, blocks) {
  writeFileSync(join(out, `${name}.md`), toMd(blocks))
  writeFileSync(join(out, `${name}.html`), toHtml(title, blocks))
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })

// 따라치기
const followTitle = `${lectureTitle} 따라치기`
const follow = [{ t: "h1", text: followTitle }, ...prepBlocks()]
const startIndex = followFrom ? steps.findIndex((s) => s.chapter === followFrom) : 1
if (startIndex < 0) throw new Error(`따라치기 시작 장 ${followFrom}이 ${branch}에 없습니다.`)
if (followFrom) {
  const before = Object.entries(joins).find(([chapter]) => steps[startIndex - 1].chapter === chapter)
  const firstNo = (chapters[steps[1].chapter] || { no: "1" }).no
  const lastNo = (chapters[steps[startIndex - 1].chapter] || { no: "" }).no
  if (before) follow.push({ t: "p", text: `${firstNo}~${lastNo}장은 ${before[1].name}.md로 한다.` })
}
let current = null
let stepNo = 0
let lastJoined = null
for (let i = 1; i < steps.length; i++) {
  const step = steps[i]
  if (step.chapter !== current) {
    current = step.chapter
    stepNo = 0
    if (i >= startIndex) {
      follow.push(chapterTitle(current))
      if (lastJoined) follow.push({ t: "p", text: `${joins[lastJoined].name}.md로 합류했다면 여기부터 친다.` })
    }
    lastJoined = null
  }
  stepNo++
  if (i >= startIndex) follow.push(...stepBlocks(i, stepNo))
  const next = steps[i + 1]
  if (joins[step.chapter] && (!next || next.chapter !== step.chapter) && !followFrom) lastJoined = step.chapter
}
write("따라치기", followTitle, follow)

// 합류 지점마다 완성 문서
// 통째로 장 끝까지 바뀐 파일을 통째로 주고, 그 뒤 합류 장까지는 단계 diff로 준다
for (const [chapter, { name: fileName, whole }] of Object.entries(joins)) {
  const chapterOrder = steps.map((s) => s.chapter)
  const lastIndex = chapterOrder.lastIndexOf(chapter)
  const wholeIndex = chapterOrder.lastIndexOf(whole)
  if (lastIndex < 0 || wholeIndex < 0 || wholeIndex > lastIndex) {
    console.error(`합류 지점 ${chapter}(통째로 ${whole})가 ${branch}에 없거나 순서가 맞지 않습니다.`)
    continue
  }
  const h = steps[wholeIndex].h
  const list = changes(hashes[0], h)
  const ch = chapters[chapter] || { no: "", name: "" }
  const wholeCh = chapters[whole] || { no: "", name: "" }
  const doc = [
    { t: "h1", text: fileName },
    { t: "p", text: `${ch.no} ${chapter} ${ch.name}까지 끝낸 코드다.` },
    { t: "p", text: "시작 키트를 react-blog 폴더로 복사한 뒤 아래 순서대로 한다." },
    ...prepBlocks(),
    { t: "h2", text: `${wholeCh.no}장까지 통째로`, id: "whole" },
    { t: "p", text: `${wholeCh.no} ${whole}까지 끝낸 파일이다.` },
  ]
  const deleted = list.filter((c) => c.status === "D")
  if (deleted.length) doc.push({ t: "delete", items: deleted.map((c) => c.rel) })
  for (const c of list.filter((c) => c.status !== "D")) doc.push(fileBlock(c.status === "A" ? "new" : "overwrite", h, c))
  let diffChapter = null
  let diffStepNo = 0
  for (let i = wholeIndex + 1; i <= lastIndex; i++) {
    if (steps[i].chapter !== diffChapter) {
      diffChapter = steps[i].chapter
      diffStepNo = 0
      doc.push(chapterTitle(diffChapter))
    }
    doc.push(...stepBlocks(i, ++diffStepNo))
  }
  const nextStep = steps[lastIndex + 1]
  if (nextStep) {
    const next = chapters[nextStep.chapter] || { no: "" }
    doc.push({ t: "p", text: `다음은 따라치기의 ${next.no} ${nextStep.chapter}부터 이어 친다.` })
  }
  write(fileName, fileName, doc)
}

const names = ["따라치기", ...Object.values(joins).map((j) => j.name)]
console.log(`썼음: ${names.map((n) => `${out}/${n}.md, ${n}.html`).join(", ")}`)
