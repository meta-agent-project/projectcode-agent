# todo-delete 흐름

```mermaid
flowchart LR
  A["삭제 클릭 (handleDelete)"] --> B["id 빼고 거르기 (filter)"]
  B --> C["state 바꾸기 (setTodos)"]
  C --> D[목록에서 사라짐]
```
