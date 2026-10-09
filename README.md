**projectcode 하네스**

강의용 예제 코드를 만드는 Claude Code 하네스다.
프로덕션 코드가 아니라, 장마다 그 장에서 배울 것만 담은 읽기 쉬운 코드를 만든다.
코드와 함께 원고와 책의 재료인 커밋 꼬리표, 계획, 사진, 도식을 남긴다.

원본은 일반 개발 하네스 metakit-sdd-harness다.


**필요한 것**

| 무엇 | 왜 |
|---|---|
| Claude Code | 하네스를 실행한다 |
| git | 장과 task를 커밋으로 남긴다 |
| Node | 사진과 폴더 구조도를 만드는 엔진을 돌린다. 예제 언어와 상관없이 필요하다 |

Node가 없으면 capture 스킬이 설치 명령을 보여주고 허락을 받아 설치한다.


**시작하기**

먼저 예제 폴더를 만든다. 예를 들면 projectlab/examples/signup-lab 같은 폴더다.
그다음 이 하네스의 .claude 폴더를 예제 폴더에 복사한다.
마지막으로 예제 폴더에서 Claude Code를 열고 /projectcode-flow를 실행한다.

flow가 지금 할 차례를 알아내서 init, interview부터 차례로 진행한다.
중간에 멈췄다가 다시 시작할 때도 /projectcode-flow만 실행하면 된다.


**흐름**

처음 한 번은 init과 interview를 한다. interview에서 강의 목차인 roadmap과 기술과 실행 방법인 contract를 정한다.
그 뒤로는 장마다 아래 순서로 진행한다.

| 순서 | 스킬 | 하는 일 | 사람이 할 일 |
|---|---|---|---|
| 첫째 | spec | 할 일, 글자로 그린 화면, 흐름, 범위 질문 | 승인 |
| 둘째 | mockup | 새 화면이 있는 장만. 시안 2개 중 하나 고르기 | 선택 |
| 셋째 | plan | 코드 상세 계획과 핵심 코드 | 승인 |
| 넷째 | task | 작업 순서. task 하나가 커밋 하나 | 승인 |
| 다섯째 | tdd | 할 일마다 행동 테스트를 코드보다 먼저 | |
| 여섯째 | implement | task 하나씩 코드, 검사, 과정 사진, 커밋 | |
| 일곱째 | converge | 빠짐, 어긋남, 넘침, 순서 어긋남 점검 | 넘침이 나오면 답하기 |
| 여덟째 | capture | 장 끝 사진 | |
| 아홉째 | diagram | 흐름, ERD, 폴더 구조도 | |
| 열째 | task | 장 완료 커밋과 done 태그 | 장 마무리 확인 |
| 열한째 | wiki | 프로젝트 전체 보기 | |

앞 장을 고칠 때는 fix를 쓴다. 메인 코드를 고치고, 샌드박스에서 그 장 시점의 사진과 도식을 다시 만들고, patch를 남긴다.

사람이 멈추는 곳은 spec, mockup, plan, task의 승인과 장이 끝났을 때다.
그사이는 이어서 진행하고, 넘침이 나오면 멈추고 묻는다.


**스킬 설명**

| 스킬 | 언제 쓰나 | 하는 일 | 남기는 것 |
|---|---|---|---|
| projectcode-flow | 시작할 때, 이어 갈 때, 다음 할 일이 궁금할 때 | 하네스의 시작점이다. 파일과 git을 보고 지금 어디까지 했는지 알아낸 뒤 다음 스킬을 실행한다. 처음 시작, 중간부터 이어 가기, 앞 장 고치기를 모두 여기서 시작한다 | 없음. 다른 스킬을 부른다 |
| projectcode-init | 예제 저장소를 처음 만들 때 | .projectcode 폴더와 빈 문서를 만들고, CLAUDE.md에 공통 규칙을 연결하고, git 저장소를 준비한다. 문서 내용은 채우지 않는다 | .projectcode 기본 구조, CLAUDE.md |
| projectcode-interview | 강의 목차를 정하거나 장을 더하거나 순서를 바꿀 때 | 질문으로 강의 목적, 선수 지식, 학습 목표, 장 나누기를 정한다 | roadmap.md 강의 목차, contract.md 기술과 실행 및 캡처 방법 |
| projectcode-spec | 새 장을 시작할 때, 진행 중인 장의 범위를 바꿀 때 | 사람이 읽는 할 일 목록, 글자로 그린 화면, 흐름을 쓴다. 새 개념을 기준으로 이 장에 넣을지, 미룰지, 안 만들지 범위를 묻고 승인을 받는다 | spec.md |
| projectcode-mockup | 새 화면이 있는 장에서 만들기 전에 | 정해진 색, 글꼴, 크기, 간격만 쓰는 모노톤 공통 CSS로 배치와 크기 선택이 다른 HTML 시안 2개를 보여주고 하나를 고르게 한다 | mockup.html |
| projectcode-plan | spec이 승인된 뒤 | 어떤 파일에 어떤 코드를 쓸지, 할 일과 파일의 연결, 쓸 라이브러리, 건드리는 다른 장 파일을 정하고 채팅창에 요약해 승인을 받는다 | plan.md |
| projectcode-task | plan이 승인된 뒤, 그리고 장을 마무리할 때 | 승인된 plan으로 체크박스 작업 순서를 만들고 장 시작 커밋을 한다. 장 끝에는 모든 체크를 확인하고 장 완료 커밋, roadmap 완료 표시, done 태그를 한다 | tasks.md, 시작 커밋, 완료 커밋, done 태그 |
| projectcode-tdd | 장의 코드를 쓰기 전에 | spec 할 일마다 행동 테스트를 하나씩 쓰고, 모두 실패하는지 확인한 뒤 테스트 작성 커밋을 한다. 테스트는 동작을 확인하고 바깥 서버 데이터에 기대지 않는다 | tests 폴더의 장별 테스트 |
| projectcode-implement | 테스트가 준비된 뒤 | tasks.md 순서대로 task 하나씩 코드를 쓰고, 커밋 전에 파일, 라이브러리, 동작, 테스트를 검사한 뒤 꼬리표를 붙여 커밋한다. task마다 과정 사진도 찍는다 | 학생 코드, task 커밋, 과정 사진 |
| projectcode-converge | 장의 구현이 끝난 뒤 | 코드를 spec, plan, tasks와 비교해 빠짐, 어긋남, 넘침, 순서 어긋남을 찾는다. 찾은 것은 사용자에게 묻고 고칠 task로 더한다 | tasks.md에 더한 task |
| projectcode-capture | task마다, 장 끝에, fix 때 | 받은 폴더에서 앱을 실행해 사진만 찍는다. 화면은 PNG, API는 요청과 응답 JSON으로 남긴다. 엔진은 capture.mjs다 | captures 폴더, captures.md |
| projectcode-diagram | 장 끝에, fix 때 | 받은 폴더의 코드를 읽어 그 장 시점의 도식을 만든다. 흐름은 Mermaid, 데이터가 있는 장은 ERD, 폴더 구조도는 엔진 tree.mjs로 만든다 | diagrams 폴더 |
| projectcode-fix | 이미 완료된 장을 고칠 때 | 그 장을 다시 열고, 메인 코드를 고쳐 Kind fix로 커밋한다. 샌드박스 worktree에서 그 장 시점 코드에 같은 수정을 얹어 사진과 도식을 다시 만들고 patch를 남긴다 | fix 커밋, fixes 폴더의 patch, 다시 찍은 사진과 도식 |
| projectcode-wiki | 장이 완료되거나 fix가 끝날 때 | 프로젝트 전체를 한눈에 보는 읽기 전용 문서를 다시 만든다. 장 목록과 진행, 개념이 나온 장, 화면 모음, 최신 ERD와 폴더 구조, 문서와 코드가 서로 맞는지 점검한 결과를 쓴다. 원본은 고치지 않는다 | wiki 폴더 |

공통 규칙은 .claude/projectcode-rules.md에 있다. init이 CLAUDE.md에 연결해서 모든 세션이 읽는다.


**예제 저장소에 남는 것**

| 위치 | 내용 |
|---|---|
| .projectcode/roadmap.md | 목차와 장 상태 |
| .projectcode/contract.md | 기술, 실행 방법, 테스트 방법, 캡처 방법 |
| .projectcode/chapters/장 ID/ | spec, mockup, plan, tasks, captures, diagrams, fixes |
| .projectcode/wiki/ | 프로젝트 전체 보기 |
| tests/장 ID/ | 행동 테스트 |
| 나머지 | 학생 코드 |

커밋 제목은 대괄호로 감싼 장 ID 뒤에 짧은 한국어로 쓴다. 본문 꼬리표인 Chapter, Kind, Task, Why, Touches, Fixes가 원고의 단서가 된다.
자세한 것은 규칙 파일에 있다.
