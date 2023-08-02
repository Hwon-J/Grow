const Pot = require("../models/pot-model.js");
const connection = require("../util/connection.js");
const winston = require("../util/winston");
const util = require("util");

exports.checkSerial = async (req, res, next) => {
  winston.info(`potController checkSerial called. serial: ${req.params.number}`);
  try {
    let serial = req.params.number;

    // 데이터베이스에서 멤버 조회
    let query = "select * from `pot` where `serial_number`=?";
    const queryPromise = util.promisify(connection.query).bind(connection);

    let result = await queryPromise(query, [serial]);
    // 시리얼 넘버 유효 체크
    if (result.length == 0) {
      winston.info(
        `potController checkSerial return "존재하지 않는 시리얼 넘버"`
      );
      return res
        .status(202)
        .json({ code: 202, message: "존재하지 않는 시리얼 넘버" });
    }

    // 시리얼 넘버 사용 여부 체크
    if (result[0].member_index === null) {
      winston.info(
        `potController checkSerial return "사용 가능한 시리얼 넘버"`
      );
      return res
        .status(200)
        .json({ code: 200, message: "사용 가능한 시리얼 넘버" });
    } else {
      winston.info(
        `potController checkSerial return "이미 사용한 시리얼 넘버"`
      );
      return res
        .status(202)
        .json({ code: 202, message: "이미 사용한 시리얼 넘버" });
    }
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};
