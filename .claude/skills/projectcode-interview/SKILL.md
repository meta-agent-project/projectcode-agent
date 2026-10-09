---
name: projectcode-interview
description: 강의 예제의 목적을 질문으로 정해 roadmap.md(강의 목차)와 contract.md(기술, 실행, 캡처 방법)를 만들거나 고친다. 새 장 추가와 장 순서 변경도 여기서 한다. "강의 목차 만들어줘", "예제 정하자", "장 추가", "projectcode-interview" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-interview

강의 예제의 목적을 정하고 roadmap.md와 contract.md를 만든다.
장 하나의 상세는 projectcode-spec이 정한다.

## 순서

1. 읽기
   roadmap.md, contract.md를 읽는다.
   이미 있으면 새로 만들지 않고 고친다. 새 장 추가, 순서 변경, 미룬 것을 장으로 올리기.
   완료된 장의 내용은 고치지 않는다. 그것은 projectcode-fix가 한다.

2. 질문
   한 번에 하나씩 묻는다. 추천안을 첫 번째에 둔다. 최대 10개.
   - 무엇을 가르치는 예제인가
   - 학생은 무엇을 알고 오나 (선수 지식)
   - 다 배우면 무엇을 만들 수 있나 (결과물)
   - 일부러 다루지 않을 것은 무엇인가
   - 예제 형태: 프론트만, 백엔드만, 둘 다
   - 기술: 언어, 프레임워크, 저장소, 패키지 관리자, 테스트 도구
   - 화면과 API 결과를 어떻게 남길까 (캡처 방법)
   기술 후보의 최신 버전과 무료 여부는 technical-researcher 에이전트로 먼저 확인한다.

3. 장 나누기
   - 첫 장은 project-setup이다
   - 장 하나는 기능 하나 또는 리팩터 하나다
   - 학습 목표를 장마다 나눠 "배울 것"에 적는다. 선수 지식은 배울 것에 넣지 않는다
   - 지금 안 하는 것은 미룬 것, 아예 안 하는 것은 하지 않는 것에 적는다

4. 초안 보여주기
   roadmap.md와 contract.md 초안을 채팅창에 보여주고 승인을 받는다.
   승인 전에는 저장하지 않는다.

5. 저장과 커밋
   제목: [projectcode] 강의 목차와 규칙
   본문: Kind: docs

6. 알리기
   첫 장 project-setup을 projectcode-spec으로 시작하자고 알린다.

## roadmap.md 형식

```
# 로드맵

강의: 회원가입과 로그인으로 배우는 React와 Express
대상: HTML, CSS, JS 기초를 아는 학생
결과물: 가입하고 로그인하는 웹 앱

## 선수 지식
- HTML: form, input, button
- JS: 변수, 함수, 화살표 함수, 배열, 객체

## 학습 목표
- React 컴포넌트, JSX, useState
- Express 라우트, SQLite 저장
- fetch와 async/await
- react-router 화면 이동

## 장
| 번호 | 장 ID | 이름 | 종류 | 배울 것 | 상태 |
|---|---|---|---|---|---|
| 1 | project-setup | 프로젝트 뼈대 | 기능 | 프로젝트 구조, 실행 방법 | 대기 |
| 2 | signup-form | 회원가입 폼 | 기능 | 컴포넌트, JSX, useState | 대기 |
| 3 | signup-api | 회원가입 API | 기능 | Express 라우트, SQLite 저장 | 대기 |

## 미룬 것
- 입력 검사

## 하지 않는 것
- 배포
- 소셜 로그인
```

## contract.md 형식

```
# 프로젝트 규칙

## 기술
| 항목 | 선택 |
|---|---|
| 프론트 | React 19, Vite |
| 백엔드 | Express 5 |
| 저장소 | SQLite |
| 패키지 관리자 | pnpm |
| 화면 테스트 | Playwright |
| API 테스트 | supertest |

## 실행
- 설치: pnpm install
- 실행: pnpm dev
- 테스트: pnpm test

## 캡처
- 화면: Playwright가 브라우저에서 화면을 띄워 PNG로 저장한다
- API: 테스트가 요청과 응답을 JSON으로 저장한다
```
