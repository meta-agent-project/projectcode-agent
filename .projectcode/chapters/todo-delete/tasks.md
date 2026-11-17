# todo-delete 작업

- [x] 테스트 작성
- [x] T1 삭제를 누르면 filter로 지우기
  - 근거: S1
  - 파일: todo-app/src/App.jsx
  - 실행하면: 우유 사기 줄의 삭제를 누르면 우유 사기만 사라지고 두 개가 남는다
  - Why: 지우기도 원래 배열을 고치지 않고 filter로 새 배열을 만든다
  - 다른 장: project-setup, todo-list, todo-add, todo-toggle
- [x] T2 삭제 버튼을 줄 끝으로 보내기
  - 근거: S2
  - 파일: todo-app/src/App.jsx, todo-app/src/index.css
  - 실행하면: 삭제가 줄마다 오른쪽 끝에 흐린 글자로 보인다
  - Why: 버튼이 글자에 붙어 있으면 잘못 누르기 쉽다
  - 다른 장: project-setup, todo-list, todo-add, todo-toggle
- [x] 수렴 점검
- [ ] 캡처
- [ ] 도식
