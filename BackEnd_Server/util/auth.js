import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = (req, res, next) => {
  const key = process.env.JWT_SECRET_KEY;
  try {
    // 인증 성공
    req.decoded = jwt.verify(req.headers.auth, key);
    return next();
  } catch (error) {
    // 인증 실패
    if (error.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        message: "토큰 만료됨",
      });
    }
    if (error.name === "TokenWebTokenError") {
      return res.status(401).json({
        code: 401,
        message: "유효하지 않은 토큰",
      });
    }
  }
};
