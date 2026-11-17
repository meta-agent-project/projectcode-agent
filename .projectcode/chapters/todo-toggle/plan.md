# todo-toggle 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/App.jsx | 고침 | 체크 칸과 완료 바꾸기 |
| todo-app/src/index.css | 고침 | 끝난 일 모양 한 덩어리 |
| tests/todo-toggle/toggle.test.jsx | 새로 | 체크와 모양 확인 |

## 코드 계획
App.jsx
- li 안에 label을 두고, 그 안에 체크 칸과 글자 span을 둔다
- 체크 칸의 checked는 todo.done이다
- handleToggle(id)는 todos.map으로 그 id만 done을 뒤집은 새 객체로 바꾼 새 배열을 setTodos한다
- span의 className은 todo.done이면 done, 아니면 빈 글자다
- label에는 row 클래스를 쓴다

index.css
- .done 한 덩어리로 줄을 긋고 보조 색으로 쓴다

## 핵심 코드
function handleToggle(id) {
  setTodos(todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
}

<input type="checkbox" checked={todo.done} onChange={() => handleToggle(todo.id)} />
<span className={todo.done ? "done" : ""}>{todo.text}</span>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx |
| S2 | App.jsx, index.css |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx, todo-app/src/index.css: project-setup, todo-list, todo-add
