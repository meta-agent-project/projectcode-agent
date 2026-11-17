import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

function texts() {
  return screen.getAllByRole("listitem").map((item) => item.textContent)
}

test("S1 목록 위에 전체, 남은 일, 끝난 일 버튼이 있고, 누르면 목록에 그 조건의 할 일만 보인다. 처음은 전체다", () => {
  render(<App />)
  fireEvent.click(screen.getByLabelText("우유 사기"))
  expect(texts()).toHaveLength(3)

  fireEvent.click(screen.getByRole("button", { name: "남은 일" }))
  expect(texts()).toHaveLength(2)
  expect(texts().join()).not.toContain("우유 사기")

  fireEvent.click(screen.getByRole("button", { name: "끝난 일" }))
  expect(texts()).toHaveLength(1)
  expect(texts()[0]).toContain("우유 사기")

  fireEvent.click(screen.getByRole("button", { name: "전체" }))
  expect(texts()).toHaveLength(3)
})

test("S2 지금 고른 버튼은 진한 버튼으로, 나머지는 테두리 버튼으로 보인다", () => {
  render(<App />)
  expect(screen.getByRole("button", { name: "전체" }).className).toContain("button-primary")
  fireEvent.click(screen.getByRole("button", { name: "남은 일" }))
  expect(screen.getByRole("button", { name: "남은 일" }).className).toContain("button-primary")
  expect(screen.getByRole("button", { name: "전체" }).className).not.toContain("button-primary")
  expect(screen.getByRole("button", { name: "끝난 일" }).className).not.toContain("button-primary")
})
