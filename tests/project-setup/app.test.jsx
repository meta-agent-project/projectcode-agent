import { test, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import App from "../../todo-app/src/App.jsx"

test("S1 개발 서버를 띄우고 브라우저로 열면 할 일 제목이 있는 첫 화면이 뜬다", () => {
  render(<App />)
  expect(screen.getByRole("heading", { name: "할 일" })).toBeTruthy()
  expect(screen.getByText("아직 할 일이 없어요")).toBeTruthy()
})
