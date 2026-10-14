---
name: projectcode-codealong
description: 학생에게 줄 따라치기.md와 합류 지점마다 완성 md(예 그림완성.md)를 만든다. main 이력에서 Kind fix를 원래 단계에 녹인 lecture 브랜치를 쌓고, 그 커밋을 단계마다 diff와 사진으로 뽑는다. 합류 지점 md는 그 장 끝 코드를 파일째 복붙하게 준다. 폐쇄망에서도 MD 폴더만 가져가면 된다. "따라치기 만들어줘", "그림완성 만들어줘", "합류 지점", "lecture 브랜치", "projectcode-codealong" 요청에 사용.
---

# projectcode-codealong

학생은 쳤다가 고치는 코드를 보지 않는다. 처음부터 고친 코드를 친다.
그래서 main 이력을 그대로 읽지 않고, 고침을 녹인 lecture 브랜치를 쌓아 그것을 읽는다.

## 대상

| 대상 | 쓰는 파일 |
|---|---|
| 처음부터 따라 치는 학생 | 따라치기.md 처음부터 |
| 앞 장은 할 줄 알고 뒤를 배우려는 학생 | 합류 지점 완성 md를 복붙하고 따라치기.md의 다음 장부터 |
| 폐쇄망 기업 강의 | 결과 폴더를 통째로 가져간다. 외부 링크와 다운로드가 없다 |

## 파일

```
.projectcode/code/
  따라치기.md        장마다 단계마다 왜, 실행하면, 코드, 사진
  그림완성.md        합류 지점 하나마다 하나. 이름은 roadmap에서 정한다
  images/            쓰인 사진 사본
```

- lecture 브랜치는 강사용이다. 학생에게 주지 않는다
- 학생 코드 폴더만 담는다. contract.md 폴더 표의 학생 코드 폴더다
- 결과 폴더는 매번 처음부터 다시 쓴다

## 합류 지점

roadmap.md에 적는다. 없으면 어느 장 끝을 합류 지점으로 할지와 파일 이름을 묻고 적는다.

```
## 합류 지점
- screens: 그림완성
```

- 여러 개를 둘 수 있다. 강의하는 곳마다 고른다
- 완료된 장만 고를 수 있다

## 고침과 진도

뒤 단계가 앞 단계 코드를 바꾸는 경우는 두 가지다. 커밋 꼬리표로 가른다.

| 종류 | 꼬리표 | lecture에서 |
|---|---|---|
| 고침 | Kind: fix와 Fixes: <대상 커밋> | 대상 단계로 녹인다. fix 단계는 없앤다 |
| 진도 | Kind: feature나 refactor와 Touches | 그 단계에 그대로 둔다. 학생이 바꿔 보는 수업이다 |

- 두 장에 걸친 fix는 둘째 장의 Fixes가 본문에 있다. 커밋 메시지 안의 Fixes: 줄을 모두 읽는다
- 장 안 수렴이 더한 고칠 task(근거가 넘침, 빠짐, 어긋남)는 Kind가 feature라 꼬리표로 가를 수 없다. 목록으로 보여주고 녹일지 사용자에게 묻는다

## 순서

1. 단계 고르기
   main에서 Chapter와 Task 꼬리표가 있고 Kind가 feature나 refactor인 커밋을 이력 순서로 고른다.
   - 학생 코드 폴더를 바꾸지 않는 커밋은 뺀다
   - 완료된 장까지만 담는다. 진행 중이거나 마무리 중인 장은 넣지 않는다
   - Kind fix 커밋마다 Fixes 대상을 모은다. 녹일 구간은 가장 앞 대상 커밋부터 fix 커밋 바로 앞까지다

2. lecture 브랜치 쌓기
   서브에이전트가 임시 worktree에서 한다. 메인 작업 폴더는 건드리지 않는다.
   - 첫 단계 커밋에서 lecture 브랜치를 새로 시작한다. 첫 단계는 시작 키트를 복사한 커밋이다
   - 단계마다 학생 코드 폴더를 main의 그 단계 커밋 상태로 맞춘다
   - 녹일 구간 안의 단계면 그 fix와 같은 수정을 얹는다. 그 장의 fixes/ patch가 붙으면 붙이고, 안 붙으면 손으로 같은 수정을 한다. 사진사가 fix 때 찍은 상태와 같아야 한다
   - 바뀐 것이 없는 단계는 커밋하지 않는다. 녹여서 사라진 단계다
   - 커밋 메시지는 원래 제목에 꼬리표 셋이다

```
[board-save] 글쓰기 입력값을 객체로 기억하기

Chapter: board-save
Task: T1
Source: 5926288 4c0da83
```

   Source는 main의 원래 커밋과 녹인 fix 커밋이다.
   이미 lecture 브랜치가 있으면 새 fix의 가장 앞 대상 단계 바로 전까지는 그대로 두고, 그 뒤만 다시 쌓는다.

3. 확인
   - 장마다 마지막 lecture 커밋의 학생 코드가 done/<장> 태그에 그 장 fixes/ patch를 모두 붙인 것과 같다
   - 가장 마지막 lecture 커밋의 학생 코드가 마지막 완료 장의 끝 코드와 같다
   - 다르면 멈추고 다른 파일을 보여준다

4. 뽑기
   메인 저장소 루트에서 실행한다.
   node .claude/skills/projectcode-codealong/codealong.mjs --branch lecture --out .projectcode/code
   - 따라치기.md: 단계마다 왜, 실행하면은 tasks.md에서, 코드는 lecture 커밋의 diff에서, 사진은 그 task의 shots.json 사진에서 가져온다. 새 파일은 통째로, 고친 파일은 diff, 지운 파일은 지운다 한 줄이다
   - 합류 지점 md: 시작 키트에서 그 장 끝까지 바뀐 파일을 통째로 준다. 지울 것, 설정, components, pages, index.css, main.jsx, App.jsx 순서다. App.jsx는 모든 page를 불러오므로 마지막이다. 끝에 장 끝 사진과 다음에 이어 칠 장을 적는다

5. 점검
   - 합류 지점 md대로 시작 키트에 붙여 넣은 결과가 그 장 끝 lecture 커밋과 같은지 worktree에서 확인한다
   - 따라치기.md에 fix 단계 제목이 남지 않았는지 본다
   - 사진이 빠진 단계를 목록으로 보여준다

6. 커밋
   결과 폴더와 roadmap.md(합류 지점을 새로 적었으면)를 커밋한다.
   제목: [projectcode] 따라치기 갱신
   본문: Kind: docs
   lecture 브랜치는 사용자가 원할 때만 원격에 올린다. 다시 쌓으면 강제 푸시가 된다.

## 언제

- 사용자가 요청할 때
- 장이 완료되거나 fix가 끝난 뒤 따라치기를 새로 뽑고 싶을 때

## 따라치기.md 모양

````
# server-node와 통신하는 React 블로그 라이브코딩 따라치기

## 10 board-save 글쓰기

### 1. 글쓰기 입력값을 객체로 기억하기

왜: 기억한 값이 있어야 글쓰기를 누를 때 서버에 보낼 수 있다
실행하면: 글쓰기 화면에 제목과 내용을 치면 칸에 그대로 남는다

#### src/pages/SaveForm.jsx

```diff
@@ -1,12 +1,24 @@
+import { useState } from "react";
 ...
```

![글쓰기 /save-form](images/board-save-T1-입력값-기억.png)
````
