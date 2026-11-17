import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

test("S1 할 일 칸에 글을 쓰면 화면이 그 글을 기억해 칸에 보여준다", () => {
  render(<App />)
  const input = screen.getByPlaceholderText("할 일을 적어 주세요")
  fireEvent.change(input, { target: { value: "빨래하기" } })
  expect(input.value).toBe("빨래하기")
})

test("S2 추가를 누르거나 Enter를 치면 목록 맨 아래에 그 할 일이 더해지고 칸이 비워진다", () => {
  render(<App />)
  const input = screen.getByPlaceholderText("할 일을 적어 주세요")
  fireEvent.change(input, { target: { value: "빨래하기" } })
  fireEvent.click(screen.getByRole("button", { name: "추가" }))
  const items = screen.getAllByRole("listitem")
  expect(items).toHaveLength(4)
  expect(items[3].textContent).toContain("빨래하기")
  expect(input.value).toBe("")

  fireEvent.change(input, { target: { value: "청소하기" } })
  fireEvent.submit(input.closest("form"))
  expect(screen.getAllByRole("listitem")[4].textContent).toContain("청소하기")
})

test("S3 칸이 비었거나 빈칸만 있으면 추가를 눌러도 아무것도 더해지지 않는다", () => {
  render(<App />)
  const input = screen.getByPlaceholderText("할 일을 적어 주세요")
  fireEvent.click(screen.getByRole("button", { name: "추가" }))
  fireEvent.change(input, { target: { value: "   " } })
  fireEvent.click(screen.getByRole("button", { name: "추가" }))
  expect(screen.getAllByRole("listitem")).toHaveLength(3)
})
