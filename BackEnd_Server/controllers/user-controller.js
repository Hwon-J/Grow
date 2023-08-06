const User = require("../models/user-model.js");
const connection = require("../util/connection.js");
const winston = require("../util/winston");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const util = require("util");

// 유효성 검사 과정이 필요함
exports.signup = async (req, res, next) => {
  try {
    const { id, pw, name, email, emailDomain } = req.body;
    winston.info(`userController singup called. id: ${id}, name: ${name}`);

    // 아이디 중복 검사
    let query = "select id from `member` where id=?";
    const queryPromise = util.promisify(connection.query).bind(connection);

    let result = null;
    try {
      result = await queryPromise(query, [id]);
    } catch (error) {
      winston.error("데이터베이스 조회중 에러 발생");
      winston.error(error);
      throw error;
    }

    if (result.length > 0) {
      winston.info(
        "userController singup return '등록 실패, 이미 존재하는 아이디입니다'"
      );
      return res
        .status(202)
        .json({ code: 202, message: "등록 실패, 이미 존재하는 아이디입니다" });
    }

    // salt 생성
    let salt = crypto.randomBytes(128).toString("base64");

    // 비밀번호 암호화
    const hashedPw = crypto
      .createHash("sha256")
      .update(pw + salt)
      .digest("hex");

    // 데이터베이스에 멤버 저장
    query =
      "insert into `member` (id, pw, name, email, email_domain, salt) values(?,?,?,?,?,?)";

    try {
      await queryPromise(query, [id, hashedPw, name, email, emailDomain, salt]);
    } catch (error) {
      winston.error("데이터베이스 입력중 에러 발생");
      winston.error(error);
      throw error;
    }

    winston.info("userController singup return '회원 가입 성공!'");
    return res.status(201).json({ code: 201, message: "회원 가입 성공!" });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.idCheck = async (req, res, next) => {
  try {
    const id = req.params.id;
    winston.info(`userController idCheck called. id: ${id}`);

    // 데이터베이스에서 해당 아이디 존재하는지 체크
    let query = "select id from `member` where id=?";
    const queryPromise = util.promisify(connection.query).bind(connection);

    let result = await queryPromise(query, [id]);
    if (result.length > 0) {
      winston.info(
        `userController idCheck return "이미 존재하는 아이디입니다"`
      );
      return res
        .status(202)
        .json({ code: 202, message: "이미 존재하는 아이디입니다" });
    }
    winston.info(`userController idCheck return "사용할 수 있는 아이디입니다"`);
    return res
      .status(200)
      .json({ code: 200, message: "사용할 수 있는 아이디입니다" });
  } catch (err) {
    winston.error(err);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

// 1. 해당 아이디를 가지는 사람의 salt를 가져온다.
//   1.1. 만약 해당 아이디를 가진 사람이 없다면 실패 응답을 보낸다.
// 2. 입력된 pw를 salt와 합쳐서 암호화 한다.
// 3. 해당 아이디와 암호화된 pw를 가지는 사람을 찾는다.
// 4. 해당하는 사람이 있으면 jwt 토큰을 만들어서 제공한다.
//   4.1. 없으면 로그인 실패 응답을 보낸다.
exports.login = async (req, res) => {
  try {
    const { id, pw } = req.body;
    winston.info(`userController login called. id: ${id}, pw: ${pw}`);
    let query = "select salt from `member` where id=?";

    const queryPromise = util.promisify(connection.query).bind(connection);
    let result = await queryPromise(query, [id]);

    if (result.length === 0) {
      winston.info(
        `userController login return '존재하지 않는 아이디' to ${id}`
      );
      return res
        .status(202)
        .json({ code: 202, message: "존재하지 않는 아이디" });
    }

    const salt = result[0].salt;
    // 비밀번호 암호화
    const hashedPw = crypto
      .createHash("sha256")
      .update(pw + salt)
      .digest("hex");

    // 데이터베이스에서 멤버 조회
    query = "select * from `member` where id = ? and pw = ?";
    result = await queryPromise(query, [id, hashedPw]);

    // 로그인 실패
    if (result.length !== 1) {
      return res.status(202).json({ code: 202, message: "비밀번호 불일치" });
      // return res.status(202).json({ message: "일치하는 멤버 없음" });
    }

    // 로그인 성공
    const key = process.env.JWT_SECRET_KEY;
    // 토큰 생성
    let token = jwt.sign(
      {
        type: "JWT",
        id: id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "60m",
        issuer: "Grow",
      }
    );

    winston.info(`userController login return '로그인 성공' to ${id}`);
    return res
      .status(200)
      .json({ code: 200, message: "로그인 성공", token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.isValidToken = (req, res) => {
  return res
      .status(200)
      .json({ code: 200, message: "유효한 토큰" });
}

// 탈퇴
// 1. 해당 아이디를 가지는 사람의 salt를 가져온다.
//   1.1. 만약 해당 아이디를 가진 사람이 없다면 실패 응답을 보낸다.
// 2. 입력된 pw를 salt와 합쳐서 암호화 한다.
// 3. 해당 아이디와 암호화된 pw를 가지는 사람을 삭제한다.
//   3.1. 없으면 탈퇴 실패 응답을 보낸다.
exports.withdrawalUser = async (req, res) => {
  try {
    const { id, pw } = req.body;
    winston.info(`userController withdrawalUser called. id: ${id}, pw: ${pw}`);
    let query = "select salt from `member` where id=?";

    const queryPromise = util.promisify(connection.query).bind(connection);
    let result = await queryPromise(query, [id]);

    if (result.length === 0) {
      winston.info(
        `userController withdrawalUser return '존재하지 않는 아이디' to ${id}`
      );
      return res
        .status(202)
        .json({ code: 202, message: "존재하지 않는 아이디" });
    }

    const salt = result[0].salt;
    // 비밀번호 암호화
    const hashedPw = crypto
      .createHash("sha256")
      .update(pw + salt)
      .digest("hex");

    // 데이터베이스에서 멤버 조회
    query = "delete from `member` where id = ? and pw = ?";
    result = await queryPromise(query, [id, hashedPw]);
    console.log(result);
    if (result === 0){
      return res.status(202).json({code: 202, message: "비밀번호 불일치"});
    }
    return res.status(202).json({code: 201, message: "회원탈퇴 성공"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
}