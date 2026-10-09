# projectcode 하네스

강의용 예제 코드를 만드는 Claude Code 하네스다.
프로덕션 코드가 아니라, 장마다 그 장에서 배울 것만 담은 읽기 쉬운 코드를 만든다.
코드와 함께 원고와 책의 재료(커밋 꼬리표, 계획, 사진, 도식)를 남긴다.

원본은 일반 개발 하네스 metakit-sdd-harness다.

## 필요한 것

| 무엇 | 왜 |
|---|---|
| Claude Code | 하네스를 실행한다 |
| git | 장과 task를 커밋으로 남긴다 |
| Node | 사진과 폴더 구조도를 만드는 엔진을 돌린다. 예제 언어와 상관없이 필요하다 |

Node가 없으면 capture 스킬이 설치 명령을 보여주고 허락을 받아 설치한다.

## 시작하기

1. 예제 폴더를 만든다. 예: projectlab/examples/signup-lab
2. 이 하네스의 .claude 폴더를 예제 폴더에 복사한다
3. 예제 폴더에서 Claude Code를 열고 /projectcode-flow를 실행한다

flow가 지금 할 차례를 알아내서 init, interview부터 차례로 진행한다.
중간에 멈췄다가 다시 시작할 때도 /projectcode-flow만 실행하면 된다.

## 흐름

```
처음 한 번   init -> interview (roadmap = 강의 목차, contract = 기술과 실행 방법)

장마다       spec     할 일, 글자로 그린 화면, 흐름, 범위 질문      승인
             mockup   새 화면이 있는 장만. 시안 2개 중 하나        선택
             plan     코드 상세 계획과 핵심 코드                    승인
             task     작업 순서. task 하나 = 커밋 하나              승인
             tdd      할 일마다 행동 테스트를 코드보다 먼저
             implement  task 하나씩 코드, 검사, 과정 사진, 커밋
             converge   빠짐, 어긋남, 넘침, 순서 어긋남 점검
             capture    장 끝 사진
             diagram    흐름, ERD, 폴더 구조도
             task       장 완료와 done 태그
             wiki       프로젝트 전체 보기

앞 장 고치기  fix      메인 코드 수정, 샌드박스에서 그 장 사진과 도식 다시, patch
```

사람이 멈추는 곳은 spec, mockup, plan, task의 승인과 장이 끝났을 때다.
그사이는 이어서 진행하고, 넘침이 나오면 멈추고 묻는다.

## 스킬

| 스킬 | 하는 일 |
|---|---|
| projectcode-flow | 시작점. 지금 차례를 알아내고 다음 스킬을 실행한다 |
| projectcode-init | 예제 저장소 기본 구조 |
| projectcode-interview | 강의 목적, 선수 지식, 학습 목표, 장 나누기 |
| projectcode-spec | 장 하나의 할 일, 화면, 흐름, 범위 |
| projectcode-mockup | 모노톤 공통 CSS로 시안 고르기 |
| projectcode-plan | 코드 상세 계획 |
| projectcode-task | 작업 순서, 장 시작과 완료 커밋 |
| projectcode-tdd | 행동 테스트 먼저 |
| projectcode-implement | task 하나씩 구현하고 커밋 |
| projectcode-converge | 장 전체 점검 |
| projectcode-capture | 사진 찍기. 엔진 capture.mjs |
| projectcode-diagram | 도식 만들기. 폴더 구조도 엔진 tree.mjs |
| projectcode-fix | 완료된 장 고치기 |
| projectcode-wiki | 프로젝트 전체를 보는 읽기 전용 문서와 점검 |

공통 규칙은 .claude/projectcode-rules.md에 있다. init이 CLAUDE.md에 연결해서 모든 세션이 읽는다.

## 예제 저장소에 남는 것

```
.projectcode/
  roadmap.md          목차와 장 상태
  contract.md         기술, 실행 · 테스트 · 캡처 방법
  chapters/<장>/      spec, mockup, plan, tasks, captures/, diagrams/, fixes/
  wiki/               프로젝트 전체 보기
tests/<장>/           행동 테스트
(나머지)              학생 코드
```

커밋 제목은 [장 ID] 뒤에 짧은 한국어이고, 본문 꼬리표(Chapter, Kind, Task, Why, Touches, Fixes)가 원고의 단서가 된다.
자세한 것은 규칙 파일에 있다.
