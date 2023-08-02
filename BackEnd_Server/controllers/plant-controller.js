// const Pot = require("../models/pot-model.js");
const connection = require("../util/connection.js");
const winston = require("../util/winston");
const util = require("util");

exports.getPlantInfos = async (req, res, next) => {
  winston.info(`plantController getPlantInfos called.`);
  try {
    let serial = req.params.number;

    // 데이터베이스에서 정보 받기
    let query = "select * from `plant_info`";
    const queryPromise = util.promisify(connection.query).bind(connection);

    let result = await queryPromise(query, [serial]);
    winston.info(`plantController getPlantInfos successfully responds to requests`);
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", info: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};
