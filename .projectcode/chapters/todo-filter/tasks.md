# todo-filter 작업

- [x] 테스트 작성
- [x] T1 고른 조건으로 목록 거르기
  - 근거: S1
  - 파일: todo-app/src/App.jsx
  - 실행하면: 우유 사기를 체크하고 남은 일을 누르면 우유 사기가 빠진 두 줄만 보인다
  - Why: 보여줄 목록은 todos와 filter로 계산되니 state를 하나 더 두지 않는다
  - 다른 장: project-setup, todo-list, todo-add, todo-toggle, todo-delete, todo-components, todo-edit
- [ ] T2 고른 버튼 진하게 보이기
  - 근거: S2
  - 파일: todo-app/src/App.jsx
  - 실행하면: 남은 일을 누르면 남은 일 버튼만 진하게 바뀐다
  - Why: 지금 어떤 목록을 보고 있는지 버튼 모양으로 알려준다
  - 다른 장: project-setup, todo-list, todo-add, todo-toggle, todo-delete, todo-components, todo-edit
- [ ] 수렴 점검
- [ ] 캡처
- [ ] 도식
