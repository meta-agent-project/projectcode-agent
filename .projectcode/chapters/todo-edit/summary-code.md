# todo-edit 코드 요약

## T1 수정을 누르면 고치는 칸으로 바꿔 그리기
커밋: 623decc

| 파일 | 변경 |
|---|---|
| src/TodoItem.jsx | 고침 |

```diff
// src/TodoItem.jsx
@@ -1,4 +1,29 @@
+import { useState } from "react"
+
 export default function TodoItem({ todo, onToggle, onDelete }) {
+  const [editing, setEditing] = useState(false)
+  const [draft, setDraft] = useState(todo.text)
+
+  function handleCancel() {
+    setDraft(todo.text)
+    setEditing(false)
+  }
+
+  if (editing) {
+    return (
+      <li className="row todo-form">
+        <input
+          className="input"
+          value={draft}
+          onChange={(e) => setDraft(e.target.value)}
+        />
+        <button className="button" onClick={handleCancel}>
+          취소
+        </button>
+      </li>
+    )
+  }
+
   return (
     <li className="row">
       <label className="row">
@@ -9,6 +34,9 @@ export default function TodoItem({ todo, onToggle, onDelete }) {
         />
         <span className={todo.done ? "done" : ""}>{todo.text}</span>
       </label>
+      <button className="button button-text" onClick={() => setEditing(true)}>
+        수정
+      </button>
       <button className="button button-text" onClick={() => onDelete(todo.id)}>
         삭제
       </button>
```

## T2 저장하면 부모의 할 일 글 바꾸기
커밋: d4206bf

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/TodoItem.jsx | 고침 |

```diff
// src/App.jsx
@@ -30,6 +30,12 @@ export default function App() {
     setTodos(todos.filter((todo) => todo.id !== id))
   }
 
+  function handleEdit(id, text) {
+    setTodos(
+      todos.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)),
+    )
+  }
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
@@ -49,6 +55,7 @@ export default function App() {
             todo={todo}
             onToggle={handleToggle}
             onDelete={handleDelete}
+            onEdit={handleEdit}
           />
         ))}
       </ul>
```

```diff
// src/TodoItem.jsx
@@ -1,9 +1,15 @@
 import { useState } from "react"
 
-export default function TodoItem({ todo, onToggle, onDelete }) {
+export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
   const [editing, setEditing] = useState(false)
   const [draft, setDraft] = useState(todo.text)
 
+  function handleSave(e) {
+    e.preventDefault()
+    onEdit(todo.id, draft)
+    setEditing(false)
+  }
+
   function handleCancel() {
     setDraft(todo.text)
     setEditing(false)
@@ -11,15 +17,18 @@ export default function TodoItem({ todo, onToggle, onDelete }) {
 
   if (editing) {
     return (
-      <li className="row todo-form">
-        <input
-          className="input"
-          value={draft}
-          onChange={(e) => setDraft(e.target.value)}
-        />
-        <button className="button" onClick={handleCancel}>
-          취소
-        </button>
+      <li>
+        <form className="row todo-form" onSubmit={handleSave}>
+          <input
+            className="input"
+            value={draft}
+            onChange={(e) => setDraft(e.target.value)}
+          />
+          <button className="button button-primary">저장</button>
+          <button type="button" className="button" onClick={handleCancel}>
+            취소
+          </button>
+        </form>
       </li>
     )
   }
```

## T3 빈 칸은 저장하지 않기
커밋: 2b07e72

| 파일 | 변경 |
|---|---|
| src/TodoItem.jsx | 고침 |

```diff
// src/TodoItem.jsx
@@ -6,6 +6,7 @@ export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
 
   function handleSave(e) {
     e.preventDefault()
+    if (draft.trim() === "") return
     onEdit(todo.id, draft)
     setEditing(false)
   }
```

## T4 고치는 칸 줄이 카드 안에 들어가게 하기
커밋: 3a176dc

| 파일 | 변경 |
|---|---|
| src/index.css | 고침 |

```diff
// src/index.css
@@ -142,6 +142,7 @@ body {
 
 .todo-form .input {
   flex: 1;
+  min-width: 0;
 }
 
 .done {
```
