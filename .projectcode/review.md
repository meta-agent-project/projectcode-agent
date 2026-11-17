# 따라치기 코드 리뷰

## project-setup T1

### package.json

- type: "module"은 이 폴더의 js 파일을 import, export 문법으로 읽게 한다
- scripts의 dev는 npm run dev로 개발 서버를 띄운다
- build는 npm run build로 배포용 파일을 dist 폴더에 만든다
- dependencies의 react는 화면을 그리는 라이브러리다
- react-dom은 React가 그린 것을 브라우저 화면에 붙인다
- devDependencies는 만들 때만 쓰는 도구다. vite와 plugin-react가 여기 있다
- ^19.3.1의 ^는 19 안에서 더 새 버전을 받아도 된다는 뜻이다

### index.html

#### 개념 Vite 프로젝트 구조
##### 무엇
- 브라우저가 처음 여는 파일은 index.html이다
- index.html은 src/main.jsx를 부른다
- main.jsx는 App 컴포넌트를 id가 root인 div 안에 그린다
- 화면 코드는 모두 src 폴더에 둔다
##### 왜
- 브라우저는 JSX를 읽지 못한다
- Vite가 JSX를 브라우저가 읽는 JS로 바꿔서 준다
- 파일을 저장하면 Vite가 화면을 바로 새로 고친다
##### 쉬운 방법과 비교
- script 태그로 React와 Babel을 CDN에서 불러와 html 파일 하나에 다 써도 1장 화면은 뜬다
- 6장에서 TodoItem.jsx를 따로 만들어 import하면 파일끼리 잇는 일을 Vite가 맡는다
- 1장 3단계에서 붙이는 테스트(vitest)도 Vite 설정을 그대로 쓴다
- 한 번 보여주고 버릴 짧은 예제라면 CDN 한 파일이 더 빠르다
##### 헷갈리는 개념
- Vite와 React는 다르다
- React는 화면을 그리는 라이브러리이고 Vite는 개발 서버와 빌드 도구다
- npm run dev 화면은 만드는 동안 보는 것이고 npm run build 결과가 배포할 파일이다
##### 이 예제에서는
- index.html의 div id="root"와 main.jsx의 getElementById("root")가 짝이다

#### 코드
- lang="ko"는 한글 문서라고 알린다
- viewport 메타는 휴대폰에서 화면 폭에 맞춰 보이게 한다
- script type="module"이어야 main.jsx 안의 import가 동작한다
- src="/src/main.jsx"의 맨 앞 /는 todo-app 폴더를 뜻한다

### vite.config.js

- defineConfig는 설정 객체를 그대로 돌려준다. 편집기가 옵션 이름을 알려주게 감싼다
- plugins: [react()]가 있어야 Vite가 JSX를 읽는다

### src/main.jsx

- createRoot는 React가 그릴 자리를 정한다
- render(<App />)는 그 자리에 App을 그린다
- 이 파일은 앞으로 거의 바뀌지 않는다. 화면은 App.jsx부터 고친다

### src/App.jsx

#### 개념 컴포넌트
##### 무엇
- 컴포넌트(component)는 화면 한 조각을 돌려주는 함수다
- 이름은 대문자로 시작한다. 그래야 React가 HTML 태그와 구분한다
##### 왜
- 화면을 조각으로 나눠 이름을 붙이면 고칠 곳을 찾기 쉽다
##### 쉬운 방법과 비교
- index.html에 h1과 p를 직접 써도 1장 화면은 같다
- 3장부터 값이 바뀌면 화면이 다시 그려져야 하는데 html에 직접 쓴 글은 React가 다시 그리지 못한다
- 6장에서 할 일 한 줄을 TodoItem 컴포넌트로 빼고 7장에서 줄마다 수정 칸을 따로 가진다
##### 헷갈리는 개념
- 컴포넌트는 함수지만 App()처럼 직접 부르지 않는다
- <App />처럼 태그로 쓰면 React가 알맞을 때 부른다
##### 이 예제에서는
- App 함수가 main 덩어리 하나를 돌려준다

#### 개념 JSX
##### 무엇
- JSX는 JS 안에 HTML처럼 쓰는 문법이다
- Vite가 이것을 React 함수 호출로 바꾼다
##### 쉬운 방법과 비교
- document.createElement나 innerHTML 문자열로도 화면을 만들 수 있다
- 2장에서 배열을 map으로 그리고 3장부터 배열이 바뀔 때 innerHTML이면 바뀔 때마다 목록을 직접 다시 써야 한다
- JSX는 state가 바뀌면 React가 알아서 다시 그린다
##### 헷갈리는 개념
- HTML과 거의 같지만 다른 곳이 있다
- class 대신 className을 쓴다. class는 JS에서 이미 쓰는 말이다
- 중괄호 안에는 JS 값을 넣는다
- 닫는 태그가 없는 태그도 <input />처럼 스스로 닫아야 한다
- return은 태그 하나로 감싸야 한다
##### 이 예제에서는
- return 뒤 괄호 안의 main부터 끝까지가 JSX다

#### 코드
- export default는 이 파일의 대표로 App을 내보낸다. main.jsx가 이름 없이 받아 쓴다
- return 뒤 괄호는 여러 줄 JSX를 한 덩어리로 묶는다

## project-setup T2

### src/index.css

- 미리 준비한 공통 스타일을 그대로 복사한다
- 맨 위 :root의 변수는 색, 글자 크기, 간격을 한 곳에서 정한다
- 이 단계에서 더한 덩어리는 맨 끝 .todo다. 카드 폭을 좁히고 가운데 둔다

### src/main.jsx

- import "./index.css"는 받는 이름 없이 CSS 파일을 불러온다. Vite가 페이지에 스타일을 붙인다

### src/App.jsx

- className="card stack todo"처럼 class 여러 개는 띄어 쓴다
- card는 테두리, stack은 세로로 쌓기, todo는 폭과 가운데 놓기다
- title과 muted는 제목 글자와 흐린 글자다

## project-setup T3

### package.json

- test 스크립트의 vitest run은 테스트를 한 번 돌리고 끝낸다. run이 없으면 파일을 지켜보며 계속 돈다
- vitest는 Vite 설정을 그대로 쓰는 테스트 실행기다
- @testing-library/react는 테스트 안에서 컴포넌트를 그리고 글자로 찾는다
- jsdom은 브라우저 없이 document를 흉내 낸다

### vite.config.js

- test.dir: "../tests"는 테스트를 todo-app 밖의 tests 폴더에서 찾게 한다
- 테스트를 밖에 두면 학생 코드 폴더에는 따라 칠 코드만 남는다. 테스트는 장마다 폴더로 나뉜다
- environment: "jsdom"은 테스트 안에서 document와 화면 이벤트를 쓰게 한다
- server.fs.allow: [".."]는 Vite가 todo-app 밖의 파일도 읽게 허락한다. 밖에 있는 테스트 파일을 열려면 필요하다
- resolve.dedupe는 tests 폴더에서 react를 불러도 todo-app 안의 react 한 벌만 쓰게 한다
- React가 두 벌 섞이면 useState가 에러를 낸다

## project-setup T4

### .prettierrc

- prettier는 코드 줄바꿈과 띄어쓰기를 자동으로 맞춘다
- semi: false는 줄 끝 세미콜론을 빼게 한다. 그래서 이 강의 코드에는 세미콜론이 없다

### package.json

- format 스크립트의 prettier --write src는 src 안의 파일을 고쳐서 저장한다

## todo-list T1

### src/App.jsx

#### 개념 map으로 목록 그리기
##### 무엇
- 배열의 map은 원소마다 함수를 불러 새 배열을 만든다
- JSX 안에 li 배열을 넣으면 React가 차례로 그린다
##### 쉬운 방법과 비교
- li 세 개를 직접 써도 2장 화면은 같다
- 3장에서 추가를 누르면 배열이 늘어나므로 직접 쓴 li로는 따라갈 수 없다
- 5장 삭제와 8장 거르기도 배열만 바꾸면 목록이 따라온다
##### 헷갈리는 개념
- forEach는 아무것도 돌려주지 않는다. 그래서 JSX 안에서는 map을 쓴다
##### 이 예제에서는
- todos.map이 할 일 객체 하나를 li 하나로 바꾼다

#### 개념 key
##### 무엇
- key는 React가 목록의 줄을 서로 구분하는 이름표다
- 목록 안에서 겹치지 않아야 한다
##### 왜
- 배열이 바뀌면 React는 key로 어느 줄이 그대로이고 어느 줄이 새것인지 맞춘다
##### 쉬운 방법과 비교
- map의 두 번째 인자인 순서 번호(index)를 key로 써도 2장에서는 문제없다
- 5장에서 위 줄을 지우거나 8장에서 거르면 순서 번호가 당겨진다
- 그러면 7장에서 수정 중이던 칸이 옆 줄로 옮겨 붙는다
- 줄이 바뀌지 않는 고정 목록이라면 순서 번호도 괜찮다
##### 헷갈리는 개념
- key는 props로 넘어가지 않는다. 6장 TodoItem 안에서 key를 읽을 수 없다
##### 이 예제에서는
- 할 일마다 있는 id를 key로 쓴다

#### 코드
- todos 배열은 컴포넌트 함수 밖에 둔다. 아직 바뀌지 않는 값이라 한 번만 만든다
- 할 일 하나는 id, text, done을 가진 객체다. done은 4장에서 쓴다
- 중괄호 안의 todo.text가 글자로 그려진다

## todo-list T2

### src/App.jsx

- ul에 stack을 붙여 줄 사이를 띄운다

### src/index.css

- .todo-list 덩어리를 더한다. 목록 앞 점과 기본 여백을 없앤다

## todo-add T1

### src/App.jsx

#### 개념 useState
##### 무엇
- state는 컴포넌트가 기억하는 값이다
- useState는 지금 값과 바꾸는 함수를 한 쌍으로 준다
- 바꾸는 함수를 부르면 React가 컴포넌트를 다시 그린다
##### 왜
- 입력칸에 친 글자를 추가 버튼을 누를 때까지 기억해야 한다
##### 쉬운 방법과 비교
- let text = ""로 두고 바꾸면 화면이 다시 그려지지 않는다
- 다시 그려지더라도 함수가 처음부터 돌아 text는 다시 빈 글자가 된다
- 제출할 때 document.querySelector로 칸의 글자를 읽어도 3장 추가는 된다
- 3장 T2에서 추가 뒤 칸을 비우고 7장 취소에서 원래 글로 되돌릴 때는 state 쪽이 한 줄로 끝난다
- 값을 제출 때 한 번만 읽고 화면에 다시 쓰지 않는다면 직접 읽는 쪽도 괜찮다
##### 헷갈리는 개념
- setText를 부른 바로 다음 줄의 text는 아직 앞 값이다. 새 값은 다시 그린 뒤에 보인다
- 6장 props는 부모가 주는 값이고 state는 이 컴포넌트가 스스로 바꾸는 값이다
##### 이 예제에서는
- text가 입력칸 글자다

#### 코드
- import { useState } from "react"는 react에서 useState만 꺼내 온다
- const [text, setText]는 배열 구조 분해다. 이름은 마음대로 짓지만 set을 붙이는 게 관례다
- useState("")의 빈 글자가 처음 값이다
- value={text}는 칸에 보이는 글자를 state로 정한다
- onChange는 글자 하나를 칠 때마다 불린다. e.target.value가 지금 칸의 글자다
- value만 쓰고 onChange를 빼면 칸에 글자가 쳐지지 않는다
- placeholder는 빈 칸에 흐리게 보이는 안내 글이다

## todo-add T2

### src/App.jsx

#### 개념 form 제출 이벤트
##### 무엇
- form 안의 버튼을 누르거나 칸에서 엔터를 치면 form의 submit 이벤트가 난다
- onSubmit에 함수를 주면 그때 불린다
##### 쉬운 방법과 비교
- 추가 버튼에 onClick을 달아도 버튼을 누르면 추가된다
- onClick만 쓰면 칸에서 엔터를 쳐도 추가되지 않는다
- 7장 수정 칸도 form이라 엔터로 저장한다
##### 헷갈리는 개념
- form은 제출하면 페이지를 새로 불러오는 게 기본이다. 새로 불러오면 state가 모두 사라진다
- e.preventDefault()가 그 기본 동작을 막는다
- form 안 button의 기본 type은 submit이다. 그래서 7장 취소 버튼에는 type="button"을 붙인다
##### 이 예제에서는
- handleSubmit이 새로고침을 막고 할 일을 더한 뒤 칸을 비운다

#### 개념 배열 state는 새 배열로 바꾸기
##### 무엇
- 배열 state를 바꿀 때는 원래 배열을 고치지 않고 새 배열을 만들어 넘긴다
##### 왜
- React는 넘겨받은 배열이 앞 배열과 같은 것인지 본다. 같으면 다시 그리지 않는다
##### 쉬운 방법과 비교
- todos.push(새 할 일) 뒤 setTodos(todos)를 하면 같은 배열이라 화면에 안 나온다
- 4장 체크는 map, 5장 삭제는 filter, 7장 수정은 map으로 같은 규칙을 따른다
##### 헷갈리는 개념
- const todos라서 못 바꾸는 게 아니다. const는 이름에 다른 값을 다시 넣는 것만 막고 push는 막지 않는다
##### 이 예제에서는
- [...todos, 새 객체]가 앞 할 일을 펼쳐 담고 끝에 하나를 더한 새 배열이다

#### 코드
- todos를 initialTodos로 이름을 바꾸고 useState의 처음 값으로 넘긴다. 이제 todos는 state다
- Date.now()는 지금 시각을 밀리초 숫자로 준다. 겹치지 않는 id로 쓴다
- setText("")가 추가 뒤 칸을 비운다
- form에 row와 todo-form을 붙여 칸과 버튼을 한 줄에 놓는다
- button-primary는 검게 채운 버튼이다

### src/index.css

- .todo-form .input 덩어리를 더한다. flex: 1로 칸이 남은 폭을 다 차지한다

## todo-add T3

### src/App.jsx

- text.trim()은 앞뒤 공백을 지운다. 공백만 친 칸도 빈 칸으로 본다
- return으로 함수를 일찍 끝내 아래 추가 코드가 돌지 않게 한다

## todo-toggle T1

### src/App.jsx

#### 개념 map으로 새 배열 만들어 state 바꾸기
##### 무엇
- 바꿀 줄 하나만 새 객체로 만들고 나머지는 그대로 담은 새 배열을 만든다
##### 쉬운 방법과 비교
- todo.done = !todo.done으로 객체를 직접 고치고 setTodos([...todos])를 해도 화면은 바뀐다
- 그러면 처음 값인 initialTodos의 객체까지 고쳐진다
- 테스트는 App을 여러 번 새로 그리는데 앞 테스트에서 체크한 줄이 다음 테스트에 체크된 채 나온다
- 7장 handleEdit도 같은 모양으로 글만 바꾼다
##### 헷갈리는 개념
- 3장의 [...todos]는 배열을 펼치고 여기 {...todo}는 객체를 펼친다
- {...todo, done: true}처럼 뒤에 쓴 값이 앞 값을 덮는다
##### 이 예제에서는
- handleToggle이 id가 같은 줄만 done을 뒤집는다

#### 코드
- 조건 ? 값1 : 값2는 삼항 연산자다. 같은 id면 새 객체, 아니면 원래 객체다
- !todo.done은 true와 false를 뒤집는다
- type="checkbox"의 체크 여부는 checked로 정한다. 글자 칸의 value 자리다
- onChange={() => handleToggle(todo.id)}는 화살표 함수로 감싼다. 이 줄의 id를 넘기려면 감싸야 한다
- label로 감싸면 글자를 눌러도 체크된다

## todo-toggle T2

### src/App.jsx

#### 개념 조건에 따른 class
##### 무엇
- className에 중괄호로 식을 넣으면 state에 따라 class가 바뀐다
##### 쉬운 방법과 비교
- 체크할 때 classList.add("done")으로 직접 붙이면 React가 다시 그릴 때 className으로 덮어 지운다
- style={{ textDecoration: "line-through" }}로 바로 써도 된다. 다만 색 변수를 CSS 한 곳에서 고칠 수 없다
- 8장에서 고른 버튼을 진하게 할 때도 같은 방식을 쓴다
##### 헷갈리는 개념
- class가 없을 때는 빈 글자를 준다. 그래서 class 속성은 남지만 붙은 이름이 없다
##### 이 예제에서는
- done이 참인 span에만 done class가 붙는다

### src/index.css

- .done 덩어리를 더한다. 글자를 흐리게 하고 가운데 줄을 긋는다

## todo-delete T1

### src/App.jsx

#### 개념 filter로 새 배열 만들어 지우기
##### 무엇
- filter는 조건이 참인 원소만 담은 새 배열을 만든다
- 지울 id가 아닌 줄만 남기면 그 줄이 지워진다
##### 쉬운 방법과 비교
- splice로 지우면 원래 배열이 바뀐다. 같은 배열이라 3장에서 본 대로 다시 그리지 않는다
- splice는 순서 번호도 따로 찾아야 한다
##### 헷갈리는 개념
- 8장에서도 filter를 쓰지만 그때는 state를 바꾸지 않는다. 보여줄 줄만 계산한다
##### 이 예제에서는
- handleDelete가 todo.id !== id인 줄만 남긴다

#### 코드
- !==는 값과 종류가 모두 다른지 본다
- 삭제 button은 form 밖에 있어 눌러도 제출되지 않는다

## todo-delete T2

### src/App.jsx

- li에 row를 붙여 체크 칸 묶음과 삭제 버튼을 한 줄에 놓는다
- button-text는 테두리 없는 글자 버튼이다

### src/index.css

- .todo-list label 덩어리를 더한다. label이 남은 폭을 차지해 삭제 버튼이 줄 끝으로 간다

## todo-components T1

### src/App.jsx

#### 개념 props
##### 무엇
- props는 부모 컴포넌트가 자식에게 넘기는 값이다
- 태그의 속성처럼 쓰면 자식 함수가 객체 하나로 받는다
##### 왜
- App 하나에 목록 줄 그리기까지 다 있어 길어졌다
- 한 줄을 TodoItem으로 빼면 App은 목록과 state만 다룬다
##### 쉬운 방법과 비교
- App 하나에 그대로 둬도 6장 화면은 똑같다
- 7장에서 줄마다 수정 칸과 고치던 글을 따로 기억해야 할 때 줄 컴포넌트가 있으면 쉽다
- 줄이 짧고 더 늘지 않는다면 나누지 않는 편이 읽기 쉽다
##### 헷갈리는 개념
- props는 자식이 읽기만 한다. 자식이 todo.done = true로 고치면 안 된다
- key는 React가 쓰는 이름표라 TodoItem에 넘어가지 않는다
##### 이 예제에서는
- todo, onToggle, onDelete 세 개를 넘긴다

#### 개념 state는 부모에 두기
##### 무엇
- 여러 컴포넌트가 함께 쓰는 state는 그들의 공통 부모에 둔다
##### 쉬운 방법과 비교
- 줄마다 TodoItem 안에 done state를 두면 체크는 6장에서도 된다
- 8장에서 남은 일만 거르려면 App이 어느 줄이 끝났는지 알아야 하는데 줄 안 state는 App이 볼 수 없다
##### 헷갈리는 개념
- 모든 state가 부모에 가는 것은 아니다. 7장 수정 중인지와 고치던 글은 그 줄만 쓰므로 TodoItem에 둔다
##### 이 예제에서는
- todos와 handleToggle, handleDelete는 App에 남는다

#### 코드
- import TodoItem from "./TodoItem.jsx"는 같은 폴더의 파일에서 대표 내보내기를 받는다
- map 안에서 li 대신 <TodoItem />을 돌려준다. key는 여기 바깥 태그에 붙인다

### src/TodoItem.jsx

#### 개념 함수 props
##### 무엇
- 함수도 props로 넘길 수 있다
- 자식은 부모 state를 직접 못 바꾸니 부모가 준 함수를 불러 부탁한다
##### 쉬운 방법과 비교
- 자식이 setTodos를 받아 직접 바꿀 수도 있다
- 그러면 바꾸는 규칙이 여러 파일로 흩어진다
- 함수 props면 바꾸는 코드가 App 한 곳에 모이고 자식은 id만 알린다
##### 헷갈리는 개념
- onClick={onDelete(todo.id)}로 쓰면 그릴 때 바로 불려 줄이 지워진다
- onClick={() => onDelete(todo.id)}처럼 화살표 함수로 감싸야 누를 때 불린다
##### 이 예제에서는
- onToggle과 onDelete가 App의 handleToggle과 handleDelete다

#### 코드
- 함수 인자 { todo, onToggle, onDelete }는 props 객체를 구조 분해해 이름으로 꺼낸다
- 함수 props 이름은 on으로 시작하는 게 관례다
- li 안의 코드는 App에 있던 것을 그대로 옮기고 handle 대신 on 이름을 부른다

## todo-edit T1

### src/TodoItem.jsx

#### 개념 조건부 렌더링
##### 무엇
- state에 따라 다른 JSX를 돌려준다
##### 쉬운 방법과 비교
- 글자 줄과 수정 칸을 둘 다 그려 두고 CSS로 하나를 숨겨도 보이는 화면은 같다
- 그러면 줄마다 숨은 입력칸이 늘 있어 테스트와 화면 읽기 도구가 그것까지 찾는다
##### 헷갈리는 개념
- 함수 앞에서 if로 일찍 return하는 방법과 JSX 안의 {editing && ...}나 삼항은 같은 일을 한다
- 모양이 통째로 바뀔 때는 if return이 읽기 쉽고 한 조각만 바뀔 때는 JSX 안 조건이 짧다
##### 이 예제에서는
- editing이 참이면 수정 칸 li를, 거짓이면 원래 li를 돌려준다

#### 개념 자식 컴포넌트 안의 state
##### 무엇
- 그 컴포넌트만 쓰는 값은 그 안에 state로 둔다
- 같은 TodoItem이라도 줄마다 state를 따로 가진다
##### 쉬운 방법과 비교
- App에 editingId 하나를 두고 그 id인 줄만 수정 칸으로 그려도 된다
- 그러면 한 번에 한 줄만 고칠 수 있다. 이 앱은 여러 줄을 함께 열어 둘 수 있다
- 한 줄만 열리게 하고 싶다면 App에 editingId를 두는 쪽이 낫다
##### 헷갈리는 개념
- useState(todo.text)의 처음 값은 처음 그릴 때 한 번만 쓰인다
- 그래서 취소할 때 setDraft(todo.text)로 직접 되돌린다
- key를 순서 번호로 쓰면 이 state가 다른 줄로 옮겨 붙는다
##### 이 예제에서는
- editing은 수정 중인지, draft는 고치던 글이다

#### 코드
- 수정 칸 li에도 todo-form을 붙여 칸이 남은 폭을 차지하게 한다
- 수정 버튼은 setEditing(true)만 부른다. 부모에게 알릴 일이 아니다
- handleCancel은 고치던 글을 버리고 수정 칸을 닫는다

## todo-edit T2

### src/App.jsx

- handleEdit은 id와 새 글 두 개를 받는다. 함수 props도 인자를 여러 개 받을 수 있다
- { ...todo, text: text }는 글만 바꾼 새 객체다
- onEdit={handleEdit}로 넘긴다

### src/TodoItem.jsx

- 수정 칸을 form으로 감싸 저장 버튼과 엔터가 handleSave를 부른다
- handleSave는 onEdit으로 부모에게 새 글을 알리고 수정 칸을 닫는다
- 취소 버튼에 type="button"을 붙인다. 없으면 form을 제출해 저장된다

### src/index.css

- .todo-form .input에 min-width: 0을 더한다
- flex 안의 입력칸은 기본으로 정해진 최소 폭 아래로 줄지 않는다
- 칸이 줄어들 수 있어야 저장과 취소 버튼이 카드 안에 들어간다

## todo-edit T3

### src/TodoItem.jsx

- 3장 추가와 같은 trim 검사다. 빈 칸이면 저장하지 않고 수정 칸을 연 채 둔다

## todo-filter T1

### src/App.jsx

#### 개념 state에서 계산한 값
##### 무엇
- state로 바로 구할 수 있는 값은 state로 두지 않고 그릴 때마다 계산한다
##### 왜
- 같은 내용을 두 state에 두면 하나만 바뀌고 다른 하나는 남는 일이 생긴다
##### 쉬운 방법과 비교
- visibleTodos를 state로 두고 거르는 버튼을 누를 때 setVisibleTodos로 바꿔도 처음에는 맞게 보인다
- 남은 일을 보다가 체크하면 그 줄이 사라져야 하는데 visibleTodos는 그대로라 남는다
- 추가, 체크, 삭제, 수정 함수마다 visibleTodos도 같이 고쳐야 한다
##### 헷갈리는 개념
- filter는 state다. 사용자가 고른 것이라 계산으로 구할 수 없다
- visibleTodos는 todos와 filter로 구하니 state가 아니다
- 5장 filter는 setTodos로 할 일을 지우고 여기 filter는 todos를 그대로 둔다
##### 이 예제에서는
- visibleTodos를 return 바로 위에서 계산하고 map은 visibleTodos를 그린다

#### 코드
- useState("all")은 처음에 전체를 보이게 한다
- all, active, done 세 글자로 고른 조건을 나눈다
- filter 함수 안의 if return은 조건마다 남길지 정한다. 둘 다 아니면 true로 모두 남긴다
- 버튼 묶음 div에 row를 붙여 가로로 놓는다

## todo-filter T2

### src/App.jsx

#### 개념 선택된 버튼 표시
##### 무엇
- 지금 고른 조건의 버튼만 진하게 그린다
##### 쉬운 방법과 비교
- 누른 버튼에 classList로 직접 class를 붙이면 다른 버튼을 눌러도 앞 버튼이 진한 채 남는다
- filter state로 class를 정하면 고른 것 하나만 진하다
##### 이 예제에서는
- 4장 조건에 따른 class와 같은 삼항이다

#### 코드
- 고른 버튼은 button과 button-primary 두 class를 받는다
