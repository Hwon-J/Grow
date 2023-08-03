// const Pot = require("../models/pot-model.js");
const { error } = require("console");
const connection = require("../util/connection.js");
const winston = require("../util/winston");
const util = require("util");
const queryPromise = util.promisify(connection.query).bind(connection);

exports.getPlantInfos = async (req, res, next) => {
  winston.info(`plantController getPlantInfos called.`);
  try {
    let serial = req.params.number;

    // 데이터베이스에서 정보 받기
    let query = "select * from `plant_info`";

    let result = await queryPromise(query, [serial]);
    winston.info(
      `plantController getPlantInfos successfully responds to requests`
    );
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", info: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

// 1. 토큰을 디코드 한다.
// 2. 토큰속에 있던 아이디의 유효성 검사를 한다.
// 3. 시리얼을 조회한다.
// 4. 나머지 값(plant_name, plant_info_index, child_name, child_age)의 유효성 검사를 한다.
// 5. 트랜젝션을 건다
// 6. 화분의 상태를 업데이트 한다.
// 7. 식물을 등록한다.
// 8. 트랜젝션을 해제한다.
exports.registPlant = async (req, res) => {
  winston.info(`plantController registPlant called.`);
  try {
    let {
      serial_number: serial,
      plant_name: plantName,
      plant_info_index: infoIndex,
      child_name: childName,
      child_age: childAge,
    } = req.body;
    let id = req.decoded.id;
    console.log(id);

    // 2. 토큰속의 아이디 유효성 검사
    let memberIndex = null;
    let query = "select * from `member` where `id`=?";

    try {
      let result = await queryPromise(query, [serial]);
      memberIndex = result[0].index;
    } catch (error) {
      winston.error(
        "Error occured during ID verification of plantController registerPlant"
      );
      winston.error(error);
      return res
        .status(401)
        .json({ code: 401, message: "유효하지 않은 토큰" });
    }

    // 3. 시리얼 조회
    let potIndex = null;
    query = "select * from `pot` where serial_number=?";

    try {
      // 없는 시리얼이면 반환
      if (result.length === undefined || result.length == 0) {
        winston.info(`serial number ${serial} is not exist`);
        return res
          .status(400)
          .json({ code: 400, message: "화분의 시리얼 넘버가 존재하지 않음" });
      }
      // 이미 쓴 시리얼이면 반환
      if (result[0].member_index !== null) {
        winston.info(`serial number ${serial} is already used`);
        return res
          .status(400)
          .json({ code: 400, message: "화분의 시리얼 넘버가 이미 사용중임" });
      }

      potIndex = result[0].pot_index;
    } catch (error) {
      winston.error("Error occured in database");
      winston.error(error);
      throw error;
    }

    // 4. 나머지 값(plant_name, plant_info_index, child_name, child_age)의 유효성 검사를 한다.
    // 4.1 식물 정보 인덱스가 DB에 있는지 확인
    query = "select * from `plant_info` where index=?";
    let isInfoIndexExist = true;
    await connection.query(query, [infoIndex], (error, result) => {
      if (error) {
        winston.error("Error occured in database");
        winston.error(error);
        throw error;
      }
      if (!result) {
        isInfoIndexExist = false;
      }
    });

    if (
      !isInfoIndexExist ||
      !plantName ||
      !infoIndex ||
      !childName ||
      !childAge ||
      typeof plantName !== "string" ||
      typeof infoIndex !== "number" ||
      typeof childName !== "string" ||
      typeof childAge !== "number"
    ) {
      winston.info(`Input not valid: ${plantName}, ${infoIndex}, ${childName}, ${childAge}`);
      return res.status(400).json({ code: 400, message: "입력값중에 유효하지 않은 입력값 존재"});
    }

    try{
      // 5. 트랜젝션을 건다.
      await connection.beginTransaction();
      
      // 6. 화분의 상태를 업데이트 한다.
      query = "update `pot` set `member_index` = ? where `serial_number` = ?"
      connection.query(query, [memberIndex, serial], (error, result) => {
        if (error) {
          winston.error("Error occured in database");
          winston.error(error);
          throw error;
        }
        winston.info("table 'pot' updated. member index: "+memberIndex+", serial: " + serial);
      });

      // 7. 식물을 등록한다.
      query = "insert into `plant`(pot_index, plant_info_index, plant_name, child_name, child_age, member_index) values (?, ?, ?, ?, ?, ?)";
      connection.query(query, [potIndex, infoIndex, plantName, childName, childAge, memberIndex], (error, result) => {
        if (error) {
          winston.error("Error occured in database");
          winston.error(error);
          throw error;
        }
      })
      
      // 8. 트랜젝션을 해제한다.
      await connection.commit();
    } catch (error){
      await connection.rollback();
      winston.error("error occured during transaction " + error.msg);
    }
    winston.info(
      `plantController registPlant successfully responds to requests`
    );
    return res.status(200).json({ code: 200, message: "등록성공" });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};
