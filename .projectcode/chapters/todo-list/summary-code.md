# todo-list 코드 요약

## T1 할 일 배열을 map으로 그리기
커밋: bf6f0e1

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -1,8 +1,18 @@
+const todos = [
+  { id: 1, text: "우유 사기", done: false },
+  { id: 2, text: "React 공부하기", done: false },
+  { id: 3, text: "운동하기", done: false },
+]
+
 export default function App() {
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
-      <p className="muted">아직 할 일이 없어요</p>
+      <ul>
+        {todos.map((todo) => (
+          <li key={todo.id}>{todo.text}</li>
+        ))}
+      </ul>
     </main>
   )
 }
```

## T2 목록 모양 다듬기
커밋: 4b0857f

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/index.css | 고침 |

```diff
// src/App.jsx
@@ -8,7 +8,7 @@ export default function App() {
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
-      <ul>
+      <ul className="stack todo-list">
         {todos.map((todo) => (
           <li key={todo.id}>{todo.text}</li>
         ))}
```

```diff
// src/index.css
@@ -133,3 +133,9 @@ body {
   max-width: var(--width-form);
   margin: var(--space-l) auto;
 }
+
+.todo-list {
+  list-style: none;
+  margin: 0;
+  padding: 0;
+}
```
