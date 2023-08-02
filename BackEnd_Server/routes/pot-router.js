const express = require("express");
const router = express.Router();
const potController = require("../controllers/pot-controller");

/**
 * @swagger
 *  /api/pot/{number}:
 *  get:
 *    summary: "특정 시리얼 넘버 조회"
 *    description: "유저가 입력한 시리얼 넘버의 유효성을 검사한다"
 *    tags: [Pots]
 *    parameters:
 *      - in: path
 *        name: number
 *        required: true
 *        description: "검사할 시리얼 넘버"
 *        schema:
 *          type: string
 *    responses:
 *       "200":
 *        description: "사용 가능한 시리얼"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *       "202":
 *        description: "존재하지 않거나 이미 사용한 시리얼 넘버"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 */
router.get("/:number", potController.checkSerial);

router.post("/", potController.allocateOwner);

module.exports = router;
