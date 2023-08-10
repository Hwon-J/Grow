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

// const queryPromise = util.promisify(connection.query).bind(connection);
const queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// 시리얼 넘버 확인하기
const checkSerial = async (serial) => {
  winston.info(`checkSerial called. serial: ${serial}`);
  let sql = "select pot.member_index, character_number as cnum from `pot` join `plant` on pot.index = plant.pot_index where `serial_number`=?";

  try {
    let result = await queryPromise(sql, [serial]);

    if (result.length == undefined || result.length === 0) {
      return "not exist";
    } else if (result[0].member_index == null) {
      return "unregistered";
    }
    return result[0].cnum;
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

const setCnum = async (serial, cnum) => {
  winston.info(`setCnum called. serial: ${serial}, cnum: ${cnum}`);
  let sql = "select plant.index as \`index\` from `pot` join `plant` on pot.index = plant.pot_index where `serial_number`=?";

  try {
    let result = await queryPromise(sql, [serial]);

    if (result.length == undefined || result.length === 0) {
      winston.info(`error occured in setCnum: not exist`);
      return;
    } else if (result[0].index == null) {
      winston.info(`error occured in setCnum: unregistered`);
      return;
    }
    let index = result[0].index;
    sql = `update plant set character_number = ? where \`index\` = ?`
    await queryPromise(sql, [cnum, index]);
    winston.info(`update completed in setCnum`);
  } catch (error) {
    winston.error(error);
    return;
  }
}

// 최신 채팅로그를 가져오기
const getRecentChatLog = async (serial) => {
  winston.info(`getRecentChatLog called. serial: ${serial}`);
  try {
    let sql = `select plant.index as pindex from pot join plant on pot.index = plant.pot_index where pot.serial_number = ?`;
    let result = await queryPromise(sql, [serial]);
    if (result.length === 0) {
      winston.info(`something wrong happened... there is no plant that pot's serial number is ${serial}`);
      return [];
    }

    sql = `SELECT \`role\`, \`content\`
    FROM chat_log
    WHERE plant_index = ? AND chatted_date >= NOW() - INTERVAL 3 HOUR
    ORDER BY chatted_date DESC
    LIMIT 16;`;
    result = await queryPromise(sql, [result[0].pindex]);

    // 만약 result가 홀수길이라면 하나 땜
    if (result.length %2 === 1){
      result.pop();
    }

    // result를 역순으로 바꾸면서 raw한 json 배열로 바꿈
    let reversed = [];
    for(let i = result.length-2; i>=0; i = i-2){
      reversed.push({"role":result[i].role, "content":result[i].content});
      reversed.push({"role":result[i+1].role, "content":result[i+1].content});
    }
    return reversed;
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

// 사용자의 입력과 gpt의 대답을 기록하기
const saveChatLog = async (log) => {
  winston.info(`saveChatLog called. serial: ${log.serial}, role: ${log.role}`);
  try {
    let sql = `select plant.index as pindex from pot join plant on pot.index = plant.pot_index where pot.serial_number = ?`;
    let result = await queryPromise(sql, [log.serial]);
    if (result.length === 0) {
      winston.info(`something wrong happened in saveChatLog... there is no plant that pot's serial number is ${log.serial}`);
      return -1;
    }

    sql =
      "insert into `chat_log` (`plant_index`, `role`, `content`) values (?, ?, ?)";
    result = await queryPromise(sql, [result[0].pindex, log.role, log.content]);

    if (result.affectedRows === 0) {
      winston.info("something wrong happened in saveChatLog... insert does not run normally");
      return -1;
    }
    
    winston.info(`Successfully saveChatLog completed. insertId: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    winston.error(error);
    return -1;
  }
};

// 식물 상황 받아오기
const getCondition = async (plantIndex) => {
  winston.info(`getCondition called. plantIndex: ${plantIndex}`);
  try {
    let sql =
      "select * from `plant_condition` where `plant_index` = ? order by `measurement_date` desc limit 1";

    let result = await queryPromise(sql, [plantIndex]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

// 식물 물준 기록 받아오기
const getWaterLog = async (plantIndex) => {
  winston.info(`getWaterLog called. plantIndex: ${plantIndex}`);
  try {
    let sql = "select * from `water_log` where plant_index = ? order by watered_date desc limit 1";
    let result = await queryPromise(sql, [plantIndex]);
    return result[0];
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

// 식물 종의 정보 받아오기
const getPlantInfoByIndex = async (index) => {
  winston.info(`getPlantInfoByIndex called. index: ${index}`);
  try {
    let sql = "select * from `plant_info` where index = ?";

    let result = await queryPromise(sql, [index]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

// 1. 시리얼을 받는다.
// 2. 해당 시리얼의 식물 데이터를 받아온다
// 3. 해당 식물 종류의 데이터를 받는다
// 4. 식물 인덱스에 해당하는 최신 센서 데이터를 받는다.
// 5. 식물 종류 데이터와 비교하여, 좋음/나쁨 등으로 치환하여 반환한다.
const getConditionGoodOrBad = async (serial) => {
  winston.info(`getConditionGoodOrBad called. serial: ${serial}`);
  try {
    let sql = `select *, plant.index as pindex
    from \`pot\` join \`plant\` on pot.index = plant.pot_index 
    join plant_info on plant.plant_info_index = plant_info.index
    where serial_number = ?`;

    let result = await queryPromise(sql, [serial]);
    if (result.length == 0) {
      winston.info(`getConditionGoodOrBad returned "no data"`);
      return "no data";
    }
    let limitData = result[0];
    let lightMsg = null;
    let moistureMsg = null;
    let temperatureMsg = null;
    let waterMsg = null;

    // 최신 센서 데이터 가져오기
    sql = `select * from plant_condition where plant_index = ?`;
    result = await queryPromise(sql, [limitData.pindex]);
    let light = result[0].light;
    let moisture = result[0].moisture;
    let temperature = result[0].temperature;

    // 조도 상황 확인
    if (limitData.light_upper === null) {
      limitData.light_upper = 1_000_000_000;
    }
    if (limitData.light_lower === null) {
      limitData.light_lower = 0;
    }
    if (light < limitData.light_lower) {
      lightMsg = "부족";
    } else if (light < limitData.light_upper) {
      lightMsg = "적당";
    } else {
      lightMsg = "과다";
    }

    // 수분량 상황 확인
    if (limitData.moisture_upper === null) {
      limitData.moisture_upper = 1_000_000_000;
    }
    if (limitData.moisture_lower === null) {
      limitData.moisture_lower = 0;
    }
    if (moisture < limitData.moisture_lower) {
      moistureMsg = "부족";
    } else if (moisture < limitData.moisture_upper) {
      moistureMsg = "적당";
    } else {
      moistureMsg = "과다";
    }

    // 온도 상황 확인
    if (limitData.temperature_upper === null) {
      limitData.temperature_upper = 1_000_000_000;
    }
    if (limitData.temperature_lower === null) {
      limitData.temperature_lower = 0;
    }
    if (temperature < limitData.temperature_lower) {
      temperatureMsg = "부족";
    } else if (temperature < limitData.temperature_upper) {
      temperatureMsg = "적당";
    } else {
      temperatureMsg = "과다";
    }

    // 물 주는 주기 확인
    if (limitData.max_water_period === null) {
      limitData.max_water_period = 3;
    }
    // 현재 날짜와 최근 물 준 날짜의 차이가 limitData.max_water_period보다 크면 passed 반환
    let water = getWaterLog(limitData.pindex);
    const currentDate = new Date();
    const wateredDateTime = new Date(water.wateredDate);
  
    // milliseconds로 계산된 날짜 차이를 일(day) 단위로 변환
    const differenceInDays = Math.floor((currentDate - wateredDateTime) / (1000 * 60 * 60 * 24));
    const maxWaterInDays = Math.floor(new Date(limitData.max_water_period) / (1000 * 60 * 60 * 24));
  
    if (differenceInDays > maxWaterInDays) {
      waterMsg = "passed";
    } else {
      waterMsg = "not passed";
    }

    winston.info(
      `getConditionGoodOrBad returned ${lightMsg}, ${moistureMsg}, ${temperatureMsg}, ${temperature}, ${waterMsg}`
    );
    return {
      light: lightMsg,
      moisture: moistureMsg,
      temperature: temperatureMsg,
      temperValue: temperature,
      water: waterMsg
    };
  } catch (error) {
    winston.error(error);
    return "error";
  }
};

// 부모님의 랜덤질문과 랜덤 접속사 가져오기
const addRandomQuestion = async (serial) => {
  winston.info(`addRandomQuestion called. serial: ${serial}`);
  try {
    // 랜덤 접속사 가져오기
    let sql = `SELECT * FROM conjunction
    ORDER BY RAND()
    LIMIT 1`;
    let result = await queryPromise(sql, []);
    let conjunction = result[0].content;

    //랜덤 질문 가져오기
    sql = `select question.content as content, question.index as \`index\` from 
    pot join plant on pot.index = plant.pot_index 
    join question on plant.index = question.plant_index
    where pot.serial_number = ? and question.completed = 0
    ORDER BY RAND() LIMIT 1`;
    result = await queryPromise(sql, [serial]);
    let question = result[0].content;
    let index =  result[0].index;

    winston.info(`addRandomQuestion returned. {"index":${index}, "result":"${conjunction}, ${question}"}`);
    // 객체로 내보내기
    return {"index":index, "result":`${conjunction}, ${question}`};
  } catch (error) {
    winston.error(error);
    return {"index":-1, "result":"error"};
  }
};

const getplantinfo = async (serial) => {
  winston.info(`getkidsname called. serial: ${serial}`);
  try {
    let sql =
      "select *, plant.index as pindex from `plant` join pot on plant.pot_index = pot.index where `pot_index` = ?";

    let result = await queryPromise(sql, [serial]);
    return result;
  } catch (error) {
    winston.error(error);
    return "error";
  }
}

// 1. 주어진 질문의 index를 기반으로 질문 테이블에 채팅로그 인덱스와 채팅한 시간을 업데이트 한다.
// 2. 파일을 ec2 s3 서버에 저장한다. 파일이름은 "answer_[question의 인덱스]"으로 한다.
// 3. 반환된 주소를 질문 테이블에 업데이트 한다.
const saveChildAnswer = async(qindex, cindex) => {
  winston.info(`saveChildAnswer called. qindex: ${qindex}, cindex: ${cindex}`);
  let sql = `update question set chat_log_index = ?, completed_date = now() where \`index\` = ?`;
  try {
    // 트랜잭션 시작
    await queryPromise("START TRANSACTION");
    // 업데이트 개시
    await queryPromise(sql, [cindex, qindex]);
    
    // 파일 저장

    // 질문 테이블 업데이트

    // 트랜잭션을 커밋
    await queryPromise("COMMIT");

    winston.info(`Successfully saveChildAnswer completed.`);
    return;
  } catch (error) {
    winston.error(error);
    return;
  }
};

module.exports = {
  connection,
  checkSerial,
  setCnum,
  getRecentChatLog,
  saveChatLog,
  getCondition,
  getWaterLog,
  getPlantInfoByIndex,
  getConditionGoodOrBad,
  addRandomQuestion,
  getplantinfo,
  saveChildAnswer
};
