# project-setup 코드 요약

## T1 Vite로 첫 화면 띄우기
커밋: a48bdcd

| 파일 | 변경 |
|---|---|
| package.json | 새로 |
| package-lock.json | 새로 |
| index.html | 새로 |
| vite.config.js | 새로 |
| src/main.jsx | 새로 |
| src/App.jsx | 새로 |

package-lock.json은 npm이 만든 파일이라 코드를 싣지 않는다.

```json
// package.json
{
  "name": "todo-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.3.0",
    "vite": "^8.3.8"
  }
}
```

```html
// index.html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>할 일</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```js
// vite.config.js
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
})
```

```jsx
// src/main.jsx
import { createRoot } from "react-dom/client"
import App from "./App.jsx"

createRoot(document.getElementById("root")).render(<App />)
```

```jsx
// src/App.jsx
export default function App() {
  return (
    <main>
      <h1>할 일</h1>
      <p>아직 할 일이 없어요</p>
    </main>
  )
}
```

## T2 공통 CSS로 카드 모양 만들기
커밋: bf2fe0f

| 파일 | 변경 |
|---|---|
| src/index.css | 새로 |
| src/main.jsx | 고침 |
| src/App.jsx | 고침 |

```css
// src/index.css
:root {
  --color-primary: #111111;
  --color-secondary: #888888;
  --color-line: #e5e5e5;
  --color-bg: #ffffff;

  --font-body: "Pretendard", "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
  --font-mono: "JetBrains Mono", "Consolas", monospace;

  --text-small: 13px;
  --text-body: 15px;
  --text-title: 22px;

  --space-s: 8px;
  --space-m: 16px;
  --space-l: 32px;

  --height-control: 40px;
  --radius-control: 999px;
  --radius-card: 14px;

  --width-page: 960px;
  --width-form: 420px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: var(--text-body);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-m) var(--space-l);
  border-bottom: 1px solid var(--color-line);
}

.header nav { display: flex; gap: var(--space-m); color: var(--color-secondary); font-size: var(--text-small); }

.page { max-width: var(--width-page); margin: 0 auto; padding: var(--space-l); }

.title { font-size: var(--text-title); font-weight: 700; margin: 0; }

.stack { display: flex; flex-direction: column; gap: var(--space-m); }
.row { display: flex; align-items: center; gap: var(--space-m); }

.card {
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-card);
  padding: var(--space-l);
}

.field { display: flex; flex-direction: column; gap: var(--space-s); }
.label { font-size: var(--text-small); color: var(--color-secondary); }

.input {
  height: var(--height-control);
  padding: 0 var(--space-m);
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-control);
  font: inherit;
  background: var(--color-bg);
}

.button {
  height: var(--height-control);
  padding: 0 var(--space-m);
  border: 1.5px solid var(--color-primary);
  border-radius: var(--radius-control);
  background: var(--color-bg);
  color: var(--color-primary);
  font: inherit;
  cursor: pointer;
}

.button-primary { background: var(--color-primary); color: var(--color-bg); }
.button-text { border-color: transparent; color: var(--color-secondary); padding: 0 var(--space-s); }

.muted { color: var(--color-secondary); font-size: var(--text-small); }
.mono { font-family: var(--font-mono); font-size: var(--text-small); color: var(--color-secondary); }

.todo { max-width: var(--width-form); margin: var(--space-l) auto; }
```

```diff
diff --git a/todo-app/src/App.jsx b/todo-app/src/App.jsx
index ef5359c..9103364 100644
--- a/todo-app/src/App.jsx
+++ b/todo-app/src/App.jsx
@@ -1,8 +1,8 @@
 export default function App() {
   return (
-    <main>
-      <h1>할 일</h1>
-      <p>아직 할 일이 없어요</p>
+    <main className="card stack todo">
+      <h1 className="title">할 일</h1>
+      <p className="muted">아직 할 일이 없어요</p>
     </main>
   )
 }
diff --git a/todo-app/src/main.jsx b/todo-app/src/main.jsx
index f13a2f2..b941ac5 100644
--- a/todo-app/src/main.jsx
+++ b/todo-app/src/main.jsx
@@ -1,4 +1,5 @@
 import { createRoot } from "react-dom/client"
+import "./index.css"
 import App from "./App.jsx"
 
 createRoot(document.getElementById("root")).render(<App />)
```

## T3 테스트 실행기 붙이기
커밋: 8c35d70

| 파일 | 변경 |
|---|---|
| package.json | 고침 |
| package-lock.json | 고침 |
| vite.config.js | 고침 |

```diff
diff --git a/todo-app/package.json b/todo-app/package.json
index 20f808d..61dc6f9 100644
--- a/todo-app/package.json
+++ b/todo-app/package.json
@@ -5,14 +5,18 @@
   "type": "module",
   "scripts": {
     "dev": "vite",
-    "build": "vite build"
+    "build": "vite build",
+    "test": "vitest run"
   },
   "dependencies": {
     "react": "^19.3.1",
     "react-dom": "^19.3.1"
   },
   "devDependencies": {
+    "@testing-library/react": "^16.3.3",
     "@vitejs/plugin-react": "^6.3.0",
-    "vite": "^8.3.8"
+    "jsdom": "^29.1.1",
+    "vite": "^8.3.8",
+    "vitest": "^5.1.0"
   }
 }
diff --git a/todo-app/vite.config.js b/todo-app/vite.config.js
index ea1889a..ab23e9c 100644
--- a/todo-app/vite.config.js
+++ b/todo-app/vite.config.js
@@ -3,4 +3,14 @@ import react from "@vitejs/plugin-react"
 
 export default defineConfig({
   plugins: [react()],
+  server: {
+    fs: { allow: [".."] },
+  },
+  resolve: {
+    dedupe: ["react", "react-dom", "@testing-library/react"],
+  },
+  test: {
+    dir: "../tests",
+    environment: "jsdom",
+  },
 })
```

## T4 포맷 도구 붙이기
커밋: e7fbb80

| 파일 | 변경 |
|---|---|
| .prettierrc | 새로 |
| package.json | 고침 |
| package-lock.json | 고침 |
| src/index.css | 고침. 포맷만 바뀜 |

```json
// .prettierrc
{
  "semi": false
}
```

```diff
diff --git a/todo-app/package.json b/todo-app/package.json
index 61dc6f9..1481056 100644
--- a/todo-app/package.json
+++ b/todo-app/package.json
@@ -6,7 +6,8 @@
   "scripts": {
     "dev": "vite",
     "build": "vite build",
-    "test": "vitest run"
+    "test": "vitest run",
+    "format": "prettier --write src"
   },
   "dependencies": {
     "react": "^19.3.1",
@@ -16,6 +17,7 @@
     "@testing-library/react": "^16.3.3",
     "@vitejs/plugin-react": "^6.3.0",
     "jsdom": "^29.1.1",
+    "prettier": "^3.10.1",
     "vite": "^8.3.8",
     "vitest": "^5.1.0"
   }
```

src/index.css는 한 줄로 쓴 규칙이 여러 줄로 펼쳐졌다. 값은 그대로다.
