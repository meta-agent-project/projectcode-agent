export default function TodoItem({ todo, onToggle, onDelete }) {
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
      <button className="button button-text" onClick={() => onDelete(todo.id)}>
        삭제
      </button>
    </li>
  )
}
