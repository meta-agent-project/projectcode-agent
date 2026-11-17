import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

function rowOf(text) {
  return screen.getByText(text).closest("li")
}

test("S1 할 일마다 삭제 버튼이 있고, 누르면 그 할 일만 목록에서 사라진다", () => {
  render(<App />)
  expect(screen.getAllByRole("button", { name: "삭제" })).toHaveLength(3)
  fireEvent.click(within(rowOf("우유 사기")).getByRole("button", { name: "삭제" }))
  expect(screen.queryByText("우유 사기")).toBeNull()
  expect(screen.getAllByRole("listitem")).toHaveLength(2)
  expect(screen.getByText("운동하기")).toBeTruthy()
})

test("S2 삭제 버튼은 줄 오른쪽 끝에 흐린 글자 버튼으로 보인다", () => {
  render(<App />)
  const button = within(rowOf("우유 사기")).getByRole("button", { name: "삭제" })
  expect(button.className).toContain("button-text")
  expect(rowOf("우유 사기").className).toContain("row")
})
