// projectcode 캡처 엔진
// 사용: node capture.mjs <shots.json> [--task T2 | --from T2]
// 앱은 미리 실행해 둔다. shots.json 옆에 사진과 JSON을 저장하고 captures.md를 다시 쓴다.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const [shotsPath, flag, value] = process.argv.slice(2)
const spec = JSON.parse(readFileSync(shotsPath, "utf8"))
const outDir = dirname(shotsPath)

function loadPlaywright() {
  const places = [process.cwd(), dirname(fileURLToPath(import.meta.url))]
  for (const place of places) {
    try {
      return createRequire(join(place, "x.js"))("playwright")
    } catch {}
  }
  console.error("playwright가 없습니다. 이 스킬 폴더에서 npm install을 실행하세요.")
  process.exit(1)
}

function isSelected(shot) {
  const order = [...new Set(spec.shots.map((s) => s.task))]
  if (flag === "--task") return shot.task === value
  if (flag === "--from") return order.indexOf(shot.task) >= order.indexOf(value)
  return true
}

async function takeScreen(browser, shot) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const logs = []
  page.on("console", (message) => logs.push(message.text()))
  await page.goto(spec.web + (shot.path || "/"))
  for (const step of shot.steps || []) {
    if (step.fill) await page.getByLabel(step.fill[0]).fill(step.fill[1])
    if (step.click) await page.getByRole("button", { name: step.click }).click()
    await page.waitForLoadState("networkidle")
  }
  await page.screenshot({ path: join(outDir, shot.file), fullPage: true })
  if (shot.console) {
    writeFileSync(join(outDir, shot.file.replace(/\.png$/, ".console.txt")), logs.join("\n"))
  }
  await page.close()
}

async function takeRequest(shot) {
  const { method, path, body } = shot.request
  const response = await fetch(spec.api + path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const result = { request: shot.request, status: response.status, response: await response.json() }
  writeFileSync(join(outDir, shot.file), JSON.stringify(result, null, 2))
}

function writeList() {
  const rows = spec.shots.map((s) => `| ${s.file} | ${spec.chapter} | ${s.task} | ${s.screen} | ${s.see} |`)
  const lines = ["# 캡처", "", "| 파일 | 장 | task | 찍은 화면 | 보이는 것 |", "|---|---|---|---|---|", ...rows, ""]
  writeFileSync(join(outDir, "captures.md"), lines.join("\n"))
}

const { chromium } = loadPlaywright()
const browser = await chromium.launch()
for (const shot of spec.shots.filter(isSelected)) {
  if (shot.request) await takeRequest(shot)
  else await takeScreen(browser, shot)
  console.log("찍음:", shot.file)
}
await browser.close()
writeList()
