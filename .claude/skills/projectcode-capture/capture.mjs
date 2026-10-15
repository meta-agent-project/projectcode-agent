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
  // 받아 줄 곳이 없는 에러(Uncaught)는 console이 아니라 pageerror로 온다
  page.on("pageerror", (error) => logs.push(`Uncaught: ${error.message}`))
  // 서버로 간 요청의 주소, 토큰, 보낸 값, 응답 상태를 남긴다
  const requests = []
  page.on("requestfinished", async (request) => {
    if (!request.url().startsWith(spec.api)) return
    const response = await request.response()
    requests.push({
      method: request.method(),
      url: request.url(),
      authorization: request.headers()["authorization"] || null,
      body: request.postData() ? JSON.parse(request.postData()) : null,
      status: response ? response.status() : null,
    })
  })
  await page.goto(spec.web + (shot.path || "/"))
  for (const step of shot.steps || []) {
    if (step.fill) {
      // label이 없는 칸은 placeholder로 찾는다
      const byLabel = page.getByLabel(step.fill[0])
      const field = (await byLabel.count()) > 0 ? byLabel : page.getByPlaceholder(step.fill[0])
      await field.fill(step.fill[1])
    }
    if (step.click) {
      await page.getByRole("button", { name: step.click }).click()
      // 이미 조용했던 페이지는 networkidle이 바로 끝나므로 응답과 이동을 기다린다
      await page.waitForTimeout(1000)
    }
    if (step.reload) await page.reload()
    if (step.goto) await page.goto(spec.web + step.goto)
    await page.waitForLoadState("networkidle")
  }
  // hold가 있으면 그 API 응답을 붙잡아 둔 채 화면으로 가서 받는 중인 모습을 찍는다
  if (shot.hold) {
    const api = spec.api + shot.hold.api
    await page.route((url) => url.href === api, () => {})
    await page.goto(spec.web + shot.hold.path)
    // 애니메이션이 조금 돌아간 뒤 찍는다
    await page.waitForTimeout(700)
  }
  await page.screenshot({ path: join(outDir, shot.file), fullPage: true })
  if (shot.console) {
    writeFileSync(join(outDir, shot.file.replace(/\.png$/, ".console.txt")), logs.join("\n"))
  }
  if (shot.storage) {
    const items = await page.evaluate(() => ({ ...localStorage }))
    writeFileSync(join(outDir, shot.file.replace(/\.png$/, ".storage.json")), JSON.stringify(items, null, 2))
  }
  if (shot.requests) {
    writeFileSync(join(outDir, shot.file.replace(/\.png$/, ".requests.json")), JSON.stringify(requests, null, 2))
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
  const rows = spec.shots.map((s) => {
    const see = s.missing ? `${s.see} (fix 뒤 다시 찍지 못함)` : s.see
    return `| ${s.file} | ${spec.chapter} | ${s.task} | ${s.commit || ""} | ${s.screen} | ${see} |`
  })
  const lines = ["# 캡처", "", "| 파일 | 장 | task | 커밋 | 찍은 화면 | 보이는 것 |", "|---|---|---|---|---|---|", ...rows, ""]
  writeFileSync(join(outDir, "captures.md"), lines.join("\n"))
}

const { chromium } = loadPlaywright()
const browser = await chromium.launch()
for (const shot of spec.shots.filter((s) => isSelected(s) && !s.missing)) {
  if (shot.request) await takeRequest(shot)
  else await takeScreen(browser, shot)
  console.log("찍음:", shot.file)
}
await browser.close()
writeList()
