# Porting Guide
## DB
- 사용 프로그램: MariaDB
### grow_dump.sql 실행하기
#### 방법 1: mysql WorkBench 사용하기
1. mysql WorkBench 홈에서 "MySQL Connections"옆의 + 아이콘을 누른다.
2. 적당한 Connection Name을 지어주고(예: MariaDB), Hostname, Port, Username을 쓴다. 만약 mariadb를 깐 뒤 별도의 처리를 하지 않았다면 

## 도커

## AWS EC2

## 젠킨스

## nginx

## ChatGPT_Server
### ChatGPT
1. OpenAI에 가입한다.(구글 로그인 같은 외부 아이디 사용도 가능)
2. 링크(https://platform.openai.com/account/billing/payment-methods)로 이동하여 Add Payment Method를 눌러 진행한다. 해외 결제가 가능한 카드가 필요하다.
3. 결제수단 등록이 완료 되었다면, API Keys로 들어간다. (https://platform.openai.com/account/api-keys)
4. Create new secret key를 눌러 새 키를 발급받는다. 생성된 API키는 생성 이후엔 절대 다시 조회할 수 없으니, 키를 잊어버렸다면 기존 키를 삭제하고 새로 발급 받아야 한다.
5. 생성된 API키를 .env 파일에 아래와 같은 형식으로 추가한다.
```
API_KEY = "sk-..."
```

## AWS S3