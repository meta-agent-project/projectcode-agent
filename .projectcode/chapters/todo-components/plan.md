# todo-components 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/TodoItem.jsx | 새로 | 할 일 한 줄 |
| todo-app/src/App.jsx | 고침 | 한 줄을 TodoItem으로 바꾼다 |

## 코드 계획
TodoItem.jsx
- props로 todo, onToggle, onDelete를 받는다
- App에 있던 li 한 줄을 그대로 옮긴다
- 체크 칸은 onToggle(todo.id), 삭제는 onDelete(todo.id)를 부른다
- 나누는 이유: 다음 장에서 한 줄마다 자기 state를 갖게 된다

App.jsx
- TodoItem을 불러온다
- map 안의 li를 TodoItem으로 바꾸고 key, todo, onToggle, onDelete를 넘긴다
- todos state와 handleToggle, handleDelete는 그대로 둔다

## 핵심 코드
export default function TodoItem({ todo, onToggle, onDelete }) {

<TodoItem
  key={todo.id}
  todo={todo}
  onToggle={handleToggle}
  onDelete={handleDelete}
/>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | TodoItem.jsx, App.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx: project-setup, todo-list, todo-add, todo-toggle, todo-delete
