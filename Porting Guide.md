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
- IAM 참고 링크: https://velog.io/@chrkb1569/AWS-S3-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0-IAM-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%84%A4%EC%A0%95
### AWS 회원가입
- 해외 결제가 가능한 카드가 필요하다.
- 과정은 하단의 링크를 참고할 것
    - https://goddaehee.tistory.com/315

### S3 Bucket 만들기
1. https://s3.console.aws.amazon.com/s3/buckets 로 들어간다
2. "버킷 만들기"를 누른다.
3. 버킷 이름을 정해주고, 리전을 "아시아 태평양(서울) ap-northeast-2"를 선택한다. 객체 소유권은 비활성화를 선택한다.
![버켓1](Docs_images/s3-01.PNG)
4. "이 버킷의 퍼블릭 엑세스 차단 설정"은 이하와 같이 설정한다. 아래의 "현재 설정으로 인해~~"에도 체크해준다.
![버켓2](Docs_images/s3-02.PNG)
5. 나머지 설정은 기본으로 하여 만들기를 하면 끝

### IAM 
- IAM이란 AWS 서버에 엑세스 키로 접근할 수 있는 사용자이다.
- AWS 서버에 직접 접근하는 것은 위험할 수 있으므로, 한정된 권한을 부여한 IAM을 통해 접근하는 것이 권장된다.
- 2개의 IAM을 만들어야 한다. 하나는 백엔드에서 파일을 가져오기 위한 IAM이고, 다른 하나는 웹소켓 서버에서 파일을 업로드 하기 위한 서버이다.
- 따라서 이하의 과정을 사용자 생성과 엑세스 키 생성을 각각 2번씩 반복해야한다.
    - 만약 보안에 크게 신경쓰지 않는다면 하나만 가지고 진행해도 좋다.

#### 사용자 생성
1. https://us-east-1.console.aws.amazon.com/iamv2/home#/home 로 들어간다.
2. 사용자 밑의 숫자를 누른다.
![버켓3](Docs_images/s3-03.PNG)
3. "사용자 생성"을 누른다. 
4. 사용자의 이름을 지어주고 다음으로 넘어간다.
5. "직접 정책 연결"을 선택하고, 검색창에 S3를 입력하여 나온 결과를 확인한다. 백엔드 용이라면 "AmazonS3ReadOnlyAccess"를, 웹소켓 용이라면 "AmazonS3FullAccess"를 선택(좌측의 체크박스 선택)한다. 만약 계정 하나만 만들 거라면 웹소켓용 하나만으로 사용해도 좋다.
![버켓4](./Docs_images/s3-04.PNG)
6. 나머지는 기본으로 하고 생성을 완료 한다.

#### 엑세스 키 생성
1. 앞에서 만든 사용자를 누른다.
![버켓5](./Docs_images/s3-05.PNG)
2. 보안 자격증명 -> 엑세스 키 만들기를 누른다.
![버켓6](Docs_images/s3-06.PNG)
3. 엑세스 키 모법 사례 및 대안에서 사례를 선택한다. AWS 상에 서버를 구축했다면 "AWS 컴퓨팅 서비스에서 실행되는 애플리케이션"을 선택한다.
![버켓7](Docs_images/s3-07.PNG)
4. 선택 후 "위의 권장 사항을 이해했으며 엑세스 키 생성을 계속하려고 합니다"에 체크하고 다음을 누른다.
![버켓8](Docs_images/s3-08.PNG)
5. 엑세스키의 설명을 지어준 뒤 "엑세스 키 만들기"를 누른다. 한글은 쓸 수 없다.
![버켓9](Docs_images/s3-09.PNG)
6. 엑세스 키와 비밀 엑세스 키를 저장해둔다. 엑세스 키는 여기서만 조회가 가능하고, 이후 어떠한 방법으로도 다시 조회할 수 없으므로, 키를 잊어버렸다면 IAM 사용자를 다시 만들어야 하므로 주의.
![버켓10](Docs_images/s3-10.PNG)
7. 6에서 얻은 두 엑세스 키를 .env에 넣는다

#### 버킷 정책 만들기
1. http://awspolicygen.s3.amazonaws.com/policygen.html 에 들어간다.
2. 표시된 부분을 입력한다. principal은 "*", Actions는 "GetObject"와 PutObject 두개를 고르고, ARN은 해당 버켓 페이지 -> 속성에서 확인 가능한 값 뒤에 "/\*"를 붙인다. (예: arn:aws:s3:::grow-test-bucket -> arn:aws:s3:::grow-test-bucket/\*)
![버켓12](Docs_images/s3-12.PNG)
3. Add Statement를 누른 뒤, 하단의 Generate Policy를 누른다.
4. 새로 뜬 창의 내용을 복사해둔다.
5. 방금 만든 버켓으로 들어가 권한 탭-> 버킷 정책->편집을 누른다.
![버켓13](Docs_images/s3-13.PNG)
6. 방금 복사한 내용을 붙여넣기 하고 변경사항 저장을 누른다.
7. 버킷 페이지에서 권한탭->"퍼블릭 엑세스 차단(버킷 설정)"->편집을 누른다.
8. 아래 사진같이 설정하고 변경사항 저장을 한다.
![버켓14](Docs_images/s3-14.PNG)


#### 환경 변수
- AWS_REGION = 버킷을 만들때 정한 지역. 메뉴얼대로 했다면 "ap-northeast-2"이다.
- AWS_ACCESS_KEY = 위에서 얻은 두 엑세스 키 중에서 "엑세스 키"의 문자열
- AWS_SECRET_KEY = 위에서 얻은 두 엑세스 키 중에서 "비밀 엑세스 키"의 문자열
- AWS_BUCKET = 버킷을 만들 때 지어준 이름. 버킷에 들어가서 "속성"탭에서도 확인 할 수 있다.
![버켓11](Docs_images/s3-11.PNG)
