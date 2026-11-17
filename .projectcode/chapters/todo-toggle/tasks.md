# todo-toggle 작업

- [x] 테스트 작성
- [x] T1 체크 칸으로 끝난 일 바꾸기
  - 근거: S1
  - 파일: todo-app/src/App.jsx
  - 실행하면: 우유 사기의 체크 칸을 누르면 체크되고, 다시 누르면 풀린다
  - Why: 배열 state는 고치지 않고 map으로 새 배열을 만들어야 화면이 다시 그려진다
  - 다른 장: project-setup, todo-list, todo-add
- [ ] T2 끝난 일은 줄 그어 보이기
  - 근거: S2
  - 파일: todo-app/src/App.jsx, todo-app/src/index.css
  - 실행하면: 체크한 우유 사기에 줄이 그어지고 흐린 글자가 된다
  - Why: state 값에 따라 class를 바꾸면 모양도 데이터를 따라간다
  - 다른 장: project-setup, todo-list, todo-add
- [ ] 수렴 점검
- [ ] 캡처
- [ ] 도식
