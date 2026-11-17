import { useState } from "react"
import TodoItem from "./TodoItem.jsx"

const initialTodos = [
  { id: 1, text: "우유 사기", done: false },
  { id: 2, text: "React 공부하기", done: false },
  { id: 3, text: "운동하기", done: false },
]

export default function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [text, setText] = useState("")
  const [filter, setFilter] = useState("all")

  function handleSubmit(e) {
    e.preventDefault()
    if (text.trim() === "") return
    setTodos([...todos, { id: Date.now(), text: text, done: false }])
    setText("")
  }

  function handleToggle(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    )
  }

  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  function handleEdit(id, text) {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)),
    )
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.done
    if (filter === "done") return todo.done
    return true
  })

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
      <div className="row">
        <button
          className={filter === "all" ? "button button-primary" : "button"}
          onClick={() => setFilter("all")}
        >
          전체
        </button>
        <button
          className={filter === "active" ? "button button-primary" : "button"}
          onClick={() => setFilter("active")}
        >
          남은 일
        </button>
        <button
          className={filter === "done" ? "button button-primary" : "button"}
          onClick={() => setFilter("done")}
        >
          끝난 일
        </button>
      </div>
      <ul className="stack todo-list">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </main>
  )
}
