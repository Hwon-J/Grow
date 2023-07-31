const Pot = require("../models/pot-model.js");
const connection = require("../config/connection.js");

exports.checkSerial = async (req, res, next) => {
  var today = new Date();
  console.log(`potController checkSerial called. serial: ${req.params} (${today})`);
  try {
    let serial = req.params;
    console.log(serial);

    // 데이터베이스에서 멤버 조회
    let query = "select * from `pot` where `serial_number`=?";

    await connection.query(query, [serial.number], (error, result) => {
      if (error) {
        console.log("에러발생!!");
        throw error;
      }

      // 시리얼 넘버 유효 체크
      if (result.length == 0) {
        return res.status(202).json({message: "존재하지 않는 시리얼 넘버" });
      }

      // 시리얼 넘버 사용 여부 체크
      if (result[0].member_index === null) {
        res.status(200).json({ message: "사용 가능한 시리얼 넘버" });
      } else {
        res.status(202).json({message: "이미 사용한 시리얼 넘버" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "서버 오류" });
  }
};
