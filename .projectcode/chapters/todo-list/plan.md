# todo-list 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/App.jsx | 고침 | 할 일 배열을 목록으로 그린다 |
| todo-app/src/index.css | 고침 | 목록 모양 한 덩어리 |
| tests/todo-list/list.test.jsx | 새로 | 목록 확인 |
| tests/project-setup/app.test.jsx | 고침 | 사라진 안내 문장 확인을 뺀다 |

## 코드 계획
App.jsx
- 함수 밖에 할 일 배열 todos를 둔다. 항목은 id, text, done이다
- 안내 문장 p를 지우고 ul을 둔다
- todos.map으로 li를 그리고 key에 id를 준다
- ul에는 stack과 todo-list 클래스를 붙인다

index.css
- .todo-list 한 덩어리로 글머리 기호와 안쪽 여백을 없앤다

## 핵심 코드
const todos = [
  { id: 1, text: "우유 사기", done: false },
  { id: 2, text: "React 공부하기", done: false },
  { id: 3, text: "운동하기", done: false },
]

<ul className="stack todo-list">
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx |
| S2 | index.css, App.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx, todo-app/src/index.css: project-setup
- tests/project-setup/app.test.jsx: project-setup
