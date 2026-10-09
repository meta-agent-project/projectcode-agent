---
name: projectcode-mockup
description: 새 화면이 있는 장에서 만들기 전에 화면 모습을 정한다. 정해진 색, 글꼴, 크기, 간격만 쓰는 모노톤 공통 CSS로 배치와 크기 선택이 다른 HTML 시안 2개를 보여주고 하나를 고르게 한다. "화면 시안", "목업", "projectcode-mockup" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-mockup

화면을 만들기 전에 사용자와 화면 모습을 정한다.
고른 시안은 모습의 기준이다. 코드는 plan이 따로 정한다. 캡처는 이 모습과 같아야 한다.

## 공통 CSS

이 스킬 폴더의 base.css다. 값은 아래 목록에서만 고른다.

| 종류 | 값 |
|---|---|
| 색 | primary, secondary, line, bg |
| 글꼴 | body, mono |
| 글자 크기 | small, body, title |
| 간격 | s, m, l |
| 높이 | control |
| 모서리 | control, card |
| 너비 | page, form |

- project-setup 장에서 base.css를 앱에 복사해 넣는다. 그 뒤로 앱은 그 복사본을 쓴다
- 수업에서는 미리 준비된 스타일로 소개하고 설명하지 않는다

## 시안이 지킬 것

- base.css의 부품 클래스로 만든다
- 화면만의 style은 배치 몇 줄만 쓴다. 예: 폼 너비, 가운데 정렬
- style에는 base.css 변수만 쓴다. 숫자나 색을 새로 쓰지 않는다
- 애니메이션, 그림자, 그라데이션, 아이콘, 꾸밈 그림을 넣지 않는다
- 태그를 겹겹이 감싸지 않는다. 학생이 따라 칠 수 있는 깊이로 둔다
- spec 화면 그림의 요소를 빠짐없이 넣고, 없는 요소는 더하지 않는다

## 순서

1. 확인
   spec.md에 화면 절이 없으면 건너뛴다. 다음은 projectcode-plan이라고 알린다.

2. 읽기
   spec.md의 화면 그림과 흐름, base.css를 읽는다.
   앞 장의 mockup.html 중 같은 종류의 화면이 있으면 읽고 배치를 맞춘다.

3. 시안 2개 만들기
   .projectcode/chapters/<장>/에 mockup-a.html, mockup-b.html을 만든다.
   - base.css를 상대 경로로 불러온다
   - 이 장의 화면을 한 파일에 모두 담는다
   - 두 시안은 배치와 고른 단계만 다르다. 예: 간격 m과 l, 폼 너비와 페이지 너비, 가운데와 왼쪽 정렬
   - 브라우저로 바로 열린다

4. 보여주고 고르기
   두 파일을 브라우저로 연다.
   두 시안의 차이를 한 줄씩 알려주고 하나를 고르게 한다.
   섞고 싶다고 하면 섞어서 다시 만들고 다시 보여준다.

5. 저장
   고른 시안을 mockup.html로 이름을 바꾸고 나머지는 지운다.
   저장한 것이 승인이다. 커밋은 하지 않는다. task 승인 뒤 [장] 시작 커밋에 들어간다.

6. 다음
   projectcode-plan이라고 알린다.

## 시안 예시

```
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="../../../.claude/skills/projectcode-mockup/base.css">
  <style>
    .signup { max-width: var(--width-form); margin: var(--space-l) auto; }
  </style>
</head>
<body>
  <main class="page">
    <form class="card stack signup">
      <h1 class="title">회원가입</h1>
      <label class="field"><span class="label">아이디</span><input class="input"></label>
      <label class="field"><span class="label">비밀번호</span><input class="input" type="password"></label>
      <button class="button button-primary">가입하기</button>
    </form>
  </main>
</body>
</html>
```
