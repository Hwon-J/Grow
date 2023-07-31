const User = require("../models/user-model.js");
const connection = require("../config/connection.js");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
  var today = new Date();
  try {
    const { id, pw, name, email, emailDomain } = req.body;
    console.log(`userController singup called. id: ${id}, name: ${name} (${today})`);

    // 아이디 중복 검사
    let query = "select id from `member` where id=?";
    connection.query(query, [id], (error, result) => {
      if (error) {
        throw error;
      }
      if (result.length > 0){
        return res.status(202).json({ message: "등록 실패, 이미 존재하는 아이디입니다"});
      }
    });

    // salt 생성
    let salt = crypto.randomBytes(128).toString('base64');

    // 비밀번호 암호화
    const hashedPw = crypto.createHash('sha256').update(inputPassword + salt).digest('hex');

    // 데이터베이스에 멤버 저장
    query =
      "insert into `member` (id, pw, name, email, email_domain, salt) values(?,?,?,?,?,?)";

    connection.query(
      query,
      [id, pw, name, email, emailDomain, salt],
      (error, result) => {
        if (error) {
          throw error;
        }
        console.log(result);
      }
    );

    return res.status(201).json({ message: "회원 가입 성공!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
};


exports.idCheck = async (req, res, next) => {
  var today = new Date();
  try {
    const id = req.params.id;
    console.log(`userController idCheck called. id: ${id} (${today})`);

    // 데이터베이스에서 해당 아이디 존재하는지 체크
    let query = "select id from `member` where id=?";
    connection.query(query, [id], (error, result) => {
      if (error) {
        throw error;
      }
      if (result.length > 0){
        return res.status(202).json({ message: "이미 존재하는 아이디입니다"});
      }
      return res.status(200).json({ message: "사용할 수 있는 아이디입니다"});
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류" });
  }
}


exports.login = async (req, res) => {
  var today = new Date();
  console.log(`userController login called. id: ${req.body.id}, pw: ${req.body.pw} (${today})`);
  try {
    const { id, pw } = req.body;
    let user = null;
    let isPasswordMatch = true;
    let token = null;

    // 데이터베이스에서 멤버 조회
    let query = "select * from `member` where id = ? and pw = ?";

    await connection.query(query, [id, pw], (error, result) => {
      if (error) {
        throw error;
      }
      user = result[0];
      
      if (user === null || user === undefined) {
        return res.status(202).json({ message: "일치하는 멤버 없음" });
      }
  
      // 비밀번호 일치 여부 확인
      if (pw !== user.pw){
        isPasswordMatch = false;
      }
  
      if (isPasswordMatch) {
        // 로그인 성공
        // 토큰 생성 및 응답
        // ...
  
        res.status(201).json({ message: "로그인 성공", token });
      } else {
        res.status(202).json({ message: "비밀번호 불일치" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};
