---
name: projectcode-flow
description: projectcode 하네스의 시작점. 지금 어디까지 했는지 파일과 git으로 알아내고 다음 스킬을 실행한다. 처음 시작, 중간부터 이어 가기, 앞 장 고치기를 모두 여기서 시작한다. "시작하자", "이어서 하자", "다음 뭐 해", "어디까지 했지", "projectcode-flow" 요청에 사용.
---

# projectcode-flow

지금 무엇을 할 차례인지 알아내고 그 스킬을 실행한다. 끝나면 다시 알아내고 이어 간다.
flow는 파일을 고치지 않는다. 고치는 일은 실행한 스킬이 한다.

## 차례 알아내기

위에서부터 처음 맞는 줄이 다음 차례다.

| 상태 | 다음 |
|---|---|
| .projectcode/가 없다 | init |
| roadmap.md가 비었다 | interview |
| 사용자가 완료된 장을 고치자고 한다 | fix |
| 수정 중인 장이 있다 | fix를 이어서 |
| 진행 중인 장이 있다 | 아래 장 안의 차례 |
| 멈춘 장만 있다 | 그 장을 진행 중으로 되돌리고 장 안의 차례 |
| 대기인 장이 있다 | 첫 대기 장의 spec |
| 모든 장이 완료다 | 끝. 장을 더하려면 interview |

## 장 안의 차례

진행 중인 장의 폴더 .projectcode/chapters/<장>/를 본다. 위에서부터 처음 맞는 줄이 다음 차례다.

| 상태 | 다음 |
|---|---|
| spec.md가 없다 | spec |
| spec에 화면 절이 있는데 mockup.html이 없다 | mockup |
| plan.md가 없다 | plan |
| tasks.md가 없거나 [장] 시작 커밋이 없다 | task (만들 때) |
| 테스트 작성이 체크 안 됐다 | tdd |
| 체크 안 된 T task가 있다 | implement |
| 수렴 점검이 체크 안 됐다 | converge |
| 캡처가 체크 안 됐다 | capture (장 끝 사진) |
| 도식이 체크 안 됐다 | diagram |
| 모두 체크됐는데 상태가 진행 중이다 | task (끝낼 때) |
| [장] 완료 뒤에 wiki 갱신 커밋이 없다 | wiki |

파일이 있다는 것은 승인을 받았다는 뜻이다. spec, mockup, plan, tasks는 승인 뒤에만 저장한다.

## 순서

1. 알아내기
   roadmap.md, 장 폴더, tasks.md, git log와 git tag를 읽고 위 표로 다음 차례를 정한다.

2. 보여주고 묻기
   아래 형식으로 보여주고 "바로 시작할까요?"라고 묻는다.

3. 이어 가기
   좋다고 하면 그 스킬을 실행한다. 끝나면 1번으로 돌아간다.
   task 승인 뒤부터 wiki까지는 묻지 않고 이어 간다. 스킬 안의 질문은 그 스킬이 묻는다.

4. 멈추기
   아래 때 멈추고 알린다.
   - 사용자가 멈추라고 할 때
   - 장 하나가 완료됐을 때. summary-code.md를 요약해 보여주고 검수를 받은 뒤 다음 장을 시작할지 묻는다
   - 스킬이 막혔다고 돌려줄 때. 막힌 이유를 보여주고 사람이 정하게 한다
   - 모든 장이 완료됐을 때

## 보여주는 형식

```
진행 상황
- 1 project-setup 프로젝트 뼈대: 완료
- 2 signup-form 회원가입 폼: 진행 중 (T2까지)
- 3 signup-api 회원가입 API: 대기

다음 차례
signup-form의 projectcode-implement (T3 가입하기를 누르면 콘솔에 보여주기)

바로 시작할까요?
```

파일과 상태가 맞지 않을 때

```
확인이 필요합니다
- signup-form: 상태는 완료인데 done/signup-form 태그가 없습니다

다음 차례
projectcode-wiki로 점검 결과를 보고 어떻게 할지 정합니다
```
