import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

function clickIn(text, name) {
  const row = screen.getByText(text).closest("li")
  fireEvent.click(within(row).getByRole("button", { name: name }))
}

test("S1 할 일마다 수정 버튼이 있고, 누르면 그 줄만 지금 글이 든 고치는 칸과 취소 버튼으로 바뀌고, 취소를 누르면 고친 글은 버리고 원래 줄로 돌아온다", () => {
  render(<App />)
  expect(screen.getAllByRole("button", { name: "수정" })).toHaveLength(3)
  clickIn("우유 사기", "수정")
  const field = screen.getByDisplayValue("우유 사기")
  expect(screen.getAllByRole("button", { name: "수정" })).toHaveLength(2)
  fireEvent.change(field, { target: { value: "두유 사기" } })
  fireEvent.click(screen.getByRole("button", { name: "취소" }))
  expect(screen.queryByDisplayValue("두유 사기")).toBeNull()
  expect(screen.getByText("우유 사기")).toBeTruthy()
  expect(screen.getAllByRole("button", { name: "수정" })).toHaveLength(3)
})

test("S2 고치는 칸에서 저장을 누르거나 Enter를 치면 고친 글이 목록에 보이고 원래 줄 모양으로 돌아온다", () => {
  render(<App />)
  clickIn("우유 사기", "수정")
  fireEvent.change(screen.getByDisplayValue("우유 사기"), { target: { value: "두유 사기" } })
  fireEvent.click(screen.getByRole("button", { name: "저장" }))
  expect(screen.getByText("두유 사기")).toBeTruthy()
  expect(screen.queryByText("우유 사기")).toBeNull()
  expect(screen.getAllByRole("button", { name: "수정" })).toHaveLength(3)

  clickIn("운동하기", "수정")
  const field = screen.getByDisplayValue("운동하기")
  fireEvent.change(field, { target: { value: "산책하기" } })
  fireEvent.submit(field.closest("form"))
  expect(screen.getByText("산책하기")).toBeTruthy()
})

test("S3 고치는 칸이 비었거나 빈칸만 있으면 저장을 눌러도 글이 바뀌지 않는다", () => {
  render(<App />)
  clickIn("우유 사기", "수정")
  const field = screen.getByDisplayValue("우유 사기")
  fireEvent.change(field, { target: { value: "   " } })
  fireEvent.click(screen.getByRole("button", { name: "저장" }))
  expect(screen.getByRole("button", { name: "저장" })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "취소" }))
  expect(screen.getByText("우유 사기")).toBeTruthy()
  expect(screen.getAllByRole("listitem")).toHaveLength(3)
})
