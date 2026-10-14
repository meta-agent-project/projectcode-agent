// projectcode 따라치기 엔진
// 사용: node codealong.mjs [--branch lecture] [--out .projectcode/code] [--student react-blog]
// lecture 브랜치의 커밋을 차례로 읽어 따라치기.md와 합류 지점마다 완성 md를 쓴다.
// 커밋 하나가 따라치기 한 단계다. 첫 커밋은 시작 키트를 복사한 상태라 코드를 쓰지 않는다.

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from "node:fs"
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

// roadmap에서 강의 이름, 장 순서, 합류 지점을 읽는다
const roadmap = readFileSync(".projectcode/roadmap.md", "utf8")
const lectureTitle = (roadmap.match(/^강의: (.+)$/m) || [])[1] || "따라치기"
const chapters = {}
for (const line of roadmap.split("\n")) {
  const m = line.match(/^\| (\d+) \| ([a-z0-9-]+) \| ([^|]+) \|/)
  if (m) chapters[m[2]] = { no: m[1], name: m[3].trim() }
}
const joins = {}
const joinSection = roadmap.split(/^## 합류 지점\s*$/m)[1]
if (joinSection) {
  for (const line of joinSection.split(/^## /m)[0].split("\n")) {
    const m = line.match(/^- ([a-z0-9-]+): (.+)$/)
    if (m) joins[m[1]] = m[2].trim()
  }
}

const trailer = (msg, key) => (msg.match(new RegExp(`^${key}: (.+)$`, "m")) || [])[1]
const hashes = git(["rev-list", "--reverse", branch]).trim().split("\n")
const steps = hashes.map((h) => {
  const msg = git(["show", "-s", "--format=%B", h])
  return {
    h,
    subject: msg.split("\n")[0].replace(/^\[[^\]]+\] /, ""),
    chapter: trailer(msg, "Chapter"),
    task: trailer(msg, "Task"),
  }
})

function taskInfo(chapter, task) {
  const path = `.projectcode/chapters/${chapter}/tasks.md`
  if (!existsSync(path)) return {}
  const lines = readFileSync(path, "utf8").split("\n")
  const start = lines.findIndex((l) => /^- \[[ x]\] /.test(l) && l.slice(6).startsWith(`${task} `))
  const info = {}
  for (let i = start + 1; start >= 0 && i < lines.length && lines[i].startsWith("  - "); i++) {
    const m = lines[i].match(/^ {2}- ([^:]+): (.+)$/)
    if (m) info[m[1]] = m[2]
  }
  return info
}

function shotsOf(chapter) {
  const path = `.projectcode/chapters/${chapter}/captures/shots.json`
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")).shots : []
}

function image(chapter, shot) {
  const src = `.projectcode/chapters/${chapter}/captures/${shot.file}`
  if (!shot.file.endsWith(".png") || !existsSync(src)) return null
  const name = `${chapter}-${shot.file}`
  copyFileSync(src, join(out, "images", name))
  return `![${shot.screen}](images/${name})`
}

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

const fullFile = (h, c) => `#### ${c.rel}\n\n\`\`\`${lang(c.rel)}\n${git(["show", `${h}:${c.path}`]).replace(/\n$/, "")}\n\`\`\`\n`

function diffFile(h, c) {
  const d = git(["diff", `${h}^`, h, "--", c.path])
  return `#### ${c.rel}\n\n\`\`\`diff\n${d.slice(d.indexOf("@@")).replace(/\n$/, "")}\n\`\`\`\n`
}

rmSync(out, { recursive: true, force: true })
mkdirSync(join(out, "images"), { recursive: true })

// 따라치기.md
const follow = [`# ${lectureTitle} 따라치기`, ""]
let current = null
let stepNo = 0
let lastJoined = null
for (const [i, step] of steps.entries()) {
  if (step.chapter !== current) {
    current = step.chapter
    stepNo = 0
    const ch = chapters[current] || { no: "", name: "" }
    follow.push(`## ${ch.no} ${current} ${ch.name}`, "")
    if (lastJoined) {
      follow.push(`${joins[lastJoined]}.md로 합류했다면 여기부터 친다.`, "")
      lastJoined = null
    }
  }
  stepNo++
  const info = taskInfo(step.chapter, step.task)
  follow.push(`### ${stepNo}. ${step.subject}`, "")
  if (info.Why) follow.push(`왜: ${info.Why}`)
  if (info["실행하면"]) follow.push(`실행하면: ${info["실행하면"]}`)
  follow.push("")
  if (i === 0) {
    follow.push("코드는 치지 않는다. 시작 키트를 react-blog 폴더로 복사한다.", "")
  } else {
    for (const c of changes(null, step.h)) {
      if (c.status === "D") follow.push(`지운다: ${c.rel}`, "")
      else follow.push(c.status === "A" ? fullFile(step.h, c) : diffFile(step.h, c))
    }
  }
  const shot = shotsOf(step.chapter).find((s) => s.task === step.task)
  const img = shot && image(step.chapter, shot)
  if (img) follow.push(img, "")
  const next = steps[i + 1]
  if (joins[step.chapter] && (!next || next.chapter !== step.chapter)) lastJoined = step.chapter
}
writeFileSync(join(out, "따라치기.md"), follow.join("\n"))

// 합류 지점마다 완성 md. 시작 키트에서 그 장 끝까지 바뀐 파일을 통째로 준다
for (const [chapter, fileName] of Object.entries(joins)) {
  const lastIndex = steps.map((s) => s.chapter).lastIndexOf(chapter)
  if (lastIndex < 0) {
    console.error(`합류 지점 ${chapter}가 ${branch}에 없습니다.`)
    continue
  }
  const h = steps[lastIndex].h
  const list = changes(hashes[0], h)
  const ch = chapters[chapter] || { no: "", name: "" }
  const nextStep = steps[lastIndex + 1]
  const doc = [`# ${fileName}`, "", `${ch.no} ${chapter} ${ch.name}까지 끝낸 코드다.`, "시작 키트를 react-blog 폴더로 복사한 뒤 아래 순서대로 한다.", ""]
  const deleted = list.filter((c) => c.status === "D")
  if (deleted.length) doc.push("## 지울 것", "", ...deleted.map((c) => `- ${c.rel}`), "")
  doc.push("## 붙여 넣을 파일", "", "파일 내용을 통째로 바꾼다. 없는 파일은 만든다.", "")
  for (const c of list.filter((c) => c.status !== "D")) doc.push(fullFile(h, c))
  doc.push("## 이렇게 보이면 된다", "", "react-blog 폴더에서 npm run dev를 하고 화면을 연다.", "")
  for (const shot of shotsOf(chapter).filter((s) => s.task === "done")) {
    const img = image(chapter, shot)
    if (img) doc.push(img, "")
  }
  if (nextStep) {
    const next = chapters[nextStep.chapter] || { no: "" }
    doc.push(`다음은 따라치기.md의 ${next.no} ${nextStep.chapter}부터 이어 친다.`, "")
  }
  writeFileSync(join(out, `${fileName}.md`), doc.join("\n"))
}

console.log(`썼음: ${out}/따라치기.md, ${Object.values(joins).map((n) => `${n}.md`).join(", ") || "합류 지점 없음"}`)
