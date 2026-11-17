const todos = [
  { id: 1, text: "우유 사기", done: false },
  { id: 2, text: "React 공부하기", done: false },
  { id: 3, text: "운동하기", done: false },
]

export default function App() {
  return (
    <main className="card stack todo">
      <h1 className="title">할 일</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  )
}
