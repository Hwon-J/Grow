const Sensor = require("../models/sensor-model.js");
const connection = require("../util/connection.js");
const winston = require("../util/winston.js");
const util = require("util");

exports.updateSensorData = async (req, res, next) => {
  winston.info(
    `sensorController updateSensorData called. serial: ${req.body.serial_number}`
  );
  try {
    const { serial_number: serial, temperature, moisture, light } = req.body;
    const queryPromise = util.promisify(connection.query).bind(connection);

    // 데이터베이스에서 시리얼에 해당하는 식물 번호 조회
    let query =
      "select plant.index as `index` from `plant` join `pot` on plant.pot_index = pot.index where pot.serial_number=?";

    let result = null;
    try {
      result = await queryPromise(query, [serial]);
    } catch (error) {
      winston.error("시리얼 조회중 데이터베이스 에러 발생");
      return res.status(202).json({ code: 202, message: "등록 실패" });
    }

    // 시리얼 넘버 유효 체크
    if (result === null || result.length == 0) {
      winston.info(
        "sensorController updateSensorData return: 사용중이지 않거나 유효하지 않은 시리얼 넘버"
      );
      return res.status(202).json({
        code: 202,
        message: "사용중이지 않거나 유효하지 않은 시리얼 넘버",
      });
    }

    // 해당하는 식물 번호가 존재하면, 그 식물 번호에 해당하는 센서값 등록
    query =
      "update `plant_condition` set temperature = ?, moisture = ?, light=?, measurement_date = now() where plant_index=?";
    try {
      await queryPromise(query, [
        temperature,
        moisture,
        light,
        result[0].index,
      ]);
    } catch (error) {
      winston.error("센서값 등록중 데이터베이스 에러 발생");
      winston.error(error);
      return res.status(202).json({ code: 202, message: "등록 실패" });
    }
    winston.info("sensorController updateSensorData return: '등록 성공'");
    return res.status(201).json({ code: 201, message: "등록 성공" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "서버 오류" });
  }
};

exports.insertWaterLog = async (req, res, next) => {
  winston.info(
    `sensorController insertWaterLog called. serial: ${req.body.serial_number}`
  );
  try {
    const { serial_number: serial} = req.body;
    const queryPromise = util.promisify(connection.query).bind(connection);

    // 데이터베이스에서 시리얼에 해당하는 식물 번호 조회
    let query =
      "select plant.index as `index` from `plant` join `pot` on plant.pot_index = pot.index where pot.serial_number=?";

    let result = null;
    try {
      result = await queryPromise(query, [serial]);
    } catch (error) {
      winston.error("시리얼 조회중 데이터베이스 에러 발생");
      return res.status(202).json({ code: 202, message: "등록 실패" });
    }

    // 시리얼 넘버 유효성 체크
    if (result === null || result.length == 0) {
      winston.info(
        "sensorController insertWaterLog return: 사용중이지 않거나 유효하지 않은 시리얼 넘버"
      );
      return res.status(202).json({
        code: 202,
        message: "사용중이지 않거나 유효하지 않은 시리얼 넘버",
      });
    }

    // 해당하는 식물 번호가 존재하면, 그 식물 번호에 물 준 기록 추가
    query =
      "insert into `water_log`(plant_index) values (?)";
    try {
      await queryPromise(query, [
        result[0].index,
      ]);
    } catch (error) {
      winston.error("센서값 등록중 데이터베이스 에러 발생");
      winston.error(error);
      return res.status(202).json({ code: 202, message: "등록 실패" });
    }
    winston.info("sensorController insertWaterLog return: '등록 성공'");
    return res.status(201).json({ code: 201, message: "등록 성공" });

  } catch (error) {
    winston.error(error);
    res.status(500).json({ code: 500, message: "서버 오류" });
  }
};