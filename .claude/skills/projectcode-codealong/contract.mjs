// contract.md에서 예제마다 다른 값을 읽는다
// 폴더 표의 학생 코드, 실행 절의 줄(서버, 프론트, 실행, 빌드, 연결, 초기화), 캡처 표의 web 주소

import { readFileSync, existsSync } from "node:fs"

const text = existsSync(".projectcode/contract.md") ? readFileSync(".projectcode/contract.md", "utf8") : ""
const section = (title) => (text.split(new RegExp(`^## ${title}\\s*$`, "m"))[1] || "").split(/^## /m)[0]

function tableRow(title, key) {
  for (const line of section(title).split("\n")) {
    const cells = line.split("|").map((c) => c.trim())
    if (cells[1] === key) return cells[2]
  }
  return null
}

// - 빌드: npm run build 같은 줄을 { 빌드: "npm run build" }로 읽는다
const run = {}
for (const line of section("실행").split(/\r?\n/)) {
  const m = line.match(/^- ([^:]+): (.+)$/)
  if (m) run[m[1].trim()] = m[2].trim()
}

export const contract = {
  student: tableRow("폴더", "학생 코드"),
  run,
  links: (run["연결"] || "").split(",").map((s) => s.trim()).filter(Boolean),
  web: tableRow("캡처", "web"),
}

export function studentFolder(fromArg) {
  const student = fromArg || contract.student
  if (!student) {
    console.error("학생 코드 폴더를 모릅니다. contract.md 폴더 표에 학생 코드 줄을 적거나 --student를 주세요.")
    process.exit(1)
  }
  return student
}
