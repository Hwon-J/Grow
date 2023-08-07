const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const winston = require("./winston.js");

dotenv.config();

const verify = (req, res, next) => {
  winston.info("token verify called. auth:" + req.headers.authorization);
  // console.log(req.headers);
  // console.log(req.body);
  const key = process.env.JWT_SECRET_KEY;
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    req.decoded = jwt.verify(req.headers.authorization, key);
    // console.log(req.decoded.id);
    return next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === "TokenExpiredError") {
      winston.info("token 만료 auth:" + req.headers.authorization);
      return res.status(401).json({
        code: 401,
        message: "토큰이 만료되었습니다.",
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === "JsonWebTokenError") {
      winston.info("token 유효하지 않음 auth:" + req.headers.authorization);
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰입니다.",
      });
    }
    return res.status(500).json({
      code: 500,
      message: "서버에러",
    });
  }
};

module.exports = verify;
