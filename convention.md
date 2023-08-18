
# GIT Branch Convention

- Branch 종류
  - main
    - 배포 가능한 상태의 결과물
  - develop
    - 구현한 기능을 병합하기 위한 브랜치
    - 통합 폴더의 기능
  - feature
    - 개별 기능 구현 브랜치
    - 기능 개발 완료 시 삭제
  - 네이밍 규칙
    - 마지막에 본인 이니셜 붙이기
    - feature/기능/이니셜
    - 예) feature/login/HC

# Git Commit Convention

Message

- 개괄
  - 모든 커밋 메시지는 영어와 한글로 작성
- 구조
  - 기본적으로 커밋 메시지는 아래와 같이 제목/본문/꼬리말로 구성

```jsx
type: subject;

body;

footer;
```

- 커밋 타입(Type)
  - new : 새로운 기능 추가
  - mod : 기능 수정
  - error : 버그 수정
  - docs : 문서 내용 변경
  - style : 포맷, 세미클론은 수정 등 코드가 아닌 스타일에 관련된 수정
  - refactor : 리팩토링 코드
  - test : 테스트 코드 추가 및 리팩토링 테스트 등
  - 타입은 소문자로 시작
  - 타입은 항상 대괄호 안에 파트를 입력하여 시작
  - 예시
    - “fix” → “[HW] fix”
- 제목(Subject)

  - 제목은 50자 이내 작성
  - 파일명의 경우에는 파일면 그대로 사용
  - 과거시제를 사용하지 않고 명령어로 작성
  - 예시

    - 본문(Body)
      - 선택사항
      - 부연 설명 필요 시 작성
      - 100자 미만 작성 권장
    - 꼬리말(Footer)
      - 선택사항
      - issue id를 작성할 때 사용
    - 예시

      ```jsx
      [FE] feat : Login DEsign,py

      한글한글한글
      - 영어말고 한글로
      - 선택사항

      Issue id : 486

      ```

# JIRA Convention

- Epic
  - 기능별 대분류 생성
  - 회원관리 / 식물관리 / 디스플레이 화면 구성 / 대화기능 / 음성데이터 처리 / IoT데이터 정리 / 기타 / 프로젝트 설계
- Story
  - 회원에게 제공되는 서비스/기능 목록
  - 네이밍 규칙 - 문장으로 작성
    - 예) 서비스를 이용하고 싶습니다.
  - Story Point 는 0
- Task
  - 해당 스토리에 관련한 상세 구현 사항
  - 네이밍 규칙
    - 파트는 대괄호에 작성
    - 명사로 마무리
    - 예) [BE] 유저 모델 작성
  - Task의 Story point는 4 이하로 작성
  - Sub Task 작성 대신 확인 가능한 Task로 세분화하여 작성

# CODE Convention

- JS

  - Camel Case : 함수는 두 단어 이상
  - 주석은 최대한 자세히
  - tab은 2칸
  - 작성자 기재하기

- Python
  - tab 4칸
  - 한 줄은 최대 79자까지
  - 클래스 명은 카멜케이스(CamelCase)로 작성합니다.
  - 함수명은 소문자로 구성하되 필요하면 밑줄로 나눕니다.

# port

- ChatGPT server : 30002
- backend server : 30001
- DB server : 3306
- display : 3000
- front server : 3001

