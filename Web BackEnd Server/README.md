#### 회원가입
- 서버IP:3000/api/user/signup
- 형식
    ```json
    {
        "id":"tttt",
        "pw":"test",
        "name":"홍길동",
        "email":"test",
        "emailDomain":"test.com"
    }
    ```
- 성공시: status(201).json({ message: "회원 가입 성공!" })
- 실패시: status(500).json({ message: "서버 오류" })
- 기타 오류: status(500).json({ message: "서버 오류" })

#### 로그인
- 서버IP:3000/api/user/login
- 형식
    ```json
    {
        "id":"tttt",
        "pw":"test"
    }
    ```
- 성공시:status(200).json({ message: "로그인 성공", token })
- 존재하지 않는 아이디: status(404).json({ message: "일치하는 멤버 없음" })
- 비밀번호 틀림:status(401).json({ message: "비밀번호 불일치" })
- 기타 오류: status(500).json({ message: "서버 오류" })