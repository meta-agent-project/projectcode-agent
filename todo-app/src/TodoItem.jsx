import { useState } from "react"

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)

  function handleSave(e) {
    e.preventDefault()
    if (draft.trim() === "") return
    onEdit(todo.id, draft)
    setEditing(false)
  }

  function handleCancel() {
    setDraft(todo.text)
    setEditing(false)
  }

  if (editing) {
    return (
      <li>
        <form className="row todo-form" onSubmit={handleSave}>
          <input
            className="input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="button button-primary">저장</button>
          <button type="button" className="button" onClick={handleCancel}>
            취소
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className="row">
      <label className="row">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
        />
        <span className={todo.done ? "done" : ""}>{todo.text}</span>
      </label>
      <button className="button button-text" onClick={() => setEditing(true)}>
        수정
      </button>
      <button className="button button-text" onClick={() => onDelete(todo.id)}>
        삭제
      </button>
    </li>
  )
}
