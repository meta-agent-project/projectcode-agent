# todo-toggle 코드 요약

## T1 체크 칸으로 끝난 일 바꾸기
커밋: a7ad443

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -17,6 +17,14 @@ export default function App() {
     setText("")
   }
 
+  function handleToggle(id) {
+    setTodos(
+      todos.map((todo) =>
+        todo.id === id ? { ...todo, done: !todo.done } : todo,
+      ),
+    )
+  }
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
@@ -31,7 +39,16 @@ export default function App() {
       </form>
       <ul className="stack todo-list">
         {todos.map((todo) => (
-          <li key={todo.id}>{todo.text}</li>
+          <li key={todo.id}>
+            <label className="row">
+              <input
+                type="checkbox"
+                checked={todo.done}
+                onChange={() => handleToggle(todo.id)}
+              />
+              <span>{todo.text}</span>
+            </label>
+          </li>
         ))}
       </ul>
     </main>
```

## T2 끝난 일은 줄 그어 보이기
커밋: b8cd497

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |
| src/index.css | 고침 |

```diff
// src/App.jsx
@@ -46,7 +46,7 @@ export default function App() {
                 checked={todo.done}
                 onChange={() => handleToggle(todo.id)}
               />
-              <span>{todo.text}</span>
+              <span className={todo.done ? "done" : ""}>{todo.text}</span>
             </label>
           </li>
         ))}
```

```diff
// src/index.css
@@ -143,3 +143,8 @@ body {
 .todo-form .input {
   flex: 1;
 }
+
+.done {
+  color: var(--color-secondary);
+  text-decoration: line-through;
+}
```
