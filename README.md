# projectcode 하네스

강의용 예제 코드를 만드는 Claude Code 하네스다.
장마다 그 장에서 배울 것만 담은 읽기 쉬운 코드를 만든다.
원고 재료인 커밋 꼬리표, 계획, 사진, 도식도 함께 남긴다.

## 필요한 것

| 무엇 | 왜 |
|---|---|
| Claude Code | 하네스 실행 |
| git | 장과 task를 커밋으로 남김 |
| Node | 사진과 폴더 구조도 엔진 실행 |

## 시작하기

- 예제 폴더를 만든다
- 이 저장소의 .claude 폴더를 예제 폴더에 복사한다
- 예제 폴더에서 Claude Code를 열고 /projectcode-flow를 실행한다

멈췄다가 다시 할 때도 /projectcode-flow만 실행한다.

## 흐름

```
처음 한 번   init -> interview
장마다       spec -> mockup -> plan -> task -> tdd -> implement
             -> converge -> capture -> diagram -> task -> wiki
앞 장 고치기  fix
```

사람은 spec, mockup, plan, task를 승인할 때와 장이 끝날 때 멈춘다.

## 스킬

| 스킬 | 하는 일 |
|---|---|
| projectcode-flow | 시작점. 지금 차례를 알아내 다음 스킬을 부른다 |
| projectcode-init | .projectcode 폴더, CLAUDE.md 연결, git 준비 |
| projectcode-interview | 강의 목차 roadmap과 기술 약속 contract를 정한다 |
| projectcode-spec | 장의 할 일, 글자 화면, 흐름, 범위를 정한다 |
| projectcode-mockup | 새 화면이 있는 장에서 시안 2개 중 하나를 고른다 |
| projectcode-plan | 어떤 파일에 어떤 코드를 쓸지 정한다 |
| projectcode-task | 작업 순서를 만들고 장 시작과 완료를 커밋한다 |
| projectcode-tdd | 코드보다 먼저 행동 테스트를 쓴다 |
| projectcode-implement | task 하나씩 구현, 검사, 커밋한다 |
| projectcode-converge | 빠짐, 어긋남, 넘침, 순서 어긋남을 찾는다 |
| projectcode-capture | 앱을 실행해 화면 PNG와 API JSON을 남긴다 |
| projectcode-diagram | 흐름, ERD, 폴더 구조도를 만든다 |
| projectcode-fix | 완료된 장을 고치고 그 장 사진과 도식을 다시 만든다 |
| projectcode-wiki | 프로젝트 전체를 보는 읽기 전용 문서를 만든다 |

공통 규칙은 .claude/projectcode-rules.md에 있다.

## 예제 저장소에 남는 것

```
.projectcode/
  roadmap.md        목차와 장 상태
  contract.md       기술, 실행, 테스트, 캡처 방법
  chapters/<장>/    spec, mockup, plan, tasks, captures, diagrams, fixes
  wiki/             프로젝트 전체 보기
tests/<장>/         행동 테스트
```
