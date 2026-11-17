import { useState } from "react"

const initialTodos = [
  { id: 1, text: "우유 사기", done: false },
  { id: 2, text: "React 공부하기", done: false },
  { id: 3, text: "운동하기", done: false },
]

export default function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [text, setText] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    setTodos([...todos, { id: Date.now(), text: text, done: false }])
    setText("")
  }

  return (
    <main className="card stack todo">
      <h1 className="title">할 일</h1>
      <form className="row todo-form" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="할 일을 적어 주세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="button button-primary">추가</button>
      </form>
      <ul className="stack todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  )
}
