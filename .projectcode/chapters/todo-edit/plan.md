# todo-edit 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/TodoItem.jsx | 고침 | 고치기 state, 고치는 칸과 원래 줄 바꿔 그리기 |
| todo-app/src/App.jsx | 고침 | 글 바꾸기 함수를 props로 넘긴다 |
| tests/todo-edit/edit.test.jsx | 새로 | 수정, 저장, 취소, 빈 칸 확인 |

## 코드 계획
TodoItem.jsx
- useState를 불러온다
- editing state로 고치는 중인지, draft state로 고치는 글을 기억한다. draft의 처음 값은 todo.text다
- 원래 줄의 삭제 앞에 수정 버튼을 두고 누르면 editing을 켠다
- editing이면 if로 먼저 고치는 칸 줄을 return한다
- 취소는 draft를 todo.text로 되돌리고 editing을 끈다
- 저장은 form onSubmit에서 새로고침을 막고, 빈 글이 아니면 onEdit(todo.id, draft)를 부르고 editing을 끈다
- 고치는 칸 줄은 todo-form 클래스로 칸이 남은 너비를 채운다. 저장은 button-primary, 취소는 button, 수정은 button-text다

App.jsx
- handleEdit(id, text)는 todos.map으로 그 id만 text를 바꾼 새 배열을 setTodos한다
- TodoItem에 onEdit으로 넘긴다

## 핵심 코드
const [editing, setEditing] = useState(false)
const [draft, setDraft] = useState(todo.text)

if (editing) {
  return (
    <li>
      <form className="row todo-form" onSubmit={handleSave}>
        <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button className="button button-primary">저장</button>
        <button type="button" className="button" onClick={handleCancel}>취소</button>
      </form>
    </li>
  )
}

function handleEdit(id, text) {
  setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: text } : todo)))
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | TodoItem.jsx |
| S2 | TodoItem.jsx, App.jsx |
| S3 | TodoItem.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx: project-setup, todo-list, todo-add, todo-toggle, todo-delete, todo-components
- todo-app/src/TodoItem.jsx: todo-components
