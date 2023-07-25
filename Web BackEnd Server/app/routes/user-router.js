const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;

// module.exports = app => {
//     const member = require("../controller/userController.js")

//     // 회원 가입
//     app.post("/member/join", member.join)

//     // id로 조회(임시로 로그인 기능 수행중)
//     app.post("/member/:memberId", member.login);
// }