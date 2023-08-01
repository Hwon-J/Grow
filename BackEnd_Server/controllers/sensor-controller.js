const Sensor = require("../models/sensor-model.js");
const connection = require("../util/connection.js");

exports.insertSensorData = async (req, res, next) => {
  var today = new Date();
  console.log(
    `sensorController insertSensorData called. serial: ${req.body.serial_number} (${today})`
  );
  try {
    const { serial_number: serial, temperture, moisture, light } = req.body;
    console.log(serial);

    // 데이터베이스에서 시리얼에 해당하는 식물 번호 조회
    let query =
      "select plant.index as index from `plant` join `pot` on plant.pot_index = pot.index where pot.serial_number=?";

    connection.query(query, [serial.number], (error, result) => {
      if (error) {
        console.log("시리얼 넘버 조회중 데이터베이스 에러 발생");
        throw error;
      }

      // 시리얼 넘버 유효 체크
      if (result.length == 0) {
        res
          .status(202)
          .json({ message: "사용중이지 않거나 유효하지 않은 시리얼 넘버" });
      } else {
        // 해당하는 식물 번호가 존재하면, 그 식물 번호에 해당하는 센서값 등록
        query =
          "insert into `plant_condition`(plant_index, temperture, moisture, light) values (?, ?, ?, ?)";
        connection.query(
          query,
          [result[0].index, temperture, moisture, light],
          (error, result) => {
            if (error) {
              console.log("센서값 등록중 데이터베이스 에러 발생");
              res.status(202).json({ message: "등록 실패" });
            }

            res.status(201).json({ message: "등록 성공" });
          }
        );
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};
