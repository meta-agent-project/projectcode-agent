// projectcode 폴더 구조도 엔진
// 사용: node tree.mjs [앞 장 태그]
// 받은 폴더(현재 폴더)의 학생 코드를 나무 모양으로 보여주고, 앞 장 태그와 비교해 새로, 고침을 표시한다.

import { execSync } from "node:child_process"

const base = process.argv[2]
const git = (args) => execSync(`git ${args}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim()

const hidden = [".projectcode/", ".claude/", "tests/", "CLAUDE.md", ".gitignore"]
const isStudentFile = (file) => file && !hidden.some((h) => file === h || file.startsWith(h))

const files = git("ls-files --cached --others --exclude-standard").split("\n").filter(isStudentFile)

const marks = {}
if (base) {
  for (const line of git(`diff --name-status ${base}`).split("\n")) {
    const parts = line.split("\t")
    const file = parts[parts.length - 1]
    if (parts[0] === "A" || parts[0].startsWith("R")) marks[file] = "새로"
    else if (parts[0] === "M") marks[file] = "고침"
  }
  for (const file of git("ls-files --others --exclude-standard").split("\n")) {
    if (isStudentFile(file)) marks[file] = "새로"
  }
}

const root = {}
for (const file of files) {
  let node = root
  const names = file.split("/")
  names.forEach((name, i) => {
    if (i === names.length - 1) node[name] = file
    else node = node[name + "/"] ??= {}
  })
}

const lines = []
function print(node, depth) {
  const names = Object.keys(node).sort((a, b) => {
    const aDir = a.endsWith("/")
    const bDir = b.endsWith("/")
    if (aDir !== bDir) return aDir ? -1 : 1
    return a.localeCompare(b)
  })
  for (const name of names) {
    const value = node[name]
    const indent = "  ".repeat(depth)
    if (typeof value === "string") {
      const mark = marks[value] ? `   ${marks[value]}` : ""
      lines.push(`${indent}${name}${mark}`)
    } else {
      lines.push(`${indent}${name}`)
      print(value, depth + 1)
    }
  }
}
print(root, 0)

const header = base ? `비교 기준: ${base}. 새로 생긴 파일과 고친 파일을 표시했다.` : "첫 장이라 비교하지 않았다."
console.log(["# 폴더 구조", "", header, "", "```", ...lines, "```", ""].join("\n"))
