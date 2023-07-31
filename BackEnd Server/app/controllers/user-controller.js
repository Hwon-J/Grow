const User = require("../models/user-model.js");
const connection = require("../config/connection.js");

exports.idCheck = async (req, res, next) => {
  var today = new Date();
  console.log(`userController idCheck called. id: ${req.params.id} (${today})`);
  try {
    const id = req.params.id;
    const isExist = false;
    // console.log(id);

    // 데이터베이스에서 해당 아이디 존재하는지 체크
    let query = "select id from `member` where id=?";
    await connection.query(query, [id], (error, result) => {
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

/**
 * 아이디, 비밀번호, 이름, 인증용 아이디, 인증용 아이디 도메인을 받아 회원가입 절차를 진행하는 함수.
 * 먼저 아이디 중복을 확인 한 후, 회원 가입 절차 진행
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.signup = async (req, res, next) => {
  var today = new Date();
  console.log(`userController singup called. id: ${req.body.id}, pw: ${req.body.pw} (${today})`);
  try {
    const { id, pw, name, email, emailDomain } = req.body;
    let salt = 1111;
    // 데이터베이스에 멤버 저장
    let query =
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
