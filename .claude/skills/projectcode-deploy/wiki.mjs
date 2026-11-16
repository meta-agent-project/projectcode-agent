// projectcode wiki 한 장 엔진
// 사용: node wiki.mjs <출력 html>
// 저장소 루트에서 실행한다. roadmap.md, wiki/*.md, 장 사진을 읽어 처음 보는 사람도 위에서 아래로 읽히는 문서 한 장을 쓴다.
// 그림 파일은 출력 html 옆 files/ 아래로 복사한다.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs"
import { join, dirname, basename, extname, resolve, relative } from "node:path"

const outFile = process.argv[2] || "_site/wiki.html"
const outDir = dirname(outFile)
const P = ".projectcode"
const read = (f) => (existsSync(f) ? readFileSync(f, "utf8").replace(/\r\n/g, "\n") : "")
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// md 조각 읽기
const sections = (md, level = 2) => {
  const re = new RegExp(`^${"#".repeat(level)} (.+)$`, "m")
  const parts = md.split(new RegExp(`^(?=${"#".repeat(level)} )`, "m"))
  return parts.filter((p) => re.test(p)).map((p) => ({ title: p.match(re)[1].trim(), body: p.replace(re, "") }))
}
const section = (md, title) => (sections(md).find((s) => s.title === title) || { body: "" }).body
const bullets = (md) => [...md.matchAll(/^\s*- (.+)$/gm)].map((m) => m[1].trim())
const field = (md, key) => ((md.match(new RegExp(`^${key}: (.+)$`, "m")) || [])[1] || "").trim()
const fences = (md) => [...md.matchAll(/^```(\w*)\n([\s\S]*?)^```/gm)].map((m) => ({ lang: m[1], body: m[2].replace(/\n$/, "") }))
function table(md) {
  const rows = md.split("\n").filter((l) => l.startsWith("|"))
  if (rows.length < 2) return []
  const cells = (r) => r.replace(/^\||\|\s*$/g, "").split("|").map((c) => c.trim())
  const head = cells(rows[0])
  return rows.slice(2).map((r) => Object.fromEntries(cells(r).map((c, i) => [head[i], c])))
}

const roadmap = read(`${P}/roadmap.md`)
const wiki = Object.fromEntries(["overview", "concepts", "scenarios", "screens", "erd", "tree", "check"].map((n) => [n, read(`${P}/wiki/${n}.md`)]))

const lecture = field(roadmap, "강의") || "강의 예제"
const goal = field(roadmap, "목표")
const target = field(roadmap, "대상")
const result = field(roadmap, "결과물")
const prereq = bullets(section(roadmap, "선수 지식"))
const goals = bullets(section(roadmap, "학습 목표"))
const howto = bullets(section(roadmap, "진행 방식"))
const later = bullets(section(roadmap, "미룬 것"))
const never = bullets(section(roadmap, "하지 않는 것"))

const counts = {}
for (const r of table(wiki.overview)) {
  const id = (r["장"] || "").split(" ")[0]
  counts[id] = { task: r["task"], shot: r["사진"] }
}
const chapters = table(section(roadmap, "장")).map((r) => ({
  no: r["번호"],
  id: r["장 ID"],
  name: r["이름"],
  kind: r["종류"],
  learn: (r["배울 것"] || "").split(/,\s*/).filter(Boolean),
  problem: r["보여 줄 문제"] && r["보여 줄 문제"] !== "-" ? r["보여 줄 문제"] : "",
  mode: r["진행"] || "",
  state: r["상태"] || "",
  ...(counts[r["장 ID"]] || {}),
}))
const byId = Object.fromEntries(chapters.map((c) => [c.id, c]))

// 장 끝 사진: captures.md의 done 줄
const doneShots = (id) =>
  table(read(`${P}/chapters/${id}/captures/captures.md`))
    .filter((r) => r["task"] === "done")
    .map((r) => ({ file: r["파일"], screen: r["찍은 화면"], see: r["보이는 것"], path: `${P}/chapters/${id}/captures/${r["파일"]}` }))
    .filter((s) => existsSync(s.path))

function asset(path) {
  const inside = relative(resolve(P), resolve(path)).replace(/\\/g, "/")
  const to = join(outDir, "files", inside)
  mkdirSync(dirname(to), { recursive: true })
  cpSync(path, to)
  return "files/" + inside.split("/").map(encodeURIComponent).join("/")
}

// 콘솔 출력을 터미널 모양으로 바꾼다
// 사진 파일은 $ 명령 줄, (입력) 줄들, (출력) 줄들로 되어 있다. 명령 줄은 보여 주지 않는다
// 출력에는 학생이 친 값이 없어서 프롬프트가 붙어 보인다. > 와 짧은 "이름: " 프롬프트마다 입력을 끼워 넣어 실제 화면처럼 보여 준다
function runs(text) {
  const out = []
  let cur = null
  let part = "out"
  for (const l of text.replace(/\n$/, "").split("\n")) {
    if (l.startsWith("$ ")) {
      cur = { input: [], output: [] }
      out.push(cur)
      part = "out"
      continue
    }
    if (!cur) out.push((cur = { input: [], output: [] }))
    if (l === "(입력)") part = "in"
    else if (l === "(출력)") part = "out"
    else if (part === "in") cur.input.push(l)
    else cur.output.push(l)
  }
  return out.filter((r) => r.input.length || r.output.join("").trim())
}
const kbd = (v) => `<kbd>${esc(v) || "Enter"}</kbd>`
function weave({ input, output }) {
  const keys = [...input]
  const lines = []
  for (const l of output) {
    if (!l.startsWith("> ") || !keys.length) {
      lines.push(esc(l))
      continue
    }
    let rest = l.slice(2)
    lines.push(`<span class="pr">&gt;</span> ${kbd(keys.shift())}`)
    let m
    while (keys.length && (m = rest.match(/^([^:>]{1,10}: )/))) {
      lines.push(`<span class="pr">${esc(m[1])}</span>${kbd(keys.shift())}`)
      rest = rest.slice(m[1].length)
    }
    if (rest) lines.push(esc(rest))
  }
  const left = keys.length ? `<div class="left">남은 입력 ${keys.map(kbd).join("")}</div>` : ""
  return lines.map((l) => `<div class="ln">${l || "&nbsp;"}</div>`).join("") + left
}
function terminal(text, title = "") {
  const rs = runs(text)
  const body = rs
    .map((r, i) => `${rs.length > 1 ? `<div class="run">실행 ${i + 1}</div>` : ""}${r.input.length ? `<div class="keys">입력한 값 ${r.input.map(kbd).join("")}</div>` : ""}<div class="screen-out">${weave(r)}</div>`)
    .join("")
  return `<figure class="term"><div class="term-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div><div class="term-body">${body}</div></figure>`
}
function shot(s) {
  const ext = extname(s.file).toLowerCase()
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"].includes(ext)) return `<figure class="pic"><img src="${asset(s.path)}" alt="${esc(s.screen)}" loading="lazy"></figure>`
  if (ext === ".json") return terminal(read(s.path), s.screen)
  return terminal(read(s.path), s.screen)
}

const chip = (t, cls = "") => `<span class="chip ${cls}">${esc(t)}</span>`
const chLink = (id) => (byId[id] ? `<a class="chip ch" href="#ch-${id}">${esc(byId[id].no)} ${esc(id)}</a>` : chip(id))

// 1 머리
const totalTask = chapters.reduce((n, c) => n + (+c.task || 0), 0)
const totalShot = chapters.reduce((n, c) => n + (+c.shot || 0), 0)
const done = chapters.filter((c) => c.state === "완료").length
const testLine = (table(wiki.check).find((r) => r["점검"] === "테스트") || {})["결과"] || ""
const testCount = (testLine.match(/(\d+)개 통과/) || [])[1]
const stats = [
  [`${done}/${chapters.length}`, "장 완료"],
  [totalTask, "task"],
  [totalShot, "실행 사진"],
  ...(testCount ? [[testCount, "테스트 통과"]] : []),
]
const hero = `<header class="hero" id="top">
  <p class="eyebrow">강의 예제 wiki</p>
  <h1>${esc(lecture)}</h1>
  ${goal ? `<p class="lead">${esc(goal)}</p>` : ""}
  <dl class="facts">
    ${target ? `<div><dt>누구를 위한</dt><dd>${esc(target)}</dd></div>` : ""}
    ${result ? `<div><dt>다 만들면</dt><dd>${esc(result)}</dd></div>` : ""}
  </dl>
  <ul class="stats">${stats.map(([n, t]) => `<li><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join("")}</ul>
  <p class="actions"><a class="btn primary" href="따라치기.html">따라치기 시작</a><a class="btn" href="#map">장 지도 보기</a></p>
</header>`

// 2 시작하기 전에
const start = `<section id="start"><h2><span class="num">1</span>시작하기 전에</h2>
  <div class="grid3">
    <div class="box"><h3>알고 오면 좋아요</h3><ul>${prereq.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    <div class="box"><h3>이 강의에서 배워요</h3><ul>${goals.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
    ${howto.length ? `<div class="box"><h3>이렇게 진행해요</h3><ul>${howto.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>` : ""}
  </div></section>`

// 3 장 지도
const kindCls = (k) => (k === "리팩터" ? "refactor" : "feature")
const map = `<section id="map"><h2><span class="num">2</span>장 지도</h2>
  <p class="hint">장마다 먼저 문제를 겪고, 배울 것으로 고쳐요. 장을 누르면 그 장 끝의 실행 결과가 열려요.</p>
  <ol class="timeline">${chapters
    .map((c) => {
      const shots = doneShots(c.id)
      return `<li class="step" id="ch-${esc(c.id)}"><details>
      <summary>
        <span class="dot">${esc(c.no)}</span>
        <span class="step-head">
          <span class="step-title">${esc(c.name)} <code>${esc(c.id)}</code></span>
          <span class="step-meta">${chip(c.kind, kindCls(c.kind))}${c.mode ? chip(c.mode, "mode") : ""}${c.task ? `<span class="muted">task ${esc(c.task)} · 사진 ${esc(c.shot)}</span>` : ""}</span>
          ${c.problem ? `<span class="problem"><b>문제</b>${esc(c.problem)}</span>` : ""}
          <span class="learn"><b>배울 것</b>${c.learn.map((l) => chip(l, "learn")).join("")}</span>
        </span>
      </summary>
      <div class="step-body">${shots.length ? shots.map((s) => `<p class="see">${esc(s.see)}</p>${shot(s)}`).join("") : `<p class="muted">장 끝 사진이 없어요.</p>`}</div>
    </details></li>`
    })
    .join("")}</ol></section>`

// 4 개념 사전
const conceptRows = table(section(wiki.concepts, "배울 것과 처음 나온 장"))
const concepts = `<section id="concepts"><h2><span class="num">3</span>개념은 어디서 처음 나오나</h2>
  <div class="dict">${conceptRows
    .map((r) => `<div class="term-row"><span class="terms">${(r["배울 것"] || "").split(/,\s*/).map((t) => `<b>${esc(t)}</b>`).join("")}</span>${chLink(r["장"])}</div>`)
    .join("")}</div></section>`

// 5 흐름 그림
const scen = sections(wiki.scenarios).map((s, i) => {
  const diagram = fences(s.body).find((f) => f.lang === "mermaid")
  const made = field(s.body, "만든 장").split(/,\s*/).filter(Boolean)
  const files = bullets(s.body.split("맡는 파일")[1] || "")
  return { i, title: s.title, diagram, made, files }
})
const flows = `<section id="flows"><h2><span class="num">4</span>요청은 이렇게 흘러가요</h2>
  <p class="hint">사용자가 하는 일 하나마다 코드를 지나가는 길이에요. 화살표를 따라 읽어요.</p>
  <div class="tabs" role="tablist">${scen.map((s) => `<button role="tab" data-tab="flow-${s.i}"${s.i ? "" : ' aria-selected="true"'}>${esc(s.title)}</button>`).join("")}</div>
  ${scen
    .map(
      (s) => `<div class="panel" id="flow-${s.i}"${s.i ? " hidden" : ""}>
    ${s.diagram ? `<div class="diagram"><pre class="mermaid">${esc(s.diagram.body)}</pre></div>` : ""}
    ${s.made.length ? `<p class="made"><b>만든 장</b>${s.made.map(chLink).join("")}</p>` : ""}
    ${s.files.length ? `<details class="files"><summary>맡는 파일 ${s.files.length}개</summary><ul>${s.files.map((f) => `<li><code>${esc(f)}</code></li>`).join("")}</ul></details>` : ""}
  </div>`,
    )
    .join("")}</section>`

// 6 실행 화면
const screenList = sections(wiki.screens).map((s, i) => {
  const first = (s.body.match(/처음 나온 장: (\S+)/) || [])[1]
  const paths = bullets(s.body)
    .filter((b) => /\.\w+$/.test(b) && b.includes("/"))
    .map((b) => resolve(`${P}/wiki`, b))
    .filter((f) => existsSync(f))
  return { i, title: s.title, first, paths }
}).filter((s) => s.paths.length)
const screens = `<section id="screens"><h2><span class="num">5</span>실행하면 이렇게 보여요</h2>
  <p class="hint">지금 코드로 실행한 마지막 모습이에요. 같은 화면이 장마다 어떻게 바뀌었는지는 아래 고르기로 봐요.</p>
  <div class="screens">${screenList
    .map((s) => {
      const id = (p) => basename(dirname(dirname(p)))
      const last = s.paths[s.paths.length - 1]
      return `<article class="screen">
      <header><h3>${esc(s.title)}</h3>${s.first ? `<span class="muted">처음 나온 장</span>${chLink(s.first)}` : ""}</header>
      ${
        s.paths.length > 1
          ? `<label class="pick">장 <select data-screen="sc-${s.i}">${s.paths.map((p, n) => `<option value="${n}"${p === last ? " selected" : ""}>${esc(byId[id(p)]?.no || "")} ${esc(id(p))}</option>`).join("")}</select></label>`
          : ""
      }
      ${s.paths.map((p, n) => `<div class="sc-${s.i}" data-n="${n}"${p === last ? "" : " hidden"}>${shot({ file: basename(p), screen: id(p), path: p })}</div>`).join("")}
    </article>`
    })
    .join("")}</div></section>`

// 7 코드와 데이터
const treeBlock = fences(wiki.tree).find((f) => !f.lang)
const erdBlock = fences(wiki.erd).find((f) => f.lang === "mermaid")
const erdNotes = bullets(wiki.erd)
const code = `<section id="code"><h2><span class="num">6</span>코드와 데이터</h2>
  <div class="grid2">
    ${treeBlock ? `<div class="box"><h3>폴더 구조 <span class="muted">${esc(field(wiki.tree, "기준 장"))} 기준</span></h3><pre class="tree">${esc(treeBlock.body)}</pre></div>` : ""}
    ${erdBlock ? `<div class="box"><h3>저장하는 데이터</h3><div class="diagram"><pre class="mermaid">${esc(erdBlock.body)}</pre></div><ul>${erdNotes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>` : ""}
  </div></section>`

// 8 점검과 범위
const checks = table(wiki.check)
const issues = bullets(section(wiki.check, "어긋난 것"))
const status = (t) => (/^맞음/.test(t) ? "ok" : /어긋|다르|없/.test(t) ? "warn" : "info")
const check = `<section id="check"><h2><span class="num">7</span>점검과 범위</h2>
  <ul class="checks">${checks.map((r) => `<li class="${status(r["결과"])}"><b>${esc(r["점검"])}</b><span>${esc((r["결과"] || "").replace(/^맞음\.\s*/, ""))}</span></li>`).join("")}</ul>
  ${issues.length ? `<div class="callout"><h3>고칠 것 ${issues.length}개</h3><ul>${issues.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>` : `<p class="callout ok">고칠 것이 없어요.</p>`}
  <div class="grid2">
    <div class="box"><h3>나중으로 미룬 것</h3><ul>${later.map((l) => `<li>${esc(l)}</li>`).join("") || "<li>없음</li>"}</ul></div>
    <div class="box"><h3>다루지 않는 것</h3><ul>${never.map((l) => `<li>${esc(l)}</li>`).join("") || "<li>없음</li>"}</ul></div>
  </div></section>`

const toc = [
  ["start", "시작하기 전에"],
  ["map", "장 지도"],
  ["concepts", "개념"],
  ["flows", "요청 흐름"],
  ["screens", "실행 화면"],
  ["code", "코드와 데이터"],
  ["check", "점검과 범위"],
]

// 검정 펜: 흰 바탕, 검정 선, 오프셋 그림자
const THEME = `--bg:#ffffff;--fg:#111111;--muted:#666666;--line:#111111;--soft:#f4f4f2;--accent:#111111;--accent-fg:#ffffff;
    --card:#ffffff;--shadow:3px 3px 0 #111111;--radius:10px;--border:1.5px;--feature:#fff3b0;--refactor:#d7ecff;--problem:#ffe3e3;--hero:#ffffff;`

const css = `
:root{${THEME}--mono:ui-monospace,SFMono-Regular,Consolas,"D2Coding",monospace;--toc:220px}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard","Malgun Gothic",sans-serif;word-break:keep-all;overflow-wrap:anywhere}
a{color:inherit}
code,pre{font-family:var(--mono)}
.progress{position:fixed;top:0;left:0;height:3px;background:var(--accent);width:0;z-index:20}
.layout{display:grid;grid-template-columns:var(--toc) minmax(0,1fr);max-width:1180px;margin:0 auto;gap:40px;padding:0 24px}
nav.toc{position:sticky;top:0;align-self:start;height:100vh;padding:40px 0;font-size:14px}
nav.toc .brand{font-weight:700;display:block;margin-bottom:16px;text-decoration:none;line-height:1.4}
nav.toc a.item{display:flex;gap:10px;align-items:center;padding:7px 10px;border-radius:8px;text-decoration:none;color:var(--muted)}
nav.toc a.item i{font-style:normal;font-family:var(--mono);font-size:12px;width:20px;height:20px;border-radius:50%;display:inline-grid;place-items:center;border:1px solid var(--line)}
nav.toc a.item.on{color:var(--fg);background:var(--soft);font-weight:600}
nav.toc a.item.on i{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
nav.toc .cta{display:block;margin-top:20px;text-align:center}
main{min-width:0;padding:40px 0 96px}
.hero{background:var(--hero);border:var(--border) solid var(--line);border-radius:calc(var(--radius) * 1.4);padding:40px;box-shadow:var(--shadow)}
.hero{color:var(--hero-fg,var(--fg))}.hero .facts div,.hero .stats li{color:var(--fg)}.hero .lead{color:inherit}
.hero .btn{color:var(--fg)}
.hero .btn.primary{background:var(--hero-btn,var(--accent));color:var(--hero-btn-fg,var(--accent-fg));border-color:var(--hero-btn,var(--accent))}
.eyebrow{margin:0 0 8px;font-size:13px;letter-spacing:.08em;color:inherit;opacity:.65;font-family:var(--mono)}
h1{font-size:clamp(28px,4vw,40px);line-height:1.25;margin:0 0 12px;letter-spacing:-.02em}
.lead{font-size:18px;margin:0 0 24px;color:var(--fg)}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin:0 0 24px}
.facts div{background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:12px 16px}
.facts dt{font-size:12px;color:var(--muted)}.facts dd{margin:0;font-weight:600}
.stats{list-style:none;padding:0;margin:0 0 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px}
.stats li{background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:14px 16px}
.stats b{display:block;font-size:26px;line-height:1.2;font-family:var(--mono)}.stats span{font-size:13px;color:var(--muted)}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin:0}
.btn{display:inline-block;padding:10px 18px;border-radius:999px;border:var(--border) solid var(--line);background:var(--card);text-decoration:none;font-weight:600;font-size:15px}
.btn.primary{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
section{padding-top:64px;scroll-margin-top:16px}
h2{font-size:26px;margin:0 0 8px;display:flex;align-items:center;gap:12px;letter-spacing:-.01em}
h2 .num{font-family:var(--mono);font-size:14px;width:30px;height:30px;border-radius:50%;display:inline-grid;place-items:center;background:var(--accent);color:var(--accent-fg);flex:none}
h3{font-size:17px;margin:0 0 10px}
.hint{color:var(--muted);margin:0 0 20px}
.muted{color:var(--muted);font-size:13px}
.grid2,.grid3{display:grid;gap:16px}
.grid2{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.grid3{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.box{background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow);min-width:0}
.box ul{margin:0;padding-left:18px}.box li{margin:4px 0}
.chip{display:inline-block;font-size:12.5px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid var(--line);background:var(--card);margin:2px 6px 2px 0;white-space:nowrap;text-decoration:none}
.chip.feature{background:var(--feature)}.chip.refactor{background:var(--refactor)}
.chip.mode{color:var(--muted)}
.chip.ch{font-family:var(--mono);font-size:12px}.chip.ch:hover{border-color:var(--accent)}
.chip.learn{background:var(--soft)}
.timeline{list-style:none;margin:0;padding:0;position:relative}
.timeline:before{content:"";position:absolute;left:19px;top:24px;bottom:24px;border-left:2px dashed var(--line)}
.step{position:relative;margin:0 0 14px;scroll-margin-top:16px}
.step details{background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);margin-left:52px}
.step summary{list-style:none;cursor:pointer;padding:16px 20px;display:block}
.step summary::-webkit-details-marker{display:none}
.step summary:after{content:"+";position:absolute;right:20px;top:16px;font-family:var(--mono);color:var(--muted)}
.step details[open] summary:after{content:"−"}
.dot{position:absolute;left:0;top:14px;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-family:var(--mono);font-weight:700;background:var(--accent);color:var(--accent-fg);border:3px solid var(--bg)}
.step-head{display:grid;gap:6px;padding-right:20px}
.step-title{font-weight:700;font-size:17px}.step-title code{font-size:12.5px;color:var(--muted);font-weight:400;margin-left:6px}
.step-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px}
.problem{background:var(--problem);border-radius:8px;padding:8px 12px;font-size:14.5px}
.problem b,.learn b,.made b{font-size:12px;margin-right:8px;color:var(--muted);font-weight:600}
.learn{font-size:14px}
.step-body{padding:0 20px 20px;border-top:1px solid var(--line)}
.see{font-size:14px;color:var(--muted);margin:16px 0 8px}
.term{margin:0 0 12px;border-radius:var(--radius);overflow:hidden;border:var(--border) solid #1f2328;background:#0f1419}
.term-bar{display:flex;align-items:center;gap:6px;padding:8px 12px;background:#1f2328;color:#9aa4b2;font-size:12px}
.term-bar i{width:10px;height:10px;border-radius:50%;background:#3d444d}.term-bar span{margin-left:6px;font-family:var(--mono)}
.term-body{max-height:480px;overflow:auto;padding:6px 0 10px;color:#e6edf3;font-family:var(--mono);font-size:14px}
.term .run{margin:10px 16px 0;padding-top:10px;border-top:1px dashed #3d444d;color:#7d8590;font-size:12px}
.term .run:first-child{border-top:0;padding-top:0}
.term .keys{margin:10px 16px 6px;color:#9aa4b2;font-size:12px;display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.term .screen-out{padding:8px 16px 0;white-space:pre}
.term .ln{line-height:1.9;min-height:1.9em}
.term .pr{color:#7ee787}
.term kbd{display:inline-block;font-family:var(--mono);font-size:13px;line-height:1.5;padding:0 8px;border-radius:5px;background:#f2cc60;color:#111;font-weight:700;box-shadow:0 2px 0 #9e7a1a;margin:0 2px}
.term .keys kbd{background:#30363d;color:#e6edf3;box-shadow:0 2px 0 #161b22}
.term .left{margin-top:8px;color:#7d8590;font-size:12px}
.pic img{max-width:100%;border-radius:var(--radius);border:var(--border) solid var(--line)}
.dict{display:grid;gap:8px}
.term-row{display:flex;justify-content:space-between;align-items:center;gap:12px;background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:10px 16px;box-shadow:var(--shadow)}
.terms{display:flex;flex-wrap:wrap;gap:4px 14px}.terms b{font-weight:600}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.tabs button{font:inherit;font-size:14px;padding:6px 14px;border-radius:999px;border:var(--border) solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.tabs button[aria-selected=true]{background:var(--accent);color:var(--accent-fg);border-color:var(--accent)}
.diagram{background:#ffffff;border:var(--border) solid var(--line);border-radius:var(--radius);padding:16px;overflow:hidden;box-shadow:var(--shadow)}
.diagram pre.mermaid{margin:0;text-align:center;font-size:13px;color:#111}
.made{margin:12px 0 4px;font-size:14px}
details.files{margin-top:8px;font-size:14px}details.files summary{cursor:pointer;color:var(--muted)}
details.files ul{columns:2;column-gap:24px;padding-left:18px}details.files code{font-size:12.5px}
.screens{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));gap:16px}
.screen{background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:16px;box-shadow:var(--shadow);min-width:0}
.screen header{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px}.screen h3{margin:0 8px 0 0}
.pick{display:block;font-size:13px;color:var(--muted);margin-bottom:8px}
.pick select{font:inherit;font-size:13px;padding:3px 6px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--fg)}
pre.tree{margin:0;font-size:13px;line-height:1.6;overflow-x:auto;background:var(--soft);padding:12px;border-radius:8px}
.checks{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:8px}
.checks li{display:grid;grid-template-columns:110px 1fr;gap:12px;background:var(--card);border:var(--border) solid var(--line);border-radius:var(--radius);padding:10px 16px;font-size:14.5px}
.checks li b:before{content:"●";margin-right:8px;font-size:11px;vertical-align:2px}
.checks li.ok b:before{color:#2da44e}.checks li.warn b:before{color:#d4a72c}.checks li.info b:before{color:#8c959f}
.callout{background:var(--problem);border:var(--border) solid var(--line);border-radius:var(--radius);padding:16px 20px;margin:0 0 16px}
.callout.ok{background:var(--feature)}.callout ul{margin:0;padding-left:18px}
footer.end{margin-top:64px;color:var(--muted);font-size:13px}
@media (max-width:960px){
  .layout{display:block;padding:0 16px}
  nav.toc{position:sticky;top:0;height:auto;z-index:10;background:var(--bg);padding:8px 0;margin:0 -16px;display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid var(--line);scrollbar-width:none}
  nav.toc::-webkit-scrollbar{display:none}
  nav.toc .brand,nav.toc .cta{display:none}
  nav.toc a.item{white-space:nowrap;padding:6px 10px;flex:none}
  main{padding-top:20px}
  .hero{padding:24px 20px}
}
@media (max-width:640px){
  section{padding-top:48px}
  .timeline:before{left:15px}.dot{width:32px;height:32px;font-size:13px;top:16px}
  .step details{margin-left:42px}.step summary{padding:14px 16px}
  .checks li{grid-template-columns:1fr;gap:2px}
  details.files ul{columns:1}
  .term-row{flex-direction:column;align-items:flex-start}
}
`

const js = `<script type="module">
import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs"
mermaid.initialize({ startOnLoad: false, theme: "base", fontFamily: "-apple-system, Segoe UI, Malgun Gothic, sans-serif",
  themeVariables: { primaryColor: "#ffffff", primaryTextColor: "#111111", primaryBorderColor: "#111111", lineColor: "#111111", fontSize: "15px" },
  flowchart: { useMaxWidth: false }, er: { useMaxWidth: false } })
// 가로 스크롤 없이: 넓으면 줄이고, 너무 작아지면 세로로 다시 그린다
const fit = async (nodes) => {
  const again = []
  for (const pre of nodes) {
    const svg = pre.querySelector("svg")
    if (!svg) continue
    const natural = svg.viewBox.baseVal.width || svg.getBBox().width
    const avail = pre.clientWidth
    if (natural * 0.75 > avail && /^flowchart LR/m.test(pre.dataset.src) && !pre.dataset.turned) {
      pre.dataset.turned = "1"
      pre.removeAttribute("data-processed")
      pre.textContent = pre.dataset.src.replace(/^flowchart LR/m, "flowchart TB")
      again.push(pre)
      continue
    }
    svg.style.maxWidth = Math.min(natural, avail) + "px"
    svg.style.width = "100%"
    svg.style.height = "auto"
  }
  if (again.length) { await mermaid.run({ nodes: again }); await fit(again) }
}
document.querySelectorAll("pre.mermaid").forEach((p) => (p.dataset.src = p.textContent))
const draw = async (root) => {
  const nodes = [...root.querySelectorAll("pre.mermaid:not([data-processed])")].filter((n) => n.offsetParent)
  if (!nodes.length) return
  await mermaid.run({ nodes })
  await fit(nodes)
}
draw(document)
document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => {
  b.parentElement.querySelectorAll("button").forEach((x) => x.setAttribute("aria-selected", x === b))
  document.querySelectorAll("#flows .panel").forEach((p) => (p.hidden = p.id !== b.dataset.tab))
  draw(document.getElementById(b.dataset.tab))
}))
document.querySelectorAll("select[data-screen]").forEach((s) => s.addEventListener("change", () => {
  document.querySelectorAll("." + s.dataset.screen).forEach((d) => (d.hidden = d.dataset.n !== s.value))
}))
const open = () => { const t = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t && t.tagName === "LI") t.querySelector("details").open = true }
addEventListener("hashchange", open); open()
const items = [...document.querySelectorAll("nav.toc a.item")]
const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) items.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id)) }), { rootMargin: "-30% 0px -65% 0px" })
document.querySelectorAll("main > section").forEach((s) => spy.observe(s))
const bar = document.querySelector(".progress")
addEventListener("scroll", () => { const h = document.documentElement; bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%" }, { passive: true })
</script>`

mkdirSync(outDir, { recursive: true })
writeFileSync(
  outFile,
  `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(lecture)} wiki</title>
<style>${css}</style>
</head>
<body>
<div class="progress"></div>
<div class="layout">
<nav class="toc"><a class="brand" href="#top">${esc(lecture)}</a>${toc.map(([id, t], i) => `<a class="item" href="#${id}"><i>${i + 1}</i>${esc(t)}</a>`).join("")}<a class="btn primary cta" href="따라치기.html">따라치기 시작</a></nav>
<main>
${hero}
${start}
${map}
${concepts}
${flows}
${screens}
${code}
${check}
<footer class="end">.projectcode/wiki와 roadmap.md로 만든 문서예요.</footer>
</main>
</div>
${js}
</body>
</html>
`,
)
console.log(`썼음: ${outFile}`)
