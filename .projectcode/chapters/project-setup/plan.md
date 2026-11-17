# project-setup 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/package.json | 새로 | 라이브러리와 dev, build, test, format 명령 |
| todo-app/index.html | 새로 | 앱이 붙을 root 자리 |
| todo-app/vite.config.js | 새로 | React 플러그인, 테스트 폴더와 jsdom 설정 |
| todo-app/.prettierrc | 새로 | 포맷 규칙 |
| todo-app/src/main.jsx | 새로 | App을 root에 그린다, CSS를 불러온다 |
| todo-app/src/App.jsx | 새로 | 첫 화면 |
| todo-app/src/index.css | 새로 | base.css 복사와 카드 배치 한 줄 |
| tests/project-setup/app.test.jsx | 새로 | 첫 화면 제목 확인 |

## 코드 계획
package.json
- 의존: react, react-dom
- 개발 의존: vite, @vitejs/plugin-react, vitest, @testing-library/react, jsdom, prettier
- 명령: dev는 vite, build는 vite build, test는 vitest run, format은 prettier --write src

index.html
- div id root 하나와 src/main.jsx 모듈 스크립트

vite.config.js
- React 플러그인을 쓴다
- 테스트는 바깥 tests 폴더의 파일을 찾고 jsdom 환경에서 돌린다
- 바깥 폴더 테스트가 todo-app의 라이브러리를 찾도록 맞춘다

.prettierrc
- 세미콜론 없음, 나머지는 기본값

main.jsx
- index.css를 불러온다
- createRoot로 root에 App을 그린다

App.jsx
- main 하나에 card, stack, todo 클래스를 붙인다
- 안에 title 클래스 제목 할 일, muted 클래스 문장 아직 할 일이 없어요

index.css
- .claude/skills/projectcode-mockup/base.css를 그대로 복사한다
- 맨 아래에 .todo 폼 너비와 가운데 정렬 한 줄을 더한다

app.test.jsx
- App을 그리고 제목 할 일이 보이는지 확인한다

## 핵심 코드
createRoot(document.getElementById("root")).render(<App />)

<main className="card stack todo">
  <h1 className="title">할 일</h1>
  <p className="muted">아직 할 일이 없어요</p>
</main>

.todo { max-width: var(--width-form); margin: var(--space-l) auto; }

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | package.json, index.html, vite.config.js, main.jsx, App.jsx |
| S2 | index.css, App.jsx |
| S3 | vite.config.js, package.json, app.test.jsx |
| S4 | .prettierrc, package.json |

## 라이브러리
- jsdom 추가: 테스트에서 화면을 그리는 가짜 브라우저
- prettier 추가: 포맷만 맞춘다

## 다른 장 파일
- 없음
