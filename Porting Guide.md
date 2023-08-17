# Porting Guide
## DB
- 사용 프로그램: MariaDB
### grow_dump.sql 실행하기
#### 방법 1: mysql WorkBench 사용하기
1. mysql WorkBench 홈에서 "MySQL Connections"옆의 + 아이콘을 누른다.
2. 적당한 Connection Name을 지어주고(예: MariaDB), Hostname, Port, Username을 쓴다. 만약 mariadb를 깐 뒤 별도의 처리를 하지 않았다면 기본 값들로 진행해도 좋다.
3. (선택사항) Password의 Store in vault를 눌러 저장해두면, 해당 DB를 사용할때마다 비밀번호를 입력하지 않아도 좋다
4. OK를 눌러 완성하고 나면, 이제 WorkBench에서 SQL 파일을 열어서 전체 실행을 한다.

#### 방법 2: CLI 사용하기
1. mariaDB가 설치된 폴더 안의 bin 폴더를 들어간다.
2. 탐색기 주소창에 cmd을 친다
3. `mysql -h [호스트] -u [유저명] -p`을 친다.
4. 비밀 번호를 친다.
5. `source [실행할 SQL 파일의 절대 경로];`를 친다.

## 도커

## AWS EC2

## 젠킨스

## nginx

## ChatGPT_Server
### .env 파일
- 이름이 말 그대로 ".env"인 파일(".gitignore"와 비슷한 경우)
- 프로젝트에서 사용한 환경 변수들이 들어있음
#### 포함되어야 하는 요소들
- API_KEY= 하단의 ChatGPT 참고
- PORT = 30002
- DB_HOST = 앞에서 설정한 호스트(예: "localhost", "127.0.0.1")
- DB_USER = 앞에서 설정한 유저명(예: "root")
- DB_PASSWORD = mariaDB 설치시에 설정한 해당 유저의 비밀번호
- DB_NAME = "grow"
- DB_PORT = DB가 사용하는 포트. 기본값은 3306
- RANDOM_MAX = 부모님의 질문이 붙을 대화 수의 최댓값. 숫자를 쓸 것
- RANDOM_MIN = 부모님의 질문이 붙을 대화 수의 최솟값. 숫자를 쓸 것
- AWS_REGION = 하단의 AWS S3 참고
- AWS_ACCESS_KEY = 하단의 AWS S3 참고
- AWS_SECRET_KEY = 하단의 AWS S3 참고
- AWS_BUCKET = 하단의 AWS S3 참고

### ChatGPT
1. OpenAI에 가입한다.(구글 로그인 같은 외부 아이디 사용도 가능)
2. 링크(https://platform.openai.com/account/billing/payment-methods)로 이동하여 Add Payment Method를 눌러 진행한다. 해외 결제가 가능한 카드가 필요하다.
3. 결제수단 등록이 완료 되었다면, API Keys로 들어간다. (https://platform.openai.com/account/api-keys)
4. Create new secret key를 눌러 새 키를 발급받는다. 생성된 API키는 생성 이후엔 절대 다시 조회할 수 없으니, 키를 잊어버렸다면 기존 키를 삭제하고 새로 발급 받아야 한다.
5. 생성된 API키를 .env 파일에 아래와 같은 형식으로 추가한다.
```
API_KEY = "sk-..."
```

### 실행방법
1. ChatGPT_Server 폴더로 들어간다.
2. npm install을 터미널에 친다(첫 실행시에만 하면 됨)
3. node app.js로 실행시킨다.

## BackEnd_Server
### .env 파일
- ChatGPT_Server의 .env 파일과 역할은 같지만, 들어가는 내용에 다소 차이가 있음
#### 포함되어야 하는 요소들
- PORT = 30001
- DB_HOST = 앞에서 설정한 호스트(예: "localhost", "127.0.0.1")
- DB_USER = 앞에서 설정한 유저명(예: "root")
- DB_PASSWORD = mariaDB 설치시에 설정한 해당 유저의 비밀번호
- DB_NAME = "grow"
- DB_PORT = DB가 사용하는 포트. 기본값은 3306
- JWT_SECRET_KEY = JWT 암호화를 위한 무작위 스트링. (예: sUpErDuPeRmEgAsEcReTkEy)
- AWS_REGION = 하단의 AWS S3 참고
- AWS_ACCESS_KEY = 하단의 AWS S3 참고
- AWS_SECRET_KEY = 하단의 AWS S3 참고
- AWS_BUCKET = 하단의 AWS S3 참고

### 실행방법
1. BackEnd_Server 폴더로 들어간다.
2. npm install을 터미널에 친다(첫 실행시에만 하면 됨)
3. node server.js로 실행시킨다.

## AWS S3
- 참고링크: https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-S3-%EB%B2%84%ED%82%B7-%EC%83%9D%EC%84%B1-%EC%82%AC%EC%9A%A9%EB%B2%95-%EC%8B%A4%EC%A0%84-%EA%B5%AC%EC%B6%95
### AWS 회원가입
- 해외 결제가 가능한 카드가 필요하다.
- 과정은 하단의 링크를 참고할 것
    - https://goddaehee.tistory.com/315

### 