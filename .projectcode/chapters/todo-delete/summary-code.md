# todo-delete 코드 요약

## T1 삭제를 누르면 filter로 지우기
커밋: 5cfbdc9

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -25,6 +25,10 @@ export default function App() {
     )
   }
 
+  function handleDelete(id) {
+    setTodos(todos.filter((todo) => todo.id !== id))
+  }
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
@@ -48,6 +52,7 @@ export default function App() {
               />
               <span className={todo.done ? "done" : ""}>{todo.text}</span>
             </label>
+            <button onClick={() => handleDelete(todo.id)}>삭제</button>
           </li>
         ))}
       </ul>
```

## T2 삭제 버튼을 줄 끝으로 보내기
커밋: 07bc9c2

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/index.css | 고침 |

```diff
// src/App.jsx
@@ -43,7 +43,7 @@ export default function App() {
       </form>
       <ul className="stack todo-list">
         {todos.map((todo) => (
-          <li key={todo.id}>
+          <li key={todo.id} className="row">
             <label className="row">
               <input
                 type="checkbox"
@@ -52,7 +52,12 @@ export default function App() {
               />
               <span className={todo.done ? "done" : ""}>{todo.text}</span>
             </label>
-            <button onClick={() => handleDelete(todo.id)}>삭제</button>
+            <button
+              className="button button-text"
+              onClick={() => handleDelete(todo.id)}
+            >
+              삭제
+            </button>
           </li>
         ))}
       </ul>
```

```diff
// src/index.css
@@ -148,3 +148,7 @@ body {
   color: var(--color-secondary);
   text-decoration: line-through;
 }
+
+.todo-list label {
+  flex: 1;
+}
```
