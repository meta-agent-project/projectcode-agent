# 시나리오별 구조도

## 할 일 목록 보기

```mermaid
flowchart LR
  A[index.html] --> B[main.jsx]
  B --> C[App]
  C --> D[todos state]
  D --> E[할 일 목록]
```

만든 장: project-setup, todo-list
맡는 파일
- todo-app/index.html
- todo-app/src/main.jsx
- todo-app/src/App.jsx
- todo-app/src/index.css

## 할 일 추가

```mermaid
flowchart LR
  A[입력 칸] --> B[text state]
  B --> C[handleSubmit]
  C --> D[todos state]
  D --> E[할 일 목록]
```

만든 장: todo-add
맡는 파일
- todo-app/src/App.jsx
- todo-app/src/index.css

## 끝난 일 체크

```mermaid
flowchart LR
  A[TodoItem 체크 칸] --> B[handleToggle]
  B --> C[todos state]
  C --> D[done 줄 긋기]
```

만든 장: todo-toggle, todo-components
맡는 파일
- todo-app/src/TodoItem.jsx
- todo-app/src/App.jsx
- todo-app/src/index.css

## 할 일 삭제

```mermaid
flowchart LR
  A[TodoItem 삭제 버튼] --> B[handleDelete]
  B --> C[todos state]
  C --> D[할 일 목록]
```

만든 장: todo-delete, todo-components
맡는 파일
- todo-app/src/TodoItem.jsx
- todo-app/src/App.jsx
- todo-app/src/index.css

## 할 일 수정

```mermaid
flowchart LR
  A[TodoItem 수정 버튼] --> B[editing state]
  B --> C[고치는 칸 draft]
  C --> D[handleEdit]
  D --> E[todos state]
  E --> F[할 일 목록]
```

만든 장: todo-edit
맡는 파일
- todo-app/src/TodoItem.jsx
- todo-app/src/App.jsx
- todo-app/src/index.css
