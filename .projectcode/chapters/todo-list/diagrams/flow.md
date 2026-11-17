# todo-list 흐름

```mermaid
flowchart LR
  A["할 일 배열 (todos)"] --> B["줄마다 그리기 (map)"]
  B --> C["li 하나 (key=id)"]
  C --> D[**화면에 목록**]
```
