# todo-filter 코드 요약

## T1 고른 조건으로 목록 거르기
커밋: 1653b90

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -10,6 +10,7 @@ const initialTodos = [
 export default function App() {
   const [todos, setTodos] = useState(initialTodos)
   const [text, setText] = useState("")
+  const [filter, setFilter] = useState("all")
 
   function handleSubmit(e) {
     e.preventDefault()
@@ -36,6 +37,12 @@ export default function App() {
     )
   }
 
+  const visibleTodos = todos.filter((todo) => {
+    if (filter === "active") return !todo.done
+    if (filter === "done") return todo.done
+    return true
+  })
+
   return (
     <main className="card stack todo">
       <h1 className="title">할 일</h1>
@@ -48,8 +55,19 @@ export default function App() {
         />
         <button className="button button-primary">추가</button>
       </form>
+      <div className="row">
+        <button className="button" onClick={() => setFilter("all")}>
+          전체
+        </button>
+        <button className="button" onClick={() => setFilter("active")}>
+          남은 일
+        </button>
+        <button className="button" onClick={() => setFilter("done")}>
+          끝난 일
+        </button>
+      </div>
       <ul className="stack todo-list">
-        {todos.map((todo) => (
+        {visibleTodos.map((todo) => (
           <TodoItem
             key={todo.id}
             todo={todo}
```

## T2 고른 버튼 진하게 보이기
커밋: d2a66d2

| 파일 | 변경 |
|---|---|
| src/App.jsx | 고침 |

```diff
// src/App.jsx
@@ -56,13 +56,22 @@ export default function App() {
         <button className="button button-primary">추가</button>
       </form>
       <div className="row">
-        <button className="button" onClick={() => setFilter("all")}>
+        <button
+          className={filter === "all" ? "button button-primary" : "button"}
+          onClick={() => setFilter("all")}
+        >
           전체
         </button>
-        <button className="button" onClick={() => setFilter("active")}>
+        <button
+          className={filter === "active" ? "button button-primary" : "button"}
+          onClick={() => setFilter("active")}
+        >
           남은 일
         </button>
-        <button className="button" onClick={() => setFilter("done")}>
+        <button
+          className={filter === "done" ? "button button-primary" : "button"}
+          onClick={() => setFilter("done")}
+        >
           끝난 일
         </button>
       </div>
```
