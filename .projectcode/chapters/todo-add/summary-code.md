# todo-add 코드 요약

## T1 입력값을 state로 기억하기
커밋: effbf93

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -1,3 +1,5 @@
+import { useState } from "react"
+
 const todos = [
   { id: 1, text: "우유 사기", done: false },
   { id: 2, text: "React 공부하기", done: false },
@@ -5,9 +7,17 @@ const todos = [
 ]
 
 export default function App() {
+  const [text, setText] = useState("")
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
+      <input
+        className="input"
+        placeholder="할 일을 적어 주세요"
+        value={text}
+        onChange={(e) => setText(e.target.value)}
+      />
       <ul className="stack todo-list">
         {todos.map((todo) => (
           <li key={todo.id}>{todo.text}</li>
```

## T2 추가를 누르면 목록에 더하기
커밋: 43583e4

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/index.css | 고침 |

```diff
// src/App.jsx
@@ -1,23 +1,33 @@
 import { useState } from "react"
 
-const todos = [
+const initialTodos = [
   { id: 1, text: "우유 사기", done: false },
   { id: 2, text: "React 공부하기", done: false },
   { id: 3, text: "운동하기", done: false },
 ]
 
 export default function App() {
+  const [todos, setTodos] = useState(initialTodos)
   const [text, setText] = useState("")
 
+  function handleSubmit(e) {
+    e.preventDefault()
+    setTodos([...todos, { id: Date.now(), text: text, done: false }])
+    setText("")
+  }
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
-      <input
-        className="input"
-        placeholder="할 일을 적어 주세요"
-        value={text}
-        onChange={(e) => setText(e.target.value)}
-      />
+      <form className="row todo-form" onSubmit={handleSubmit}>
+        <input
+          className="input"
+          placeholder="할 일을 적어 주세요"
+          value={text}
+          onChange={(e) => setText(e.target.value)}
+        />
+        <button className="button button-primary">추가</button>
+      </form>
       <ul className="stack todo-list">
         {todos.map((todo) => (
           <li key={todo.id}>{todo.text}</li>
```

```diff
// src/index.css
@@ -139,3 +139,7 @@ body {
   margin: 0;
   padding: 0;
 }
+
+.todo-form .input {
+  flex: 1;
+}
```

## T3 빈 칸은 추가하지 않기
커밋: 8d0a1a1

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -12,6 +12,7 @@ export default function App() {
 
   function handleSubmit(e) {
     e.preventDefault()
+    if (text.trim() === "") return
     setTodos([...todos, { id: Date.now(), text: text, done: false }])
     setText("")
   }
```
