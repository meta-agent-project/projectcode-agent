---
name: projectcode-capture
description: 사진사(백그라운드 서브에이전트)를 보내 장의 사진과 도식을 만든다. 사진사는 임시 worktree를 task 커밋마다 옮겨 가며 앱을 띄워 과정 사진을 찍고, 장 끝 사진과 도식까지 만든다. 화면은 PNG, API는 요청과 응답 JSON, 콘솔 프로그램은 실행 출력 TXT로 남기고 captures.md를 만든다. 장의 수렴이 끝났을 때, fix 때 다시 찍기, "캡처", "사진 찍어줘", "projectcode-capture" 요청이나 projectcode-flow, projectcode-fix가 부를 때 사용.
---

# projectcode-capture

사진은 사진사가 찍는다. 메인은 사진사를 보내고 다음 장으로 간다.
사진사는 메인 작업 폴더의 코드를 띄우지 않는다. 임시 worktree에서 task 커밋 시점의 코드를 띄운다.
무엇을 찍을지는 shots.json에 적고, 찍는 일은 이 스킬 폴더의 capture.mjs가 한다.
사진은 task마다 정확히 하나, 장 끝에 spec 화면마다 하나다. 장 끝 사진은 마지막 task 사진과 같아도 따로 찍는다.
학생 코드 폴더, 앱 띄우는 법, 포트, 초기화, 연결할 폴더, 사진 종류는 contract.md를 따른다. 이 문서의 react-blog 값은 예시다.

## 사진 종류

contract.md 캡처 절에 적힌 종류만 쓴다.

| 종류 | 남는 파일 | 앱 |
|---|---|---|
| web | 화면 PNG | 미리 띄운다 |
| api | 요청과 응답 JSON | 미리 띄운다 |
| run | 명령의 콘솔 출력 TXT | capture.mjs가 명령을 직접 실행한다 |

새 종류(예 모바일 앱 화면)는 그 예제를 만들 때 capture.mjs에 더한다.

## 파일

```
.projectcode/chapters/<장>/captures/
  shots.json              사진 목록. 장마다 하나
  T1-빈-폼.png            task마다 정확히 하나
  T2-입력값-기억.png
  T3-콘솔-출력.png
  T3-콘솔-출력.console.txt
  T4-가입-API.json
  T5-송금-실행.txt        run 사진
  done-회원가입.png       장 끝. spec 화면마다 하나
  captures.md             capture.mjs가 shots.json으로 만든다
```

- 파일 이름은 task 번호 뒤에 짧은 한국어다. 장 끝 사진은 done으로 시작한다
- 파일 이름에 커밋 해시를 넣지 않는다. 해시는 shots.json의 commit과 captures.md의 커밋 칸에 둔다
- 같은 이름은 덮어쓴다. shots.json에서 뺀 사진은 파일도 지운다

## 메인이 할 일

1. 마지막 코드 커밋 해시를 적어 둔다. 사진사의 done 지점이다. 메인이 다음 장 커밋을 해도 이 지점은 그대로다
2. 메인이 띄운 앱을 끈다. 포트가 하나뿐이다
3. 다른 프로그램이 contract.md의 포트를 쓰고 있으면 사진사를 보내지 않고 사용자에게 끌지 묻는다. 포트가 없는 예제는 건너뛴다
4. roadmap.md에서 장 상태를 마무리 중으로 바꾼다. 커밋은 하지 않는다. [장] 완료 커밋에 들어간다
5. 사진사를 백그라운드 서브에이전트로 보낸다. 넘길 것은 장 ID, done 지점 해시, 이 문서 경로다
6. 기다리지 않는다. flow의 다음 차례로 간다

## 사진사의 순서

1. 준비
   node --version으로 Node가 있는지 본다. 없으면 멈추고 메인에 돌려준다.
   web 사진이 있고 이 스킬 폴더에 node_modules가 없으면 npm install과 npx playwright install chromium을 한다.
   web 사진이 없으면 설치하지 않는다.

2. shots.json 쓰기
   tasks.md의 T task마다 사진 하나를 적는다. 이미 있으면 그대로 쓴다.
   - see에는 그 task의 실행하면 줄을 보이는 것으로 쓴다
   - 장 끝 사진은 task를 done으로 둔다. spec 화면 그림마다 하나다
   - 화면이 없는 장은 request로 요청과 응답 JSON을 남긴다
   - 콘솔 프로그램은 run으로 명령과 입력을 적는다. 명령은 contract.md 캡처 절의 run 줄이다
   - commit에 그 사진을 찍을 커밋 해시를 적는다. task 사진은 git log --grep "Chapter: <장>" --grep "Task: T2" --all-match로 찾고, done 사진은 받은 done 지점이다
   - 같은 task 커밋이 둘 이상이면 가장 마지막 것을 쓴다

3. worktree 만들기
   메인 저장소 밖 임시 폴더에 만든다. git worktree add --detach <임시 폴더> <첫 사진의 커밋>
   worktree에는 git에 없는 폴더가 없다. contract.md 실행 절의 연결 줄에 적힌 폴더를 메인에서 이어 붙인다. 연결 줄이 없으면 건너뛴다.
   - Windows: cmd //c mklink /J <임시 폴더>\react-blog\node_modules <메인>\react-blog\node_modules
   - macOS, Linux: ln -s <메인>/react-blog/node_modules <임시 폴더>/react-blog/node_modules

4. 사진마다 찍기
   shots.json 순서대로 한다.
   - worktree를 그 사진의 commit으로 옮긴다. git -C <임시 폴더> checkout --detach <commit>
   - contract.md 실행 절의 초기화 줄을 한다. 사진이 남긴 데이터가 다음 사진에 섞이지 않게 한다. 예: db.json 지우기
   - web, api 사진이면 contract.md 실행 절대로 앱을 worktree에서 새로 띄운다. run 사진은 띄우지 않는다
   - worktree 루트에서 찍는다. node <메인>/.claude/skills/projectcode-capture/capture.mjs <메인>/.projectcode/chapters/<장>/captures/shots.json --task T2
   - 사진을 직접 열어 see에 적은 것이 보이는지 확인한다. 보이지 않으면 그 사진과 이유를 적어 둔다
   - 띄운 앱을 끈다

5. 도식
   worktree를 done 지점으로 옮기고 그 폴더에서 projectcode-diagram을 한다.
   도식은 메인 저장소의 그 장 diagrams/에 쓴다. worktree에는 git에 없는 파일이 없어서 구조도가 깨끗하다.

6. 마무리
   - 메인 저장소 tasks.md의 캡처와 도식을 체크한다. 커밋은 하지 않는다
   - worktree를 지운다. 붙인 연결만 먼저 지운다. 메인의 폴더를 지우지 않게 rmdir나 unlink로 연결만 끊는다
   - git worktree remove <임시 폴더>
   - 메인에 돌려준다. 찍은 사진 목록, see와 다른 사진과 이유, 도식 파일

## fix 때

projectcode-fix의 샌드박스가 이 순서를 쓴다. 다른 점은 둘이다.
- commit으로 옮긴 뒤 그 장의 fixes/ patch를 모두 붙이고 찍는다. commit에는 "9c3aa14 + fixes"처럼 적는다
- patch가 붙지 않으면 그 사진을 지우고 shots.json의 그 줄에 "missing": true를 적는다

## shots.json 형식

```
{
  "chapter": "signup-form",
  "web": "http://localhost:5173",
  "api": "http://localhost:3000",
  "shots": [
    { "file": "T2-입력값-기억.png", "task": "T2", "commit": "3f2a1bc", "screen": "회원가입 폼",
      "see": "아이디 칸에 kim이 입력돼 있다",
      "steps": [ { "fill": ["아이디", "kim"] } ] },
    { "file": "T3-콘솔-출력.png", "task": "T3", "commit": "8c1d2e4", "screen": "회원가입 폼",
      "see": "콘솔에 kim 1234가 찍힌다", "console": true,
      "steps": [ { "fill": ["아이디", "kim"] }, { "fill": ["비밀번호", "1234"] }, { "click": "가입하기" } ] },
    { "file": "T1-가입-API.json", "task": "T1", "commit": "a1b2c3d", "screen": "POST /api/signup", "see": "ok가 true다",
      "request": { "method": "POST", "path": "/api/signup", "body": { "id": "kim", "password": "1234" } } }
  ]
}
```

콘솔 프로그램은 command와 cwd를 맨 위에 적고 사진마다 run을 쓴다.

```
{
  "chapter": "console-adapter",
  "command": "build.cmd && java -cp out;lib/* Main",
  "cwd": "app",
  "shots": [
    { "file": "T2-송금-실행.txt", "task": "T2", "commit": "5d1e9a0", "screen": "송금 메뉴",
      "see": "잔액 900원이 찍힌다",
      "run": { "input": "1\n100\nq\n" } }
  ]
}
```

| 칸 | 뜻 |
|---|---|
| file | 저장할 파일 이름 |
| task | T번호 또는 done |
| commit | 그 사진을 찍은 코드의 커밋 해시. captures.md의 커밋 칸이 된다 |
| screen | 찍은 화면 |
| see | 보이는 것. 확인 기준이자 captures.md의 칸이다 |
| path | 화면 주소. 없으면 / |
| steps | 찍기 전에 할 일. fill은 [라벨 또는 placeholder, 값], click은 버튼 글자, reload는 true면 새로고침, goto는 옮겨 갈 화면 주소 |
| console | true면 콘솔 기록과 Uncaught 에러를 .console.txt로 남긴다 |
| storage | true면 찍을 때의 localStorage를 .storage.json으로 남긴다 |
| requests | true면 서버로 간 요청의 주소, 토큰, 보낸 값, 응답 상태를 .requests.json으로 남긴다 |
| hold | 받는 중인 화면을 찍는다. steps 뒤 api 응답을 붙잡은 채 path로 가서 찍는다. 예: { "path": "/", "api": "/?page=0" } |
| request | 화면 대신 API를 부른다. method, path, body |
| command, cwd | run 사진이 실행할 명령과 폴더. cwd는 worktree 루트에서 본 경로다 |
| run | 명령을 실행해 출력을 .txt로 남긴다. input은 표준 입력, command와 cwd를 사진마다 바꿀 수도 있다 |
| missing | fix 뒤 다시 찍지 못한 사진. 찍지 않고 captures.md에 그렇게 적는다 |
