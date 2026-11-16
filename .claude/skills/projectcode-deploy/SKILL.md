---
name: projectcode-deploy
description: projectcode-codealong이 만든 따라치기와 projectcode-wiki가 만든 wiki를 GitHub Pages로 배포한다. wiki md 7개는 처음 보는 사람도 위에서 아래로 읽히는 문서 한 장으로 묶는다. 저장소에 Pages 작업 파일을 넣고 Pages를 켠 뒤 푸시한다. 한 번 켜 두면 푸시할 때마다 사이트도 바뀐다. "따라치기 배포", "wiki 배포", "github.io에 올려줘", "Pages 배포", "projectcode-deploy" 요청에 사용.
---

# projectcode-deploy

따라치기 HTML과 wiki md는 GitHub에서 열면 코드로 보인다.
학생과 처음 보는 사람이 주소로 바로 열 수 있게 GitHub Pages로 내보낸다.

## 사이트

| 주소 | 내용 | 만드는 곳 |
|---|---|---|
| https://<계정>.github.io/<저장소>/ | 첫 화면. 따라치기와 wiki로 가는 카드 | site.mjs |
| .../따라치기.html | 따라치기 | .projectcode/code 그대로 |
| .../wiki.html | wiki 한 장 | wiki.mjs |
| .../파일/... | 따라치기의 복사할 파일 | .projectcode/code 그대로 |
| .../files/... | wiki가 보여 주는 장 사진 | wiki.mjs |

- 작업 파일이 GitHub Actions에서 site.mjs를 돌려 사이트 폴더를 만든다. Pages는 점으로 시작하는 폴더를 내보내지 않아서다
- 폐쇄망 강의실에서는 열리지 않는다. 그때는 따라치기 결과 폴더를 그대로 나눠 준다

## wiki 한 장

wiki.mjs가 roadmap.md, wiki/*.md, 장 captures를 읽어 쓴다.
처음 보는 사람이 위에서 아래로 읽으면 강의가 잡히는 순서다.

| 차례 | 내용 | 원본 |
|---|---|---|
| 머리 | 강의 이름, 목표, 대상, 결과물, 숫자(장, task, 사진, 테스트) | roadmap, overview, check |
| 시작하기 전에 | 선수 지식, 학습 목표, 진행 방식 | roadmap |
| 장 지도 | 장마다 종류, 문제, 배울 것. 누르면 장 끝 실행 결과 | roadmap 장 표, overview, 장 captures.md의 done |
| 개념 | 배울 것마다 처음 나온 장 | concepts |
| 요청 흐름 | 시나리오 탭과 흐름 그림, 만든 장 | scenarios |
| 실행 화면 | 화면마다 지금 모습, 장을 고르면 그 장 모습 | screens |
| 코드와 데이터 | 폴더 구조, ERD | tree, erd |
| 점검과 범위 | 점검 결과, 고칠 것, 미룬 것, 하지 않는 것 | check, roadmap |

- 모양은 검정 펜이다. 흰 바탕, 검정 선, 오프셋 그림자
- 콘솔 사진은 터미널 모양으로 보여 준다. $ 명령 줄은 빼고, 친 값을 프롬프트 자리에 키 모양으로 끼워 넣는다
- 그림은 가로 스크롤 없이 그린다. 넓으면 줄이고, 너무 작아지면 세로로 다시 그린다
- wiki가 없으면 wiki.html과 그 카드를 만들지 않는다
- 바꾼 뒤에는 node .claude/skills/projectcode-deploy/site.mjs <임시 폴더>로 만들어 브라우저로 본다. 1280px과 375px에서 가로 스크롤이 없는지, 그림이 그려졌는지 본다

## 준비

| 무엇 | 확인 |
|---|---|
| 원격 저장소 | git remote -v에 github.com 주소가 있다. 없으면 사용자에게 만들지 묻는다 |
| 따라치기 | .projectcode/code/따라치기.html이 커밋돼 있다. 없으면 projectcode-codealong을 먼저 한다 |
| gh 로그인 | gh auth status에 repo와 workflow 권한이 있다 |
| 공개 여부 | 무료 계정과 조직은 공개 저장소만 Pages를 쓴다 |

- gh가 없으면 설치한다. Windows는 winget install --id GitHub.cli -e
- 로그인과 권한 추가는 브라우저 승인이라 사용자가 한다. 아래 명령을 프롬프트에 ! 를 붙여 치라고 알린다
  gh auth login --web --git-protocol https
  gh auth refresh -h github.com -s workflow
- workflow 권한이 없으면 작업 파일이 든 푸시를 GitHub가 거절한다

## 순서

1. 작업 파일 넣기
   이 스킬 폴더의 pages.yml을 .github/workflows/pages.yml로 복사한다.
   branches의 main을 저장소 기본 브랜치 이름으로 바꾼다.

2. Pages 켜기
   gh api -X POST repos/<계정>/<저장소>/pages -f build_type=workflow
   이미 켜져 있으면 gh api -X PUT 같은 주소로 build_type만 workflow로 바꾼다.

3. 커밋과 푸시
   제목: [projectcode] 따라치기 웹 배포
   본문: Kind: docs
   작업 파일만 커밋하고 기본 브랜치를 푸시한다.

4. 기다리기
   gh run list -L 1로 실행 번호를 찾고 gh run watch <번호> --exit-status로 끝까지 본다.
   실패하면 gh run view <번호> --log-failed로 이유를 보여 준다.

5. 확인
   첫 화면, 따라치기.html, wiki.html, 파일/ 아래 파일 하나를 curl로 열어 200인지 본다.
   한글 파일 이름은 주소에서 퍼센트 인코딩한다.

6. 알리기
   사이트 주소를 알린다.
   다음부터는 따라치기나 wiki를 다시 만들어 푸시하면 사이트도 바뀐다고 알린다.

## 언제

- 사용자가 따라치기나 wiki를 웹으로 보자고 할 때
- 처음 한 번만 한다. 그 뒤는 푸시가 배포다
