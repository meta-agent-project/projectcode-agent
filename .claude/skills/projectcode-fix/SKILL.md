---
name: projectcode-fix
description: 완료된 장을 고친다. 그 장을 다시 열고, 메인 코드를 고쳐 Kind fix로 커밋하고, 샌드박스 worktree에서 그 장 시점 코드에 같은 수정을 얹어 사진과 도식을 다시 만들고 patch를 남긴다. "3장 고쳐줘", "앞 장 수정", "projectcode-fix" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-fix

완료된 장을 고친다. 학생은 처음부터 고쳐진 코드를 보게 된다.
메인 코드는 지금 장까지 진행된 코드라서, 그 장 시점의 사진과 도식은 샌드박스에서 다시 만든다.

## 언제

- roadmap에서 상태가 완료인 장을 고칠 때만 쓴다
- 진행 중인 장을 고치는 것은 projectcode-spec의 spec 변경이다
- 지금 장의 기능이 앞 장 파일을 건드리는 것은 fix가 아니다. 그 장의 task에 다른 장 줄을 쓴다

## 순서

1. 다시 열기
   진행 중인 장이 있으면 roadmap에서 멈춤으로 바꾸고 어디까지 했는지 적는다. 예: 멈춤 (T2까지)
   고칠 장을 수정 중으로 바꾼다.

2. 수정 계획
   - 동작이 바뀌면 그 장의 spec.md를 최신으로 고친다. 낡은 글은 지운다
   - plan.md의 고칠 부분을 고친다
   - tasks.md의 도식 아래에 고칠 task를 더한다. 형식은 다른 task와 같고, Why에 고치는 이유를 쓴다
   - 고칠 task마다 처음 그 코드를 만든 task를 근거에 적는다. 예: 근거: S1, 고침 T1
   채팅창에 요약해서 승인을 받는다.

3. 수정 시작 커밋
   roadmap.md와 고친 문서를 커밋한다.
   제목: [장] 수정 시작
   본문: Chapter, Kind: docs

4. 테스트
   동작이 바뀌면 그 장의 테스트를 먼저 고치고 실패를 확인한다.
   제목: [장] 테스트 보강
   본문: Chapter, Kind: test

5. 코드
   projectcode-implement로 고칠 task를 구현한다. Kind는 fix다.
   메인에서는 과정 사진을 찍지 않는다. 메인 코드는 그 장 시점이 아니기 때문이다.
   모든 장의 테스트가 통과해야 한다.

6. 수렴
   projectcode-converge로 이번 fix의 커밋만 검사한다.

7. 샌드박스
   서브에이전트에게 맡긴다. 아래 샌드박스 절대로 한다.

8. 수정 완료
   roadmap에서 고친 장을 완료로, 멈춘 장을 진행 중으로 되돌린다.
   summary-code.md 끝에 고친 task를 더한다. 형식은 projectcode-task와 같다.
   사진, 도식, patch, summary-code.md, roadmap.md를 커밋한다.
   제목: [장] 수정 완료
   본문: Chapter, Kind: docs
   done 태그는 옮기지 않는다.

9. 다음
   projectcode-wiki를 하고, 멈췄던 장이 있으면 그 장의 다음 task부터 이어 가자고 알린다.

## 샌드박스

그 장 시점 코드에 같은 수정을 얹어 사진과 도식을 다시 만든다. 메인 작업 폴더는 건드리지 않는다.

1. 만들기
   임시 폴더에 worktree를 만든다. git worktree add <임시 폴더> done/<장>
   fixes/에 앞서 남긴 patch가 있으면 오래된 것부터 먼저 붙인다.

2. 수정 얹기
   이번 fix 커밋을 순서대로 하나씩 얹는다.
   - 먼저 cherry-pick을 해 본다
   - 충돌이 나면 취소하고, fix 커밋의 바뀐 내용과 Why를 보고 같은 수정을 손으로 한다
   - 하나를 얹을 때마다 그 차이를 메인의 .projectcode/chapters/<장>/fixes/<fix 커밋 해시>.patch로 저장한다
   그 장의 테스트를 실행한다. 모두 통과해야 한다.

3. 과정 사진 다시 찍기
   고친 task 중 가장 앞 task부터 그 장의 마지막 task까지 하나씩 한다.
   - 샌드박스를 그 task 커밋으로 옮기고 fixes/의 patch를 모두 붙인다
   - projectcode-capture를 --task로 부른다. shots.json과 사진은 메인 저장소의 그 장 captures/를 쓴다
   - patch가 붙지 않으면 그 사진을 지우고 shots.json의 그 줄에 "missing": true를 적는다
   그다음 done 태그 지점에 patch를 모두 붙이고 장 끝 사진을 다시 찍는다.

4. 도식 다시 만들기
   done 태그 지점에 patch를 모두 붙인 상태에서 projectcode-diagram을 부른다.
   도식은 메인 저장소의 그 장 diagrams/에 쓴다.

5. 지우기
   git worktree remove로 샌드박스를 지운다.

## 커밋 예시

```
[signup-form] 입력칸에 label 넣기

Chapter: signup-form
Kind: fix
Task: T4
Fixes: 3f2a1bc
Why: 칸 이름이 보이지 않아 학생이 어느 칸인지 헷갈린다
```
