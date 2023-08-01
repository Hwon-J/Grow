const User = require("../models/user-model.js");
const connection = require("../util/connection.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const util = require("util");

exports.signup = async (req, res, next) => {
  var today = new Date();
  try {
    const { id, pw, name, email, emailDomain } = req.body;
    console.log(
      `userController singup called. id: ${id}, name: ${name} (${today})`
    );

    // 아이디 중복 검사
    let query = "select id from `member` where id=?";
    const queryPromise = util.promisify(connection.query).bind(connection);

    const result = await queryPromise(query, [id]);
    if (result.length > 0) {
      console.log("발동!");
      error = { message: "등록 실패, 이미 존재하는 아이디입니다" };
      throw error;
      // return res.status(202).json({ message: "등록 실패, 이미 존재하는 아이디입니다"});
    }

    // await connection.query(query, [id], (error, result) => {
    //   if (error) {
    //     throw error;
    //   }
    //   console.log(result);
    // });

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

    console.log("dho?");
    await connection.query(
      query,
      [id, hashedPw, name, email, emailDomain, salt],
      (error, result) => {
        if (error) {
          throw error;
        }
      }
    );

    return res.status(201).json({ message: "회원 가입 성공!" });
  } catch (error) {
    console.error(error);
    if (error) {
      return res.status(202).json(error);
    } else {
      return res.status(500).json({ message: "서버 오류" });
    }
  }
};

exports.idCheck = async (req, res, next) => {
  var today = new Date();
  try {
    const id = req.params.id;
    console.log(`userController idCheck called. id: ${id} (${today})`);

    // 데이터베이스에서 해당 아이디 존재하는지 체크
    let query = "select id from `member` where id=?";
    await connection.query(query, [id], (error, result) => {
      if (error) {
        throw error;
      }
      if (result.length > 0) {
        return res.status(202).json({ message: "이미 존재하는 아이디입니다" });
      }
      return res.status(200).json({ message: "사용할 수 있는 아이디입니다" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

// 1. 해당 아이디를 가지는 사람의 salt를 가져온다
// 2. 입력된 pw를 salt와 합쳐서 암호화 한다.
// 3. 해당 아이디와 암호화된 pw를 가지는 사람을 찾는다.
// 4. 해당하는 사람이 있으면 jwt 토큰을 만들어서 제공한다.
// 5. 없으면 로그인 실패 응답을 보낸다.
exports.login = async (req, res) => {
  var today = new Date();
  try {
    const { id, pw } = req.body;
    console.log(`userController login called. id: ${id}, pw: ${pw} (${today})`);
    let query = "select salt from `member` where id=?";

    const queryPromise = util.promisify(connection.query).bind(connection);
    let result = await queryPromise(query, [id]);

    if (result.length === 0) {
      let error = { code: 202, message: "존재하지 않는 아이디" };
      throw error;
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
      return res.status(202).json({ message: "비밀번호 불일치" });
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

    return res
      .status(200)
      .json({ code: 200, message: "로그인 성공", token: token });
  } catch (error) {
    console.error(error);
    if (error.code !== undefined && error.code === 202) {
      return res.status(202).json(error);
    }
    return res.status(500).json({ message: "서버 오류" });
  }
};
