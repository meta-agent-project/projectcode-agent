# todo-filter 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/App.jsx | 고침 | 조건 state, 조건 버튼, 보여줄 할 일 계산 |
| tests/todo-filter/filter.test.jsx | 새로 | 거르기와 고른 버튼 확인 |

## 코드 계획
App.jsx
- filter state를 둔다. 값은 all, active, done 중 하나이고 처음은 all이다
- visibleTodos는 state로 두지 않고 그릴 때마다 todos.filter로 계산한다
- 폼과 목록 사이에 row 클래스 div를 두고 전체, 남은 일, 끝난 일 버튼을 둔다. 누르면 setFilter한다
- 목록은 todos 대신 visibleTodos를 map한다
- 버튼 className은 고른 것이면 button button-primary, 아니면 button이다

## 핵심 코드
const [filter, setFilter] = useState("all")

const visibleTodos = todos.filter((todo) => {
  if (filter === "active") return !todo.done
  if (filter === "done") return todo.done
  return true
})

<button className={filter === "all" ? "button button-primary" : "button"} onClick={() => setFilter("all")}>
  전체
</button>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx |
| S2 | App.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx: project-setup, todo-list, todo-add, todo-toggle, todo-delete, todo-components, todo-edit
