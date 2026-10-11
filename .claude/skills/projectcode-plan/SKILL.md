---
name: projectcode-plan
description: 장 하나의 코드 상세 계획 plan.md를 쓴다. 어떤 파일에 어떤 코드를 쓸지, 할 일과 파일의 연결, 라이브러리, 건드리는 다른 장 파일을 정하고 채팅창에 요약해 승인을 받는다. "계획 세워줘", "projectcode-plan" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-plan

코드를 쓰기 위한 상세 계획을 쓴다. 순서는 task가 정하고, 여기서는 무엇을 어떻게 쓸지만 정한다.
plan.md는 나중에 원고를 쓸 때 "어떻게 짰나"의 단서가 된다.

## 순서

1. 읽기
   이 장의 spec.md와 mockup.html, contract.md, roadmap.md의 배울 것을 읽는다.
   앞 장까지 만든 소스 중 이 장이 고칠 파일을 읽는다. 계획을 지금 소스에 맞추려고 읽기만 한다.

2. 계획 쓰기
   아래 형식대로 쓴다.
   - 배울 것을 쓰는 가장 단순한 코드로 계획한다
   - 파일이나 함수를 나누면 나누는 이유를 한 줄 쓴다
   - 핵심 코드는 이 장의 배울 것이 드러나는 줄만 쓴다. 전체 코드를 쓰지 않는다
   - 모든 할 일 S번호가 파일에 연결돼야 한다

3. 화면 코드
   - mockup.html의 모습을 따르되 mockup 코드를 복사하지 않는다
   - mockup과 같은 스타일 기준의 클래스를 쓴다. 기준은 projectcode-mockup의 스타일 기준 절을 따른다
   - 이 장에 새로 필요한 CSS는 가장 짧게 쓴다
   - 애니메이션은 spec의 할 일에 있을 때만 쓴다

4. 라이브러리
   contract.md에 없는 라이브러리가 필요하면 묻는다. 추가할지, 없이 만들지.
   추가하면 contract.md에도 적는다.

5. 다른 장 파일
   완료된 장의 파일을 바꾸면 다른 장 파일에 그 장 ID와 함께 적는다.
   implement가 이것을 보고 커밋에 Touches를 붙인다.

6. 요약하고 승인받기
   채팅창에 5줄 안팎으로 요약하고 승인을 받는다. 전체를 보고 싶다고 하면 보여준다.
   승인을 받으면 .projectcode/chapters/<장>/plan.md에 저장한다. 승인 전에는 저장하지 않는다.

7. 다음
   projectcode-task라고 알린다.

## project-setup 장일 때

- 프로젝트 뼈대와 폴더 구조를 만든다
- contract.md의 실행과 테스트 명령이 동작하게 한다
- 화면이 있고 contract.md가 UI 라이브러리를 정하지 않았으면 base.css를 앱에 복사해 넣는다
- lint는 포맷만 맞추게 설정한다

## plan.md 형식

```
# signup-form 계획

## 파일
| 파일 | 새로 또는 고침 | 하는 일 |
|---|---|---|
| src/SignupForm.jsx | 새로 | 회원가입 폼 |
| src/App.jsx | 고침 | 회원가입 폼을 보여준다 |

## 코드 계획
SignupForm.jsx
- 아이디와 비밀번호를 useState 두 개로 기억한다
- input의 value와 onChange를 state에 연결한다
- form의 onSubmit에서 새로고침을 막고 두 값을 콘솔에 보여준다
- 클래스는 card, stack, field, label, input, button-primary를 쓴다

App.jsx
- SignupForm을 불러와 보여준다

## 핵심 코드
const [id, setId] = useState("")

<input className="input" value={id} onChange={(e) => setId(e.target.value)} />

function handleSubmit(e) {
  e.preventDefault()
  console.log(id, password)
}

## 할 일 연결
| 할 일 | 파일 |
|---|---|
| S1 | SignupForm.jsx, App.jsx |
| S2 | SignupForm.jsx |
| S3 | SignupForm.jsx |

## 라이브러리
- 추가 없음

## 다른 장 파일
- 없음
```

## 채팅창 요약 예시

```
signup-form 계획
- 새 파일 1개(SignupForm.jsx), 고칠 파일 1개(App.jsx)
- useState 두 개로 입력값을 기억하고, 가입하기는 콘솔에 보여준다
- 라이브러리 추가 없음, 다른 장 파일 건드리지 않음
승인할까요?
```
