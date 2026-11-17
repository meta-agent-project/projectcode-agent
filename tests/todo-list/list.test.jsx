import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

test("S1 첫 화면에 미리 넣어 둔 할 일 세 개가 목록으로 보인다", () => {
  render(<App />)
  expect(screen.getAllByRole("listitem")).toHaveLength(3)
  expect(screen.getByText("우유 사기")).toBeTruthy()
  expect(screen.getByText("React 공부하기")).toBeTruthy()
  expect(screen.getByText("운동하기")).toBeTruthy()
})

test("S2 목록은 글머리 기호 없이 한 줄에 하나씩 간격을 두고 보인다", () => {
  render(<App />)
  const list = screen.getByRole("list")
  expect(list.className).toContain("todo-list")
  expect(list.className).toContain("stack")
})
