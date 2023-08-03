# BackEnd_Server 사용 설명서

모든 응답은 json 형식입니다

## 회원 관련

- 기본 URI: BaseURI:PORT번호/api/user

### 아이디 중복 확인

- 방식: GET
- 주소: 기본URI/id-check/:id
- 응답:
  - 성공
    - 사용 가능한 아이디: { code: 200, message: "사용할 수 있는 아이디입니다" }
    - 이미 존재하는 아이디: { code: 202, message: "이미 존재하는 아이디입니다" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }

### 회원가입

- 방식: POST
- 서버IP: 기본URI/signup
- 요청 Body
  ```json
  {
    "id": "test",
    "pw": "test",
    "name": "홍길동",
    "email": "test",
    "emailDomain": "test.com"
  }
  ```
- 응답:
  - 성공
    - 회원 가입 성공: { code: 201, message: "회원 가입 성공!" }
    - 이미 존재하는 아이디: { code: 202, message: "이미 존재하는 아이디입니다" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }

### 로그인

- 방식: POST
- 서버IP: 기본URI/login
- 요청 Body
  ```json
  {
    "id": "test",
    "pw": "test"
  }
  ```
- 응답:
  - 성공
    - 로그인 성공: { code: 200, message: "로그인 성공", token }
    - 존재하지 않는 아이디: { code: 202, message: "존재하지 않는 아이디" }
    - 비밀번호 틀림: { code: 202, message: "비밀번호 불일치" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }

## 화분 관련

- 기본 URI: BaseURI:PORT번호/api/pot

### 화분 시리얼 조회

- 방식: GET
- 주소: 기본URI/:number
- 응답:
  - 성공
    - 사용 가능한 시리얼 넘버: { code: 200, message: "사용 가능한 시리얼 넘버" }
    - 존재하지 않는 시리얼 넘버: { code: 202, message: "존재하지 않는 시리얼 넘버" }
    - 이미 사용한 시리얼 넘버: { code: 202, message: "이미 사용한 시리얼 넘버" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }

## 식물 관련

- 기본 URI: BaseURI:PORT번호/api/plant

## 서비스중인 식물들의 정보 전체 조회

- 방식: GET
- 주소: 기본URI/info
- 응답: 
    - 성공
    ```json
    {
        "code": 200,
        "message": "요청 처리 성공",
        "info": [
            {
                "index": 1,
                "species": "상추",
                "temperature_upper": 25,
                "temperature_lower": 0,
                "moisture_upper": null,
                "moisture_lower": null,
                "light_upper": null,
                "light_lower": null,
                "max_water_period": null,
                "info": "상추는 먹을 수 있는 식물이야! 샐러드에 넣거나 샌드위치에 넣어 먹을 수 있어. 녹색 잎이 부드럽고 촉감이 좋아서 맛있는 거야. 영양도 많이 있어서 우리 몸에도 좋아. 봄과 가을에 가장 맛있게 자라요! 그래서 건강한 식사에 넣어두면 좋아.",
                "level": 2
            },
            ......
        ]
    }
    ```
    
## 식물 및 식물을 관리할 화분 등록하기
- 방식: POST
- 주소: 기본URI/create
- 요청 Body:
  ```json
  {
    "token": token,
    "serial_number": "test",
    "plant_name": "싱싱이",
    "plant_info_index": number,
    "child_name": "길동이",
    "child_age": number
  }
  ```
- 응답
  - 성공
    - 등록 성공: { code: 200, message: "등록성공" }
  - 실패
    - 화분의 시리얼 넘버가 존재하지 않음: { code: 400, message: "화분의 시리얼 넘버가 존재하지 않음" }
    - 화분의 시리얼 넘버가 이미 사용중임: { code: 400, message: "화분의 시리얼 넘버가 이미 사용중임" }
    - 유효하지 않은 입력값: { code: 400, message: "입력값중에 유효하지 않은 입력값 존재"}
      - 이 오류는 plant_name, plant_info_index, child_name, child_age의 값이 null이거나 정해진 타입의 값이 아니라면 반환됩니다.
    - 유효하지 않은 토큰: { code: 401, message: "유효하지 않은 토큰"}
      - 이 오류는 토큰이 변조되었거나 만료되었다면 반환됩니다.
    - 서버 오류: { code: 500, message: "서버 오류" }
      - 이 오류는 DB오류도 포함합니다.


## 센서 관련

- 기본 URI: BaseURI:PORT번호/api/sensor

### 센서 데이터 입력

- 방식: POST
- 주소: 기본URI/
- 요청 Body
  ```json
  {
      "serial_number":"test",
      "temperature":number,
      "moisture":number,
      "light":number,
  }
  ```
- 응답:
  - 성공
    - 등록 성공: { code: 201, message: "등록 성공" }
    - 사용중이지 않거나 유효하지 않은 시리얼 넘버: { code: 202, message: "사용중이지 않거나 유효하지 않은 시리얼 넘버" }
    - 등록 실패: { code: 202, message: "등록 실패" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }

### 물 준 기록 입력

- 방식: POST
- 주소: 기본URI/water-log
- 요청 Body
  ```json
  {
    "serial_number": "test"
  }
  ```
- 응답:
  - 성공
    - 등록 성공: { code: 201, message: "등록 성공" }
    - 사용중이지 않거나 유효하지 않은 시리얼 넘버: { code: 202, message: "사용중이지 않거나 유효하지 않은 시리얼 넘버" }
    - 등록 실패: { code: 202, message: "등록 실패" }
  - 실패
    - 서버 오류: { code: 500, message: "서버 오류" }
