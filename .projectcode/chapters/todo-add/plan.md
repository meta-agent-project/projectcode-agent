# todo-add 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| todo-app/src/App.jsx | 고침 | 입력 칸, 추가 폼, 할 일 state |
| todo-app/src/index.css | 고침 | 입력 칸이 남은 너비를 채운다 |
| tests/todo-add/add.test.jsx | 새로 | 입력, 추가, 빈 칸 확인 |

## 코드 계획
App.jsx
- useState를 불러온다
- 입력 글을 text state로 기억한다. input의 value와 onChange를 연결한다
- 함수 밖 배열 이름을 initialTodos로 바꾸고 todos state의 처음 값으로 쓴다
- form의 onSubmit에서 새로고침을 막는다
- 빈칸을 지운 글이 비었으면 아무것도 하지 않는다
- 아니면 새 배열에 새 할 일을 더해 setTodos하고 text를 비운다
- id는 Date.now()로 만든다
- form에는 row와 todo-form 클래스, input에는 input, 버튼에는 button과 button-primary를 쓴다

index.css
- .todo-form .input 한 덩어리로 칸이 남은 너비를 채운다

## 핵심 코드
const [text, setText] = useState("")

<input className="input" placeholder="할 일을 적어 주세요" value={text} onChange={(e) => setText(e.target.value)} />

const [todos, setTodos] = useState(initialTodos)

function handleSubmit(e) {
  e.preventDefault()
  if (text.trim() === "") return
  setTodos([...todos, { id: Date.now(), text: text, done: false }])
  setText("")
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | App.jsx |
| S2 | App.jsx, index.css |
| S3 | App.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- todo-app/src/App.jsx, todo-app/src/index.css: project-setup, todo-list
