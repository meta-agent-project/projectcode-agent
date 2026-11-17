# todo-components 코드 요약

## T1 할 일 한 줄을 TodoItem으로 빼고 props로 넘기기
커밋: 08b3a81

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/TodoItem.jsx | 새로 |

```diff
// src/App.jsx
@@ -1,4 +1,5 @@
 import { useState } from "react"
+import TodoItem from "./TodoItem.jsx"
 
 const initialTodos = [
   { id: 1, text: "우유 사기", done: false },
@@ -43,22 +44,12 @@ export default function App() {
       </form>
       <ul className="stack todo-list">
         {todos.map((todo) => (
-          <li key={todo.id} className="row">
-            <label className="row">
-              <input
-                type="checkbox"
-                checked={todo.done}
-                onChange={() => handleToggle(todo.id)}
-              />
-              <span className={todo.done ? "done" : ""}>{todo.text}</span>
-            </label>
-            <button
-              className="button button-text"
-              onClick={() => handleDelete(todo.id)}
-            >
-              삭제
-            </button>
-          </li>
+          <TodoItem
+            key={todo.id}
+            todo={todo}
+            onToggle={handleToggle}
+            onDelete={handleDelete}
+          />
         ))}
       </ul>
     </main>
```

```jsx
// src/TodoItem.jsx
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
```
