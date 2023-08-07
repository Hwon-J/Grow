const maria = require("mysql");
const winston = require("./winston.js");
const util = require("util");

const connection = maria.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// MariaDB connection 실행
connection.connect((error) => {
  if (error) throw error;
  winston.info("Successfully connected to the database.");
});

const query = util.promisify(connection.query).bind(connection);

// 시리얼 넘버 확인하기
const checkSerial = async (serial) => {
  winston.info(`checkSerial called. serial: ${serial}`);
  let sql = "select * from `pot` where `serial_number`=?";

  try {
    let result = await query(sql, [serial]);

    if (result.length == undefined || result.length === 0) {
      return "not exist";
    } else if (result[0].member_index == null) {
      return "unregistered";
    }
    return "ok";
  } catch (error) {
    winston.error(error);
    return "error";
  }

  // connection.query(query, [serial], (error, result) => {
  //   console.log(result);
  //   console.log(error);
  //   if (result.length == undefined || result.length === 0) {
  //     return "not exist";
  //   } else if (result[0].member_index == null) {
  //     return "unregistered";
  //   } else if (error) {
  //     winston.error(error);
  //     return "error";
  //   }
  //   return "ok";
  // });
};

// 사용자의 입력과 gpt의 대답을 기록하기
const saveChatLog = async (log) => {
  winston.info(
    `saveChatLog called. plantIndex: ${log.plantIndex}, role: ${log.role}`
  );
  winston.info(`content: ${log.content}`);
  try {
    let sql =
      "insert into `chat_log` (`plant_index`, `role`, `content`) values (?, ?, ?)";
    let result = await query(sql, [log.plantIndex, log.role, log.content]);

    if (result === 0) {
      return "something wrong happened...";
    }
    return "ok";
  } catch (error) {
    winston.error(error);
    return "error";
  }

  // connection.query(query, [log.plantIndex, log.role, log.content], (error, result) => {
  //   if (error) {
  //     winston.error(error);
  //     return "error";
  //   }
  //   return "ok";
  // });
};

// 식물 상황 받아오기
const getCondition = async (plantIndex) => {
  winston.info(`getCondition called. plantIndex: ${plantIndex}`);
  try {
    let sql =
      "select * from `plant_condition` where `plant_index` = ? order by `measurement_date` desc limit 1";

    let result = await query(sql, [plantIndex]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }

  // connection.query(query, [plantIndex], (error, result) => {
  //   if (error) {
  //     winston.error(error);
  //     return "error";
  //   }
  //   return result;
  // });
};

// 식물 물준 기록 받아오기
const getWaterLog = async (plantIndex) => {
  winston.info(`getWaterLog called. plantIndex: ${plantIndex}`);
  try {
    let sql = "select * from `water_log` where plant_index = ?";
    let result = await query(sql, [plantIndex]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }

  // connection.query(query, [plantIndex], (error, result) => {
  //   if (error) {
  //     winston.error(error);
  //     return "error";
  //   }
  //   return result;
  // });
};

// 식물 종의 정보 받아오기
const getPlantInfoByIndex = async (index) => {
  winston.info(`getPlantInfoByIndex called. index: ${index}`);
  try {
    let sql = "select * from `plant_info` where index = ?";

    let result = await query(sql, [index]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }

  // connection.query(query, [index], (error, result) => {
  //   if (error) {
  //     winston.error(error);
  //     return "error";
  //   }
  //   return result;
  // });
};

// 1. 시리얼을 받는다.
// 2. 해당 시리얼의 식물 데이터를 받아온다
// 3. 해당 식물 종류의 데이터를 받는다
// 4. 식물 인덱스에 해당하는 최신 센서 데이터를 받는다.
// 5. 식물 종류 데이터와 비교하여, 좋음/나쁨 등으로 치환하여 반환한다.
const getConditionGoodOrBad = async (serial) => {
  winston.info(`getPlantInfoByIndex called. index: ${index}`);
  try {
    let sql = "select * from `plant_info` where index = ?";

    let result = await query(sql, [index]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

module.exports = {
  connection,
  checkSerial,
  saveChatLog,
  getCondition,
  getWaterLog,
  getPlantInfoByIndex,
  getConditionGoodOrBad
};
