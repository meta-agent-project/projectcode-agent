---
name: projectcode-capture
description: 받은 폴더에서 앱을 실행해 장의 사진을 찍기만 한다. 화면은 PNG, API는 요청과 응답 JSON으로 남기고 captures.md를 만든다. task마다 과정 사진, 장 끝 사진, fix 때 다시 찍기에 쓴다. "캡처", "사진 찍어줘", "projectcode-capture" 요청이나 projectcode-implement, projectcode-flow, projectcode-fix가 부를 때 사용.
---

# projectcode-capture

받은 폴더에서 앱을 실행하고 찍는다. 그 폴더가 메인인지 샌드박스인지는 상관하지 않는다.
무엇을 찍을지는 shots.json에 적고, 찍는 일은 이 스킬 폴더의 capture.mjs가 한다.
사진은 task마다 정확히 하나, 장 끝에 spec 화면마다 하나다. 장 끝 사진은 마지막 task 사진과 같아도 따로 찍는다. shots.json은 그 목록이고 장마다 하나다.

## 받는 것

| 받는 것 | 예 |
|---|---|
| 폴더 | 예제 저장소, 또는 fix의 샌드박스 worktree |
| 장 | signup-form |
| 범위 | --task T2, --from T2, 없으면 전부 |

## 파일

```
.projectcode/chapters/<장>/captures/
  shots.json              사진 목록. 장마다 하나
  T1-빈-폼.png            task마다 정확히 하나
  T2-입력값-기억.png
  T3-콘솔-출력.png
  T3-콘솔-출력.console.txt
  T4-가입-API.json
  done-회원가입.png       장 끝. spec 화면마다 하나
  captures.md             capture.mjs가 shots.json으로 만든다
```

- 파일 이름은 task 번호 뒤에 짧은 한국어다. 장 끝 사진은 done으로 시작한다
- 같은 이름은 덮어쓴다. shots.json에서 뺀 사진은 파일도 지운다

## 순서

1. 준비
   node --version으로 Node가 있는지 본다.
   없으면 멈추고 알린다. OS에 맞는 설치 명령을 보여주고, 사용자가 허락하면 실행한다.
   - Windows: winget install OpenJS.NodeJS.LTS
   - macOS: brew install node
   이 스킬 폴더에 node_modules가 없으면 npm install과 npx playwright install chromium을 한다.
   이 둘은 스킬 폴더 안에만 깔리므로 묻지 않는다.
   예제 저장소에 playwright가 있으면 그것을 먼저 쓴다.

2. shots.json 고치기
   찍을 사진을 shots.json에 더한다. 이미 있으면 그대로 쓴다.
   - 과정 사진: tasks.md의 그 task의 실행하면 줄을 보이는 것에 쓴다
   - 장 끝 사진: task는 done, spec 화면 그림마다 하나
   - 화면이 없는 장: request로 요청과 응답 JSON을 남긴다
   - 콘솔에 찍히는 것이 보여야 하면 console을 true로 둔다

3. 앱 실행
   contract.md의 실행 명령으로 받은 폴더에서 앱을 띄운다. 주소가 열릴 때까지 기다린다.

4. 찍기
   받은 폴더에서 실행한다.
   node .claude/skills/projectcode-capture/capture.mjs .projectcode/chapters/<장>/captures/shots.json --task T2

5. 확인
   찍은 사진을 직접 열어 본다. 보이는 것에 적은 것이 정말 보이는지 확인한다.
   보이지 않으면 찍은 사진과 이유를 부른 스킬에 돌려준다.

6. 앱 끄기
   3번에서 띄운 앱을 끈다.

## shots.json 형식

```
{
  "chapter": "signup-form",
  "web": "http://localhost:5173",
  "api": "http://localhost:3000",
  "shots": [
    { "file": "T2-입력값-기억.png", "task": "T2", "screen": "회원가입 폼",
      "see": "아이디 칸에 kim이 입력돼 있다",
      "steps": [ { "fill": ["아이디", "kim"] } ] },
    { "file": "T3-콘솔-출력.png", "task": "T3", "screen": "회원가입 폼",
      "see": "콘솔에 kim 1234가 찍힌다", "console": true,
      "steps": [ { "fill": ["아이디", "kim"] }, { "fill": ["비밀번호", "1234"] }, { "click": "가입하기" } ] },
    { "file": "T1-가입-API.json", "task": "T1", "screen": "POST /api/signup", "see": "ok가 true다",
      "request": { "method": "POST", "path": "/api/signup", "body": { "id": "kim", "password": "1234" } } }
  ]
}
```

| 칸 | 뜻 |
|---|---|
| file | 저장할 파일 이름 |
| task | T번호 또는 done |
| screen | 찍은 화면 |
| see | 보이는 것. 확인 기준이자 captures.md의 칸이다 |
| path | 화면 주소. 없으면 / |
| steps | 찍기 전에 할 일. fill은 [라벨, 값], click은 버튼 글자 |
| console | true면 콘솔 기록을 .console.txt로 남긴다 |
| request | 화면 대신 API를 부른다. method, path, body |
