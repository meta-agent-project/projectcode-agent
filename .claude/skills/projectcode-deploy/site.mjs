// projectcode 배포 사이트 엔진
// 사용: node site.mjs [사이트 폴더, 기본 _site]
// 저장소 루트에서 실행한다. 따라치기 결과 폴더를 복사하고, wiki를 wiki.html 한 장으로 만들고, 첫 화면 index.html을 쓴다.

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from "node:fs"
import { join, dirname } from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const out = process.argv[2] || "_site"
const here = dirname(fileURLToPath(import.meta.url))
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

mkdirSync(out, { recursive: true })
if (existsSync(".projectcode/code")) cpSync(".projectcode/code", out, { recursive: true })
writeFileSync(join(out, ".nojekyll"), "")

const hasWiki = existsSync(".projectcode/wiki/overview.md")
if (hasWiki) execFileSync("node", [join(here, "wiki.mjs"), join(out, "wiki.html")], { stdio: "inherit" })

const roadmap = existsSync(".projectcode/roadmap.md") ? readFileSync(".projectcode/roadmap.md", "utf8") : ""
const field = (key) => ((roadmap.match(new RegExp(`^${key}: (.+)$`, "m")) || [])[1] || "").trim()
const lecture = field("강의") || "강의 예제"

const cards = []
if (existsSync(join(out, "따라치기.html"))) cards.push(["따라치기.html", "따라치기", "1장부터 모든 단계를 한 단계씩 따라 쳐요"])
if (hasWiki) cards.push(["wiki.html", "wiki", "처음 보는 사람을 위한 안내. 장 지도, 요청 흐름 그림, 실행 화면, 점검 결과"])

writeFileSync(
  join(out, "index.html"),
  `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(lecture)}</title>
<style>
:root{--bg:#ffffff;--fg:#111111;--muted:#666666;--line:#111111}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif;word-break:keep-all}
main{max-width:640px;margin:0 auto;padding:64px 16px}
.eyebrow{margin:0 0 8px;font-size:13px;letter-spacing:.08em;color:var(--muted);font-family:ui-monospace,Consolas,monospace}
h1{font-size:clamp(28px,6vw,36px);line-height:1.25;margin:0 0 12px;letter-spacing:-.02em}
p.lead{color:var(--muted);margin:0 0 32px}
a.card{display:block;padding:20px 24px;margin-bottom:16px;border:1.5px solid var(--line);border-radius:12px;box-shadow:3px 3px 0 var(--line);color:var(--fg);text-decoration:none;transition:transform .1s}
a.card:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--line)}
a.card strong{display:block;font-size:20px;margin-bottom:4px}
a.card span{color:var(--muted);font-size:15px}
</style>
</head>
<body>
<main>
<p class="eyebrow">강의 예제</p>
<h1>${esc(lecture)}</h1>
<p class="lead">${esc(field("목표"))}</p>
${cards.map(([href, t, d]) => `<a class="card" href="${href}"><strong>${esc(t)}</strong><span>${esc(d)}</span></a>`).join("\n")}
</main>
</body>
</html>
`,
)
console.log(`썼음: ${out}/index.html`)
