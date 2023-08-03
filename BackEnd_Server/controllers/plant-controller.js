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
      let result = await queryPromise(query, [id]);
      memberIndex = result[0].index;
    } catch (error) {
      winston.error(
        "Error occured during ID verification of plantController registerPlant"
      );
      winston.error(error);
      return res.status(401).json({ code: 401, message: "유효하지 않은 토큰" });
    }

    // 3. 시리얼 조회
    let potIndex = null;
    query = "select * from `pot` where serial_number=?";

    try {
      // 없는 시리얼이면 반환
      let result = await queryPromise(query, [serial]);
      console.log("아무거나");

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
      winston.error("Error occured in database(part 3)");
      throw error;
    }

    // 4. 나머지 값(plant_name, plant_info_index, child_name, child_age)의 유효성 검사를 한다.
    // 4.1 식물 정보 인덱스가 DB에 있는지 확인
    query = "select * from `plant_info` where `index`=?";
    let isInfoIndexExist = true;

    try {
      let result = await queryPromise(query, [infoIndex]);

      if (!result) {
        isInfoIndexExist = false;
      }
    } catch (error) {
      winston.error("Error occured in database(part 4)");
      throw error;
    }

    if (
      !isInfoIndexExist ||
      !plantName ||
      !infoIndex ||
      !childName ||
      !childAge ||
      childAge < 0 ||
      typeof plantName !== "string" ||
      typeof infoIndex !== "number" ||
      typeof childName !== "string" ||
      typeof childAge !== "number"
    ) {
      winston.info(
        `Input not valid: ${plantName}, ${infoIndex}, ${childName}, ${childAge}`
      );
      return res
        .status(400)
        .json({ code: 400, message: "입력값중에 유효하지 않은 입력값 존재" });
    }

    try {
      // 5. 트랜잭션을 건다.
      await queryPromise('START TRANSACTION');
    
      // 6. 화분의 상태를 업데이트 한다.
      const updateQuery = 'UPDATE `pot` SET `member_index` = ? WHERE `serial_number` = ?';
      await queryPromise(updateQuery, [memberIndex, serial]);
      winston.info('table \'pot\' updated. member index: ' + memberIndex + ', serial: ' + serial);
    
      // 7. 식물을 등록한다.
      const insertQuery = 'INSERT INTO `plant` (pot_index, plant_info_index, plant_name, child_name, child_age, member_index) VALUES (?, ?, ?, ?, ?, ?)';
      await queryPromise(insertQuery, [potIndex, infoIndex, plantName, childName, childAge, memberIndex]);
    
      // 8. 트랜잭션을 커밋한다.
      await queryPromise('COMMIT');
    } catch (error) {
      // 오류 발생 시 롤백
      await queryPromise('ROLLBACK');
      winston.error('error occurred during transaction ' + error.message);
      throw error;
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
