// const Pot = require("../models/pot-model.js");
const connection = require("../util/connection.js");
const winston = require("../util/winston");
const s3 = require("../util/aws-s3.js");
const util = require("util");
const path = require("path");
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
// 5. 트랜잭션을 건다
// 6. 화분의 상태를 업데이트 한다.
// 7. 식물을 등록한다.
// 8. 새로 등록한 식물의 index를 얻어온다.
// 9. 등록한 식물에 대한 condition을 디폴트값으로 생성한다.
// 10. 트랜잭션을 해제한다.
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

      potIndex = result[0].index;
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
      await queryPromise("START TRANSACTION");

      // 6. 화분의 상태를 업데이트 한다.
      const updateQuery =
        "UPDATE `pot` SET `member_index` = ? WHERE `serial_number` = ?";
      await queryPromise(updateQuery, [memberIndex, serial]);
      winston.info(
        "table 'pot' updated. member index: " +
          memberIndex +
          ", serial: " +
          serial
      );

      // 7. 식물을 등록한다.
      const insertQuery =
        "INSERT INTO `plant` (pot_index, plant_info_index, plant_name, child_name, child_age, member_index) VALUES (?, ?, ?, ?, ?, ?)";
      let result = await queryPromise(insertQuery, [
        potIndex,
        infoIndex,
        plantName,
        childName,
        childAge,
        memberIndex,
      ]);

      // 8. 가장 최근에 올린 식물의 인덱스를 가져온다.
      const newPlantId = result.insertId;

      //9 . 등록한 식물에 대한 condition을 디폴트값으로 생성한다.
      const sql = `insert into \`plant_condition\` (plant_index, temperature, moisture, light)
      values (?, ?, ?, ?)`;
      await queryPromise(sql, [newPlantId, 0, 0, 0]);

      // 10. 트랜잭션을 커밋한다.
      await queryPromise("COMMIT");
    } catch (error) {
      // 오류 발생 시 롤백
      await queryPromise("ROLLBACK");
      winston.error("error occurred during transaction " + error.message);
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

exports.getAllPlant = async (req, res) => {
  const id = req.decoded.id;
  winston.info(`plantController getAllPlant called. id:${id}`);
  try {
    // 데이터베이스에서 정보 받기
    let query = `select plant.index as \`index\`, plant.pot_index as pot_index, 
        plant.plant_info_index as plant_info_index, plant.start_date as start_date, 
        plant.end_date as end_date, plant.plant_name as plant_name, 
        plant.child_name as child_name, plant.child_age as child_age, plant.complete as complete
      from \`plant\` join \`member\` on plant.member_index = member.index 
      where member.id = ?`;

    let result = await queryPromise(query, [id]);
    winston.info(
      `plantController getAllPlant successfully responds to requests`
    );
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", data: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.getPlantByIndex = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController getPlantByIndex called. id:${id}, index:${index}`
  );
  try {
    // 데이터베이스에서 정보 받기
    let query = `select plant.index as \`index\`, plant.pot_index as pot_index, 
        plant.plant_info_index as plant_info_index, plant.start_date as start_date, 
        plant.end_date as end_date, plant.plant_name as plant_name, 
        plant.child_name as child_name, plant.child_age as child_age, plant.complete as complete
        from \`plant\` join \`member\` on plant.member_index = member.index 
        where member.id = ? and plant.index = ?`;

    let result = await queryPromise(query, [id, index]);
    winston.info(
      `plantController getPlantByIndex successfully responds to requests`
    );
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", data: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.getWaterLogByIndex = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController getWaterLogByIndex called. id:${id}, index:${index}`
  );
  try {
    // 데이터베이스에서 정보 받기
    let query = `select watered_date as watered from water_log join plant on water_log.plant_index = plant.index 
      join member on plant.member_index = member.index
    where member.id = ? and plant.index = ?`;
    let result = await queryPromise(query, [id, index]);

    let array = [];
    result.forEach((value) => {
      array.push(value.watered);
    });

    winston.info(
      `plantController getWaterLogByIndex successfully responds to requests`
    );
    await queryPromise("COMMIT");
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", data: array });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

// 1. 트랜잭션을 연다
// 2. 식물의 pot_index를 받아온다
// 3. index에 맞는 식물을 찾아 complete 상태로 만든다
// 4. 원래의 pot에서 주인을 null로 만든다.
// 5. 트랜잭션을 닫는다.
exports.setComplete = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController setComplete called. id:${id}, plantIndex:${index}`
  );
  try {
    await queryPromise("START TRANSACTION");

    // 데이터베이스에서 정보 받기
    let query = `select pot.index as \`index\` from pot join plant on pot.index = plant.pot_index where plant.index = ?`;
    let result = await queryPromise(query, [index]);
    // console.log(result);
    // 결과가 없으면 오류
    if (!result || result.length === 0) {
      winston.info("등록된 화분이 없는 식물, plant index: " + index);
      return res
        .status(202)
        .json({ code: 202, message: "등록된 화분이 없는 식물" });
    }

    // 컴플리트 상태로 변경
    query = `update plant set pot_index = null, complete = 1, end_date = now() where \`index\` = ?`;
    await queryPromise(query, [index]);

    // pot을 변경
    query = `update pot set member_index = null where \`index\` = ?`;
    await queryPromise(query, [result[0].index]);

    // 트랜잭션 커밋
    await queryPromise("COMMIT");

    winston.info(`plantController setComplete successfully completed`);
    return res.status(200).json({ code: 200, message: "요청 처리 성공" });
  } catch (error) {
    // 오류 발생 시 롤백
    await queryPromise("ROLLBACK");
    winston.error("error occurred during transaction " + error.message);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.getQuestionList = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController getQuestionList called. id:${id}, plantIndex:${index}`
  );
  try {
    // 요청자가 해당 식물의 소유자인지 확인
    let query = `select id from member join plant on member.index = plant.member_index where id = ? and plant.index = ?`;
    let result = await queryPromise(query, [id, index]);
    // console.log(result);
    if (!result || result.length === 0) {
      winston.info("invalid id or index");
      return res
        .status(202)
        .json({ code: 202, message: "유효하지 않은 id 또는 index" });
    }

    query = `select * from question where plant_index = ?`;
    result = await queryPromise(query, [index]);
    // console.log(result);

    winston.info(`plantController getQuestionList successfully completed`);
    return res
      .status(200)
      .json({ code: 200, message: "요청 처리 성공", data: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.registQuestion = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  const quest = req.body.quest;
  winston.info(
    `plantController registQuestion called. id:${id}, plantIndex:${index}, quest:${quest}`
  );
  try {
    // 요청자가 해당 식물의 소유자인지 확인
    let query = `select id, complete from member join plant on member.index = plant.member_index where id = ? and plant.index = ?`;
    let result = await queryPromise(query, [id, index]);
    console.log(result);
    if (!result || result.length === 0) {
      winston.info("invalid id or index");
      return res
        .status(202)
        .json({ code: 202, message: "유효하지 않은 id 또는 index" });
    }
    if (result[0].complete == 1) {
      winston.info("already completed plant. index: " + index);
      return res
        .status(202)
        .json({ code: 202, message: "이미 완료처리된 식물" });
    }
    query = `insert into question(plant_index, content, completed) values (?, ?, 0)`;
    await queryPromise(query, [index, quest]);

    winston.info(`plantController registQuestion successfully completed`);
    return res
      .status(201)
      .json({ code: 201, message: "요청 처리 성공", data: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

// 1. id와 질문의 index로 소유권을 확인한다.
// 2. 소유권이 있다면 음성 파일을 전송한다.
exports.getAnswerById = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController getAnswerById called. ID: ${id}, Question Index: ${index}`
  );
  try {
    // 트랜잭션 시작
    await queryPromise("START TRANSACTION");

    // 사용자, 사용자의 식물, 그 식물에 등록된 질문들을 조회
    let query = `select * 
    from \`member\` join \`plant\` on member.index = plant.member_index
    join \`question\` on plant.index = question.plant_index
    join \`pot\` on pot.index = plant.pot_index
    where \`member\`.id = ? and question.index = ?
    `;
    let result = await queryPromise(query, [id, index]);
    // 트랜잭션 커밋
    await queryPromise("COMMIT");

    if (result.length === 0) {
      return res
        .status(403)
        .json({ code: 400, message: "권한이 없거나 존재하지 않는 index" });
    }

    // let keyPath = `${result[0].serial_number}/${result[0].audio_file_path.slice(2)}`
    let keyPath = result[0].audio_file_path;

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: keyPath,
      Expires: 60 * 5,
    };

    s3.getSignedUrl("getObject", params, (err, url) => {
      winston.info(`returned url: ${url}`);
      if (err) {
        winston.info("Failed to generate presigned URL");
        return res
          .status(500)
          .json({ error: "Failed to generate presigned URL" });
      }
      res.setHeader('Content-Type', 'audio/mpeg');
      return res
        .status(201)
        .json({ code: 200, message: "URL 생성성공", presignedUrl: url });
    });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

// 1. id와 질문의 index로 소유권을 확인한다.
// 2. 소유권이 있다면 삭제를 진행한다.
exports.deleteQuestion = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController deleteQuestion called. ID: ${id}, Question Index: ${index}`
  );
  try {
    // 트랜잭션 시작
    await queryPromise("START TRANSACTION");

    // 사용자, 사용자의 식물, 그 식물에 등록된 질문들을 조회
    let query = `select * 
    from \`member\` join \`plant\` on member.index = plant.member_index
    join \`question\` on plant.index = question.plant_index
    where \`member\`.id = ? and question.index = ?
    `;

    let result = await queryPromise(query, [id, index]);
    if (result.length === 0) {
      await queryPromise("COMMIT");
      return res
        .status(403)
        .json({ code: 400, message: "권한이 없거나 존재하지 않는 index" });
    }

    // 삭제 진행
    query = `delete from question where \`index\` = ?`;
    result = await queryPromise(query, [index]);

    // 트랜잭션 커밋
    await queryPromise("COMMIT");

    winston.info(`plantController deleteQuestion successfully completed`);
    return res
      .status(201)
      .json({ code: 201, message: "요청 처리 성공", data: result });
  } catch (error) {
    winston.error(error);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.deletePlantByIndex = async (req, res) => {
  const id = req.decoded.id;
  const index = req.params.index;
  winston.info(
    `plantController deletePlantByIndex called. ID: ${id}, Plant Index: ${index}`
  );
  try {
    // 트랜잭션 시작
    await queryPromise("START TRANSACTION");

    // 권한이 있는지 확인
    let sql = `select *, plant.index as pindex from \`plant\` join \`member\` on plant.member_index = member.index where plant.index = ? and id = ?`;
    let result = await queryPromise(sql, [index, id]);

    // 권한이 없으면 리턴
    if (result.length === 0) {
      winston.info(
        `plantController deletePlantByIndex returned 400. Forbidden`
      );
      await queryPromise("COMMIT");
      return res
        .status(400)
        .json({ code: 400, message: "권한이 없거나 존재하지 않는 index" });
    }

    // 권한이 있으면 삭제 진행
    sql = `delete from \`plant\` where \`index\` = ?`;
    result = await queryPromise(sql, [result[0].pindex]);

    // 트랜잭션 커밋
    await queryPromise("COMMIT");

    if (result.affectedRows === 0) {
      winston.info(`plantController deletePlantByIndex 0 row deleted`);
      return res.status(202).json({ code: 202, message: "삭제된 데이터 없음" });
    }
    winston.info(`plantController deletePlantByIndex successfully completed`);
    return res
      .status(201)
      .json({ code: 201, message: "요청 처리 성공", data: result });
  } catch (error) {
    // 오류 발생 시 롤백
    await queryPromise("ROLLBACK");
    winston.error("error occurred during transaction " + error.message);
    return res.status(500).json({ code: 500, message: "서버 오류" });
  }
};
