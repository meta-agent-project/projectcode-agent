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

// 학생이 붙여 넣는 순서. 설정, api와 store와 hooks 같은 모듈, components, pages, index.css, main.jsx, App.jsx
// 불러다 쓰는 파일이 먼저 있어야 붙이는 도중에 에러가 나지 않는다. App.jsx는 모든 page를 불러오므로 마지막이다
function rank(rel) {
  if (!rel.startsWith("src/")) return 1
  if (rel.startsWith("src/components/")) return 3
  if (rel.startsWith("src/pages/")) return 4
  if (rel === "src/index.css") return 5
  if (rel === "src/main.jsx") return 6
  if (rel === "src/App.jsx") return 7
  return 2
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

// review.md에서 단계마다 파일마다 코드 리뷰 줄을 읽는다. HTML 말풍선에 쓴다
// ## join T1 아래 ### src/pages/JoinForm.jsx 아래 - 줄이다
const reviews = {}
if (existsSync(".projectcode/review.md")) {
  let step = null
  let file = null
  for (const line of readFileSync(".projectcode/review.md", "utf8").split(/\r?\n/)) {
    const s = line.match(/^## ([a-z0-9-]+ T\d+)\s*$/)
    const f = line.match(/^### (.+?)\s*$/)
    const r = line.match(/^- (.+)$/)
    if (s) {
      step = reviews[s[1]] = {}
      file = null
    } else if (f && step) file = step[f[1]] = []
    else if (r && file) file.push(r[1].trim())
  }
}

// 단계 하나: 제목, 삭제할 파일, 새 파일, 수정 파일
// 코드 리뷰는 review.md에 그 파일 줄이 있는 블록에만 붙인다
function stepBlocks(i, stepNo) {
  const step = steps[i]
  const no = (chapters[step.chapter] || { no: "" }).no
  const blocks = [{ t: "h3", text: `${no}-${stepNo} ${step.subject}`, id: `s${no}-${stepNo}` }]
  const list = changes(null, step.h)
  const deleted = list.filter((c) => c.status === "D")
  if (deleted.length) blocks.push({ t: "delete", items: deleted.map((c) => c.rel) })
  const review = reviews[`${step.chapter} ${step.task}`] || {}
  for (const c of list.filter((c) => c.status !== "D")) {
    const b = fileBlock(c.status === "A" ? "new" : "modify", step.h, c)
    if (review[c.rel]?.length) b.review = review[c.rel]
    blocks.push(b)
  }
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
// 코드 색은 만들 때 shiki로 미리 입힌다. HTML에 색칠 스크립트가 없어 폐쇄망에서도 그대로 보인다
const THEME = "github-light"
let shiki
try {
  shiki = await import("shiki")
} catch {
  console.error("shiki가 없습니다. .claude/skills/projectcode-codealong에서 npm install을 하세요.")
  process.exit(1)
}
const highlighter = await shiki.createHighlighter({ themes: [THEME], langs: ["jsx", "js", "css", "json", "html"] })

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// 줄 종류: add, rem, ctx, meta(@@ 줄과 \ No newline 줄). overwrite는 모두 ctx다
function lineKinds(b) {
  return b.lines.map((l) => {
    if (b.kind === "overwrite") return "ctx"
    if (l.startsWith("@@") || l.startsWith("\\")) return "meta"
    return l[0] === "+" ? "add" : l[0] === "-" ? "rem" : "ctx"
  })
}

// diff 기호를 떼고 코드를 한 번에 칠해야 여러 줄 문법이 맞게 칠해진다
function highlighted(b) {
  const kinds = lineKinds(b)
  const code = b.lines.map((l, i) => (kinds[i] === "meta" ? "" : b.kind === "overwrite" ? l : l.slice(1))).join("\n")
  const want = lang(b.rel)
  const lg = highlighter.getLoadedLanguages().includes(want) ? want : "jsx"
  const { tokens } = highlighter.codeToTokens(code, { lang: lg, theme: THEME })
  return tokens
    .map((line, i) => {
      if (kinds[i] === "meta") return `<span class="ln meta"><span class="sign"></span>${esc(b.lines[i])}</span>`
      const html = line.map((t) => `<span style="color:${t.color}">${esc(t.content)}</span>`).join("")
      if (b.kind === "overwrite") return `<span class="ln plain">${html || " "}</span>`
      const sign = kinds[i] === "add" ? "+" : kinds[i] === "rem" ? "-" : ""
      return `<span class="ln ${kinds[i]}"><span class="sign">${sign}</span>${html || " "}</span>`
    })
    .join("")
}

// 복사 글자: 그 단계가 끝난 뒤의 파일 전체다. 화면 diff에 안 보이는 줄도 들어간다
const copyText = (b) => `${b.full}\n`

const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg>`
const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg>`

const HELP_ICON = `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.92 6.085h.001a.749.749 0 1 1-1.342-.67c.169-.339.436-.701.849-.977C6.845 4.16 7.369 4 8 4a2.756 2.756 0 0 1 1.637.525c.503.377.863.965.863 1.725 0 .448-.115.83-.329 1.15-.205.307-.47.513-.692.662-.109.072-.22.138-.313.195l-.006.004a6.24 6.24 0 0 0-.26.16.952.952 0 0 0-.276.245.75.75 0 0 1-1.248-.832c.184-.264.42-.489.692-.661.103-.067.207-.132.313-.195l.007-.004c.1-.061.182-.11.258-.161a.969.969 0 0 0 .277-.245C8.96 6.514 9 6.427 9 6.25a.612.612 0 0 0-.262-.525A1.27 1.27 0 0 0 8 5.5c-.369 0-.595.09-.74.187a1.01 1.01 0 0 0-.34.398ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>`

// 왼쪽 목차. 장 아래에 단계를 접어 둔다. 단계가 없는 절(준비, 통째로)은 링크 하나다
function tocHtml(blocks) {
  const items = []
  for (const b of blocks) {
    if (b.t === "h2") items.push({ ...b, steps: [] })
    else if (b.t === "h3" && items.length) items[items.length - 1].steps.push(b)
  }
  return items
    .map((h) =>
      h.steps.length
        ? `<details data-ch="${esc(h.id)}"><summary><a href="#${esc(h.id)}">${esc(h.text)}</a></summary>` +
          h.steps.map((s) => `<a class="step" href="#${esc(s.id)}">${esc(s.text)}</a>`).join("") +
          `</details>`
        : `<a class="sec" href="#${esc(h.id)}">${esc(h.text)}</a>`,
    )
    .join("")
}

let copyId = 0
function toHtml(title, blocks) {
  const toc = tocHtml(blocks)
  const body = []
  for (const b of blocks) {
    if (b.t === "h1") body.push(`<h1>${esc(b.text)}</h1>`)
    else if (b.t === "h2") body.push(`<h2 id="${esc(b.id)}">${esc(b.text)}</h2>`)
    else if (b.t === "h3") body.push(`<h3 id="${esc(b.id)}">${esc(b.text)}</h3>`)
    else if (b.t === "p") body.push(`<p>${esc(b.text)}</p>`)
    else if (b.t === "list") body.push(`<ul>${b.items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`)
    else if (b.t === "delete")
      body.push(`<div class="file"><div class="head"><span class="tag del">삭제할 파일</span></div><ul class="dels">${b.items.map((x) => `<li><code>${esc(x)}</code></li>`).join("")}</ul></div>`)
    else if (b.t === "file") {
      // 복사 아이콘 하나. 누르면 그 단계가 끝난 뒤의 파일 전체가 복사된다
      // 리뷰가 있는 파일은 복사 아이콘 왼쪽에 물음표 아이콘이 있다. 누르면 코드 위에 코드 리뷰가 열린다
      const a = ++copyId
      const helpButton = b.review
        ? `<button class="icon help-btn" data-help="h${a}" aria-expanded="false" title="코드 리뷰" aria-label="${esc(b.rel)} 코드 리뷰">${HELP_ICON}</button>`
        : ""
      const helpPanel = b.review
        ? `<div class="help" id="h${a}"><div class="help-in"><ul>${b.review.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>`
        : ""
      body.push(
        `<div class="file"><div class="head"><span class="tag ${b.kind}">${LABEL[b.kind]}</span><code class="path">${esc(b.rel)}</code>` +
          `<span class="btns">${helpButton}<button class="icon copy" data-copy="c${a}" title="파일 전체 복사" aria-label="${esc(b.rel)} 파일 전체 복사">${COPY_ICON}</button></span></div>` +
          helpPanel +
          `<pre><code>${highlighted(b)}</code></pre><textarea hidden id="c${a}">${esc(copyText(b))}</textarea></div>`,
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
:root{--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"D2Coding",monospace;--code-size:13.5px;--bg:#ffffff;--fg:#1f2328;--muted:#59636e;--line:#d1d9e0;--code:#f6f8fa;--add:#dafbe1;--add-fg:#116329;--rem:#ffebe9;--rem-fg:#a40e26;--hunk:#ddf4ff;--accent:#0969da;--ink:#191f28;--sub:#6b7684;--soft:#eef0f3;--side:#f9fafb;--font:"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.75 var(--font);letter-spacing:-0.01em;-webkit-font-smoothing:antialiased}
main{max-width:960px;min-width:0;margin:0 auto;padding:40px 20px 120px}
code,pre{font-family:var(--mono);font-size:var(--code-size)}
.toc{position:fixed;top:0;left:0;bottom:0;width:280px;overflow-y:auto;padding:24px 12px 48px;border-right:1px solid var(--soft);background:var(--side);font-size:14px;line-height:1.45}
.toc a{display:block;color:var(--ink);text-decoration:none;font-weight:400;padding:6px 10px;border-radius:8px}
.toc a:hover{background:var(--soft)}
.toc summary{list-style:none;cursor:pointer;display:flex;align-items:center;border-radius:8px}
.toc details,.toc a.sec{border-bottom:1px solid var(--soft);padding:4px 0}
.toc details:last-child,.toc a.sec:last-child{border-bottom:none}
.toc summary::-webkit-details-marker{display:none}
.toc summary::before{content:"▸";width:16px;flex:none;text-align:center;color:var(--sub);font-size:11px}
.toc details[open]>summary::before{content:"▾"}
.toc summary a{flex:1}
.toc a.sec{padding-left:26px}
.toc a.step{padding-left:30px;color:var(--sub);font-size:13px}
.toc a.active{background:#e8f1ff;color:var(--accent)}
.toc-btn{display:none;position:fixed;top:12px;left:12px;z-index:3;padding:6px 14px;border:1px solid var(--soft);border-radius:999px;background:var(--bg);color:var(--ink);font:14px var(--font);cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.06);opacity:.55;transition:opacity .15s}
.toc-btn:hover,.toc-btn:focus-visible{opacity:1}
@media (min-width:1100px){main{margin-left:280px;margin-right:auto;padding-left:56px}}
@media (max-width:1099px){.toc{z-index:2;padding-top:56px;transform:translateX(-100%);transition:transform .2s;box-shadow:0 0 16px rgba(0,0,0,.15)}.toc.open{transform:none}.toc-btn{display:block}main{padding-top:56px}}
h1,h2,h3,.path,.dels code{overflow-wrap:anywhere}
h1{font-size:30px;font-weight:700;letter-spacing:-0.02em;line-height:1.35;margin:8px 0 16px}
h2{font-size:24px;font-weight:700;letter-spacing:-0.02em;margin:72px 0 16px;padding-top:40px;border-top:1px solid var(--line)}
h3{font-size:18px;font-weight:600;margin:44px 0 12px;padding-top:28px;border-top:1px dashed var(--soft)}
h2+h3,h2+ul+h3{border-top:none;padding-top:0;margin-top:24px}
h1+h2{border-top:none;padding-top:0;margin-top:40px}
main>ul{color:var(--ink);padding-left:22px}main>ul li{margin:4px 0}
h2,h3{scroll-margin-top:24px}
.file{border:1px solid var(--line);border-radius:12px;margin:16px 0;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.head{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;background:var(--code);border-bottom:1px solid var(--line)}
.tag{font:500 12px var(--font);padding:2px 10px;border-radius:999px;border:1px solid var(--line);background:var(--bg)}
.tag.new{color:var(--add-fg)}.tag.modify{color:var(--accent)}.tag.overwrite{color:var(--muted)}.tag.del{color:var(--rem-fg)}
.path{min-width:0}
.btns{margin-left:auto;display:flex;gap:6px}
button.icon{display:inline-flex;align-items:center;justify-content:center;width:32px;height:28px;padding:0;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--muted);cursor:pointer}
button.icon:hover{color:var(--fg);border-color:var(--muted)}
button.copy.done{color:var(--add-fg);border-color:var(--add-fg)}
button.help-btn[aria-expanded="true"]{color:var(--accent);border-color:var(--accent)}
.help{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s ease}
.help.open{grid-template-rows:1fr}
.help-in{overflow:hidden}
.help ul{margin:0;padding:12px 16px 12px 34px;background:#f6faff;border-bottom:1px solid var(--line);font:14px/1.65 var(--font)}
.help li{margin:2px 0}
pre{margin:0;overflow-x:auto;-webkit-overflow-scrolling:touch;background:var(--bg)}
pre code{display:block;min-width:max-content;line-height:1.5}
.ln{display:block;padding:0 12px 0 0;white-space:pre}
.sign{display:inline-block;width:24px;text-align:center;color:var(--muted);user-select:none}
.ln.add{background:var(--add)}.ln.add .sign{color:var(--add-fg)}.ln.rem{background:var(--rem)}.ln.rem .sign{color:var(--rem-fg)}.ln.meta{background:var(--hunk);color:var(--muted)}
.ln.plain{padding-left:12px}
.hint{font-size:14px;color:var(--sub);margin:0 0 24px;padding:12px 16px;background:var(--side);border-left:3px solid var(--accent);border-radius:8px}
.dels{margin:0;padding:8px 12px 8px 32px}
@media (max-width:640px){:root{--code-size:13px}.toc,.toc-btn{display:none}body{font-size:15px}main{padding:24px 16px 80px}h1{font-size:24px}h2{font-size:20px;margin-top:48px;padding-top:28px}h3{font-size:17px;margin-top:32px;padding-top:20px}h2+h3,h2+ul+h3{margin-top:20px}.head{padding:6px 8px}.help ul{padding:10px 12px 10px 28px}}
</style>
</head>
<body>
<button class="toc-btn" aria-label="목차 열기">목차</button>
<aside class="toc">${toc}</aside>
<main>
<p class="hint">물음표 버튼은 그 파일의 코드 리뷰를 연다. 복사 버튼은 파일 전체를 복사한다.</p>
${body.join("\n")}
</main>
<script>
// 목차: 좁은 화면에서는 버튼으로 열고, 링크를 누르면 닫는다
const toc = document.querySelector(".toc")
document.querySelector(".toc-btn").addEventListener("click", () => toc.classList.toggle("open"))
toc.addEventListener("click", (e) => { if (e.target.closest("a")) toc.classList.remove("open") })

// 지금 보고 있는 장과 단계를 목차에서 강조하고, 그 장을 펼친다
const links = new Map([...toc.querySelectorAll("a")].map((a) => [decodeURIComponent(a.hash.slice(1)), a]))
const heads = [...document.querySelectorAll("main h2[id], main h3[id]")]
let active = null
function spy() {
  let cur = heads[0]
  for (const h of heads) if (h.getBoundingClientRect().top < 120) cur = h; else break
  const a = cur && links.get(cur.id)
  if (!a || a === active) return
  if (active) active.classList.remove("active")
  a.classList.add("active")
  const d = a.closest("details")
  if (d && !d.open) {
    toc.querySelectorAll("details[open]").forEach((x) => { if (x !== d) x.open = false })
    d.open = true
  }
  // 목차 안에서만 움직인다. 본문 스크롤은 건드리지 않는다
  const r = a.getBoundingClientRect(), t = toc.getBoundingClientRect()
  if (r.top < t.top || r.bottom > t.bottom) toc.scrollTop += r.top - t.top - t.height / 3
  active = a
}
document.addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true })
spy()

// 코드 리뷰: 코드 위에서 슬라이드로 열고 닫는다
document.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-help]")
  if (!b) return
  const open = document.getElementById(b.dataset.help).classList.toggle("open")
  b.setAttribute("aria-expanded", String(open))
})

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
  const old = b.innerHTML
  b.innerHTML = ${JSON.stringify(CHECK_ICON)}
  b.classList.add("done")
  setTimeout(() => { b.innerHTML = old; b.classList.remove("done") }, 1200)
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
