# ChatGPT_Server 사용 설명서
- 이 서버의 정확한 용도는 WebSocket 서버입니다
- 프로젝트 내에서 사용하는 웹소켓 관련 기능을 모두 담당하고 있습니다

## 시작하기
### 환경변수
- .env 파일을 루트에 만들어야 합니다.
- .env 파일에 들어가야 하는 환경변수는 이하와 같습니다(빈 값은 상황에 맞게 바꿀 것)
```
PORT = 30002

# 포팅 메뉴얼 참고
DB_HOST = ""
DB_USER = ""
DB_PASSWORD = ""
DB_NAME = "grow"
DB_PORT = 3306

# 포팅 메뉴얼 참고
API_KEY = ""
AWS_REGION = ap-northeast-2
AWS_ACCESS_KEY = ""
AWS_SECRET_KEY = ""
AWS_BUCKET = ""

# 몇번 대화해서 부모의 질문을 실행할건지 결정. 원하는 숫자를 기입하면 됨
RANDOM_MAX = 1
RANDOM_MIN = 1
```


### 설치
이하의 코드로 설치 후 실행합니다
```
npm install
node app
```

## Util 폴더 파일 설명
### aws-s3.js
- AWS S3 서버에 접속하기 위한 기능을 담고 있습니다.

### call-gpt.js
- GPT에 문장을 전달하여 답변을 받습니다.

### db.js
- DB의 커넥션을 만들고, DB를 통해야 하는 모든 작업을 담당합니다

### new-file-name.js
- 라즈베리파이가 보내준 파일을 s3에 저장하기 위한 새 이름을 만들어줍니다

### queue.js
- 큐를 구현하기 위해 사용합니다

### string-purifier.js
- GPT의 답변에서 이모지와 괄호친 내용을 삭제합니다

### winston.js
- 로깅을 위해 사용합니다. 콘솔과 log파일로 출력합니다