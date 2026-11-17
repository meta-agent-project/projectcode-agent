# todo-filter 흐름

```mermaid
flowchart LR
  A[버튼 클릭] --> B["고른 조건 (setFilter)"]
  B --> C["걸러 계산 (visibleTodos)"]
  C --> D[목록 그리기]
  B --> E[고른 버튼 진하게]
```
