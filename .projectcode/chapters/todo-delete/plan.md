# todo-delete 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/App.jsx | 고침 | 삭제 버튼과 지우기 |
| todo-app/src/index.css | 고침 | 글자 칸이 남은 너비를 채운다 |
| tests/todo-delete/delete.test.jsx | 새로 | 삭제 확인 |

## 코드 계획
App.jsx
- handleDelete(id)는 todos.filter로 그 id가 아닌 것만 남긴 새 배열을 setTodos한다
- li 안 label 뒤에 삭제 버튼을 두고 onClick에서 handleDelete(todo.id)를 부른다
- li에 row 클래스, 버튼에 button과 button-text 클래스를 쓴다

index.css
- .todo-list label 한 덩어리로 글자 칸이 남은 너비를 채워 버튼을 오른쪽 끝으로 민다

## 핵심 코드
function handleDelete(id) {
  setTodos(todos.filter((todo) => todo.id !== id))
}

<button onClick={() => handleDelete(todo.id)}>삭제</button>

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx |
| S2 | App.jsx, index.css |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx, todo-app/src/index.css: project-setup, todo-list, todo-add, todo-toggle
