---
name: projectcode-task
description: 승인된 plan으로 tasks.md에 체크박스 작업 순서를 만들고 [장] 시작 커밋을 한다. 장의 마지막에는 모든 체크를 확인하고 [장] 완료 커밋, roadmap 완료, done 태그를 한다. "작업 나눠줘", "장 마무리", "projectcode-task" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-task

장의 작업 순서를 체크박스로 만든다.
이 순서는 AI가 코드를 완성하는 커밋 순서이고, 학생이 따라 칠 순서다. 둘은 같아야 한다.
장의 처음과 끝을 커밋으로 묶는다.

## 만들 때 (plan 승인 뒤)

1. 읽기
   이 장의 spec.md와 plan.md를 읽는다.

2. task 나누기
   - task 하나는 커밋 하나다. implement는 이 순서대로, task 하나씩 커밋한다
   - task 하나는 학생이 따라 쳐서 실행해 볼 수 있는 단위다. 끝나면 앱이 돌아가고 무언가 보인다
   - 순서는 수업 순서다. 앞 task가 있어야 뒤 task를 이해할 수 있게 둔다
   - 앞 task가 뒤 task의 코드를 미리 쓰지 않게 나눈다
   - task 제목은 짧은 한국어다. 커밋 제목이 된다
   - 모든 할 일 S번호가 어떤 task에 들어가야 한다

3. tasks.md 쓰기
   아래 형식대로 쓴다.
   맨 앞에 테스트 작성, 맨 뒤에 수렴 점검, 캡처, 도식을 둔다.

4. 보여주고 승인받기
   task 제목과 실행하면 줄만 채팅창에 보여주고 순서를 승인받는다.
   승인을 받으면 .projectcode/chapters/<장>/tasks.md에 저장한다. 승인 전에는 저장하지 않는다.

5. 시작 커밋
   spec.md, mockup.html, plan.md, tasks.md, roadmap.md를 함께 커밋한다.
   제목: [장] 시작
   본문: Chapter, Kind: docs

6. 다음
   projectcode-tdd라고 알린다.

## 끝낼 때 (diagram 뒤)

1. 확인
   tasks.md의 모든 줄이 체크됐는지 본다. 남은 줄이 있으면 멈추고 그 줄을 알린다.

2. 코드 요약
   이 장의 커밋으로 summary-code.md를 쓴다. 아래 형식을 따른다.
   강사가 이 파일로 장의 학생 코드를 검수한다.

3. 완료 처리
   roadmap.md에서 이 장의 상태를 완료로 바꾼다.
   captures/, diagrams/, summary-code.md와 함께 커밋한다.
   제목: [장] 완료
   본문: Chapter, Kind: docs
   이 커밋에 태그 done/<장>을 단다.

4. 다음
   projectcode-wiki라고 알린다.

## summary-code.md 형식

- 학생 코드만 쓴다. 학생 코드 폴더는 contract.md의 폴더 표를 따른다
- 테스트, 사진, 문서는 쓰지 않는다
- task 순서로 쓴다. 테스트 보강, 고칠 task도 학생 코드가 바뀌면 넣는다
- task마다 커밋 해시와 바뀐 파일 표를 쓴다
- 새 파일은 전체 코드를 쓴다
- 고친 파일은 git show <해시> -- <학생 코드 폴더>의 diff를 쓴다
- 복사나 지움처럼 파일이 많으면 폴더와 개수만 쓴다
- 학생 코드가 바뀌지 않은 task는 한 줄로 그렇다고 쓴다

````
# signup-form 코드 요약

## T1 회원가입 화면 그리기
커밋: 3f2a1bc

| 파일 | 변경 |
|---|---|
| src/SignupForm.jsx | 새로 |
| src/App.jsx | 고침 |

```jsx
// src/SignupForm.jsx
export default function SignupForm() { ... }
```

```diff
// src/App.jsx
-  return <h1>Hello</h1>;
+  return <SignupForm />;
```

## T2 테스트 실행기
커밋: 8c1d2e4
- 학생 코드 변경 없음
````

## tasks.md 형식

```
# signup-form 작업

- [ ] 테스트 작성
- [ ] T1 회원가입 화면 그리기
  - 근거: S1
  - 파일: src/SignupForm.jsx, src/App.jsx
  - 실행하면: 빈 회원가입 폼이 보인다
  - Why: 화면부터 띄워야 다음 단계에서 입력을 연결할 수 있다
- [ ] T2 입력값을 state로 기억하기
  - 근거: S2
  - 파일: src/SignupForm.jsx
  - 실행하면: 입력한 글자가 칸에 남는다
  - Why: 기억한 값이 있어야 가입하기에서 쓸 수 있다
- [ ] T3 가입하기를 누르면 콘솔에 보여주기
  - 근거: S3
  - 파일: src/SignupForm.jsx
  - 실행하면: 개발자 도구 콘솔에 아이디와 비밀번호가 찍힌다
  - Why: 서버로 보내기 전에 값이 제대로 모였는지 눈으로 확인한다
- [ ] 수렴 점검
- [ ] 캡처
- [ ] 도식
```

- 체크는 그 일을 한 스킬이 한다
- Touches가 필요한 task는 다른 장 줄을 더한다. 예: 다른 장: signup-form
