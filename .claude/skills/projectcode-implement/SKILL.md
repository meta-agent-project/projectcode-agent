---
name: projectcode-implement
description: tasks.md의 순서대로 task 하나씩 코드를 쓰고, 커밋 전에 파일, 라이브러리, 동작, 테스트를 검사한 뒤 꼬리표를 붙여 커밋한다. "구현해줘", "implement", "projectcode-implement" 요청이나 projectcode-flow, projectcode-fix가 부를 때 사용.
---

# projectcode-implement

task 하나를 커밋 하나로 구현한다. 커밋 순서가 곧 수업 순서다.
넘침은 커밋하기 전에 막는다.
사진은 찍지 않는다. 장의 수렴이 끝난 뒤 사진사가 task 커밋마다 찍는다.

## task 하나씩

1. 읽기
   tasks.md에서 체크 안 된 첫 T task를 읽는다. 근거, 파일, 실행하면, Why, 다른 장.
   plan.md의 그 파일 계획과 핵심 코드를 읽는다.

2. 코드 쓰기
   - plan.md대로 쓴다. 규칙 파일의 코드 쓰는 법을 따른다
   - 주석을 달지 않는다
   - 이 task의 근거 S번호만 구현한다. 뒤 task의 코드를 미리 쓰지 않는다
   - plan.md에 없는 파일이나 라이브러리가 필요하면 멈추고 묻는다

3. 커밋 전 검사
   하나라도 어긋나면 고치고 다시 검사한다.

   | 검사 | 통과 조건 |
   |---|---|
   | 파일 | 바뀐 파일이 이 task의 파일 줄에 모두 있다 |
   | 라이브러리 | 새 패키지가 contract.md나 plan.md에 있다 |
   | 동작 | 바뀐 코드에 이 task의 근거 S번호 밖의 동작이 없다 |
   | 테스트 잠금 | [장] 테스트 작성 커밋 뒤로 tests/가 바뀌지 않았다 |
   | 테스트 | 지금까지 구현한 S번호 테스트와 앞 장 테스트가 통과한다 |
   | 주석 | 바뀐 코드에 새 주석이 없다 |
   | 포맷 | lint의 포맷 맞추기를 돌렸다 |

4. 커밋
   tasks.md의 그 task를 체크하고 코드와 함께 커밋한다.

   ```
   [signup-form] 입력값을 state로 기억하기

   Chapter: signup-form
   Kind: feature
   Task: T2
   Why: 기억한 값이 있어야 가입하기에서 쓸 수 있다
   ```

   - 제목은 [장] 뒤에 task 제목 그대로 쓴다
   - Kind는 기능 장이면 feature, 리팩터 장이면 refactor다
   - Why는 tasks.md의 Why를 그대로 쓴다
   - task에 다른 장 줄이 있으면 Touches: <그 장>을 더한다

5. 다음 task
   체크 안 된 T task가 남아 있으면 1번으로 간다.

## 모든 task가 끝나면

- 모든 장의 테스트를 한 번에 실행한다. 모두 통과해야 한다
- 다음은 projectcode-converge라고 알린다

## projectcode-fix가 부를 때

- Kind는 fix다
- Fixes: <고친 코드를 처음 만든 task 커밋 해시>를 더한다. task의 근거에 적힌 고침 T번호로, git log에서 그 장의 Task 꼬리표를 찾는다
- 사진은 fix가 샌드박스에서 찍는다. 메인 코드는 그 장 시점이 아니다

## project-setup 장일 때

테스트 도구를 설치한 task를 커밋한 뒤, tdd가 미뤄 둔 실패 확인을 한다.
이 장의 테스트가 기능이 없어서 실패하는지 본 뒤 다음 task로 간다.

## 막혔을 때

- 같은 task가 두 번 고쳐도 검사를 통과하지 못하면 멈추고 무엇이 막혔는지 알린다
- 테스트가 틀렸다고 보이면 테스트를 고치지 않고 사용자에게 보여준다
