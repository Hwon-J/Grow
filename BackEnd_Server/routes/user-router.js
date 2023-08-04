const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
var verify = require("../util/tokenVerifier");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User 관련 API
 */

/**
 * @swagger
 *  /api/user/signup:
 *  post:
 *    summary: "회원가입"
 *    description: "주어진 데이터로 회원 가입을 진행한다"
 *    tags: [User]
 *    consumes:
 *      - application/json
 *    requestBody:
 *      required: true
 *      description: "가입할 데이터"
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *            - id
 *            - pw
 *            - name
 *            - email
 *            - emailDomain
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: "유저 고유아이디"
 *              pw:
 *                type: string
 *                description: "유저 고유아이디"
 *              name:
 *                type: string
 *                description: "유저 고유아이디"
 *              email:
 *                type: string
 *                description: "유저 고유아이디"
 *              emailDomain:
 *                type: string
 *                description: "유저 이름"
 *    responses:
 *       "201":
 *        description: "회원 가입 성공"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *       "202":
 *        description: "중복 아이디"
 *        content:
 *          application/json:
 *            schema:
 *              type: object'
 */
router.post('/signup', userController.signup);

router.get('/id-check/:id', userController.idCheck);

router.post('/login', userController.login);

router.get('/valid', verify, userController.isValidToken);

module.exports = router;