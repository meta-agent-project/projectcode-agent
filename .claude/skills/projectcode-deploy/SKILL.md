---
name: projectcode-deploy
description: projectcode-codealong이 만든 따라치기 HTML을 GitHub Pages로 배포한다. 저장소에 Pages 작업 파일을 넣고 Pages를 켠 뒤 푸시해서 주소로 바로 열리게 한다. 한 번 켜 두면 따라치기를 다시 뽑아 푸시할 때마다 사이트도 바뀐다. "따라치기 배포", "github.io에 올려줘", "Pages 배포", "projectcode-deploy" 요청에 사용.
---

# projectcode-deploy

따라치기 HTML은 GitHub에서 열면 코드로 보인다.
학생이 주소로 바로 열 수 있게 GitHub Pages로 내보낸다.

## 사이트

| 주소 | 내용 |
|---|---|
| https://<계정>.github.io/<저장소>/ | 따라치기.html과 같은 첫 화면 |
| .../따라치기.html | 따라치기 |
| .../파일/... | 따라치기의 복사할 파일 |

- .projectcode/code 폴더를 그대로 내보낸다
- Pages는 점으로 시작하는 폴더를 내보내지 않는다. 그래서 GitHub Actions가 사이트 폴더로 복사해 올린다
- 폐쇄망 강의실에서는 열리지 않는다. 그때는 결과 폴더를 그대로 나눠 준다

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
   첫 화면, 따라치기.html, 파일/ 아래 파일 하나를 curl로 열어 200인지 본다.
   한글 파일 이름은 주소에서 퍼센트 인코딩한다.

6. 알리기
   사이트 주소를 알린다.
   다음부터는 따라치기를 다시 뽑아 푸시하면 사이트도 바뀐다고 알린다.

## 언제

- 사용자가 따라치기를 웹으로 보자고 할 때
- 처음 한 번만 한다. 그 뒤는 푸시가 배포다
