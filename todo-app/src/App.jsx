import { useState } from "react"

const todos = [
  { id: 1, text: "우유 사기", done: false },
  { id: 2, text: "React 공부하기", done: false },
  { id: 3, text: "운동하기", done: false },
]

export default function App() {
  const [text, setText] = useState("")

  return (
    <main className="card stack todo">
      <h1 className="title">할 일</h1>
      <input
        className="input"
        placeholder="할 일을 적어 주세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ul className="stack todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  )
}
