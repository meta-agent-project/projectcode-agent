---
name: projectcode-init
description: 강의 예제 저장소에 projectcode 기본 구조를 만든다. .projectcode 폴더와 빈 문서, CLAUDE.md 연결, git 저장소를 준비한다. 문서 내용은 채우지 않는다. "projectcode-init", "예제 시작", "프로젝트 초기화" 요청이나 projectcode-flow가 부를 때 사용.
---

# projectcode-init

예제 저장소의 기본 구조를 만든다. 문서 내용은 채우지 않는다.

## 만들 것

| 파일 | 내용 |
|---|---|
| .projectcode/roadmap.md | 빈 파일. interview가 채운다 |
| .projectcode/contract.md | 빈 파일. interview가 채운다 |
| CLAUDE.md | 아래 한 줄 |
| .gitignore | node_modules/ 줄. capture 스킬이 설치하는 도구를 올리지 않는다 |

```
@.claude/projectcode-rules.md
```

chapters/, wiki/, tests/ 폴더는 쓰는 스킬이 그때 만든다.

## 순서

1. 확인
   .claude/projectcode-rules.md가 없으면 멈춘다.
   하네스의 .claude 폴더를 먼저 복사하라고 알린다.

2. git
   git 저장소가 아니면 git init을 한다.

3. 만들기
   이미 있는 파일은 건드리지 않는다. 없는 것만 만든다.
   CLAUDE.md가 있으면 위의 한 줄이 없을 때만 맨 아래에 더한다.
   .gitignore도 같다. node_modules/ 줄이 없을 때만 더한다.

4. 커밋
   제목: [projectcode] 초기화
   본문: Kind: docs

5. 알리기
   만든 것과 건너뛴 것을 목록으로 보여준다.
   roadmap.md가 비어 있으면 "projectcode-interview로 강의 목차를 만들까요?"라고 묻는다.
