import { test, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

afterEach(cleanup)

test("S1 할 일마다 체크 칸이 있고, 누르면 그 할 일만 끝난 일로 체크되고 다시 누르면 풀린다", () => {
  render(<App />)
  expect(screen.getAllByRole("checkbox")).toHaveLength(3)
  const milk = screen.getByLabelText("우유 사기")
  fireEvent.click(milk)
  expect(milk.checked).toBe(true)
  expect(screen.getByLabelText("운동하기").checked).toBe(false)
  fireEvent.click(milk)
  expect(milk.checked).toBe(false)
})

test("S2 끝난 할 일은 줄이 그어진 흐린 글자로 보인다", () => {
  render(<App />)
  fireEvent.click(screen.getByLabelText("우유 사기"))
  expect(screen.getByText("우유 사기").className).toContain("done")
  expect(screen.getByText("운동하기").className).not.toContain("done")
})
