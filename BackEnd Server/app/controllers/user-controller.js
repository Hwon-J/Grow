const User = require("../models/user-model.js");
const connection = require("../config/connection.js");

exports.idCheck = async (req, res, next) => {
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
        return res.status(401).json({ message: "이미 존재하는 아이디입니다"});
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
  console.log(`userController login called. id: ${req.body.id}, pw: ${req.body.pw}`);
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
        return res.status(404).json({ message: "일치하는 멤버 없음" });
      }
  
      // 비밀번호 일치 여부 확인
      if (pw !== user.pw){
        isPasswordMatch = false;
      }
  
      if (isPasswordMatch) {
        // 로그인 성공
        // 토큰 생성 및 응답
        // ...
  
        res.status(200).json({ message: "로그인 성공", token });
      } else {
        res.status(401).json({ message: "비밀번호 불일치" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// // 새 객체 생성
// exports.create = (req, res) => {
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content body is empty",
//     });
//   }

//   const member = new Custom({
//     id: req.body.id,
//     pw: req.body.pw,
//     name: req.body.name,
//     email: req.body.email,
//     emailDomain: req.body.emailDomain,
//     salt: req.body.salt,
//     token: null,
//   });

//   // DB에 저장
//   Member.create(customer, (err, data) => {
//     if (err) {
//       res.status(500).send({
//         message:
//           err.message || "Some error occured while creating th Customer.",
//       });
//     }
//   });
// };

// // id로 조회
// exports.findOne = (req, res) => {
//   Customer.findById(req.params.userId, (err, data) => {
//     if (err) {
//       if (err.kind === "not_found") {
//         res.status(404).send({
//           message: `Not found User with id ${req.params.userId}.`,
//         });
//       } else {
//         res.status(500).send({
//           message: "Error retrieving User with id " + req.params.userId,
//         });
//       }
//     } else res.send(data);
//   });
// };
