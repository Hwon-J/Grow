const WebSocket = require("ws");
const Queue = require("./util/queue.js");
const gpt = require("./util/call-gpt.js");
const db = require("./util/db.js");
const stringPurify = require("./util/string-purifier.js");
const winston = require("./util/winston.js");
require("dotenv").config();

const wss = new WebSocket.Server({ port: process.env.PORT });

// IP를 key로, 웹소켓 배열을 value로 갖는 Map
let clients = [];

// 센서의 데이터를 디스플레이 클라이언트로 보내는 부분
function sendSensorData() {
  clients.forEach(async (client) => {
    if (client.role === "display" && client.readyState === WebSocket.OPEN) {
      let content = await db.getConditionGoodOrBad(client.serial);
      client.send(
        JSON.stringify({
          about: "sensor",
          content: content,
        })
      );
    }
  });
}

// 위 함수를 10초에 한번씩 실행
setInterval(sendSensorData, 10000);

wss.on("connection", (ws, req) => {
  // 부모님이 설정한 대화를 나누기 위한 프리셋 부분
  // 대화를 나눈 횟수
  let count = 0;
  // 부모님 설정 대화를 꺼낼 랜덤 값. count가 이 값과 같아지면 부모님 질문을 끼워 넣음
  let randomPoint =
    Math.floor(
      Math.random() * (process.env.RANDOM_MAX - process.env.RANDOM_MIN)
    ) + process.env.RANDOM_MIN;

  // 부모님 질문이 포함된 대화의 인덱스를 저장할 큐
  const indexQueue = new Queue();
  // 다음 사용자의 입력은 질문에 대한 대답이라는 플래그
  let qFlag = false;

  // 1. 연결 클라이언트 IP 취득
  const ip = req.headers["x-forwarded"] || req.socket.remoteAddress;
  winston.info(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송(현재는 생략됨)
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", async (msg) => {
    let msgJson = JSON.parse(msg);
    winston.info(
      `message from client[${ip}]:${msgJson.purpose}, ${msgJson.role}, ${msgJson.content}, ${msgJson.serial}`
    );

    // 클라이언트의 메세지가 핸드셰이크인 경우
    // 연결 후 클라이언트는 첫 메세지로 핸드셰이크를 보낸다
    if (msgJson.purpose == "handshake") {
      let result = await db.checkSerial(msgJson.serial);

      // 성공시엔 숫자를 content로 보냄
      if (typeof result === "number") {
        winston.info(
          `success: Successfully connection to the server. (IP: ${ip})`
        );
        ws.send(
          JSON.stringify({
            about: "serialCheck",
            content: result,
          })
        );
      } else {
        // 핸드셰이크 과정에서 유효하지 않은 시리얼을 보냈다면 강제로 끊는다.
        // 등록되지 않은 시리얼인 경우
        if (result === "unregistered") {
          winston.info(
            `fail: Unregistered serial number. Please check again. (IP: ${ip})`
          );
          ws.send(
            JSON.stringify({
              about: "serialCheck",
              content: "unregistered",
            })
          );
          // 존재하지 않는 시리얼인 경우
        } else if (result === "not exist") {
          winston.info(
            `fail: a non-existent serial number. Please check again. (IP: ${ip})`
          );
          ws.send(
            JSON.stringify({
              about: "serialCheck",
              content: "not exist",
            })
          );
          // 그 이외의 에러처리
        } else {
          winston.info(`fail: Error occured in handshake. (IP: ${ip}`);
          ws.send(
            JSON.stringify({
              about: "serialCheck",
              content: "error",
            })
          );
        }

        ws.close();
      }

      // clients에 시리얼 넘버와 디스플레이/라즈베리를 엮어서 저장
      ws.serial = msgJson.serial;
      ws.role = msgJson.role;
      clients.push(ws);

      // purpose가 gpt이며, undefined, null, ""가 아닌 경우
    } else if (
      msgJson.purpose === "gpt" &&
      msgJson.content !== undefined &&
      msgJson.content !== null &&
      msgJson.content !== ""
    ) {
      let condition = await db.getConditionGoodOrBad(msgJson.serial);
      let dbplant = await db.getplantinfo(msgJson.serial);
      let waterlog = await db.getWaterLog(dbplant.pindex);
      if (waterlog === undefined || waterlog.watered_date === null || waterlog.watered_date === undefined){
        waterlog = { watered_date: "아직 없음"};
      }
      let plantinfo = await db.getPlantInfoByIndex(dbplant.plant_info_index);
      let systemContent = {
        role: "system",
        content: `지금부터 너는 어린 사람 아이가 키우고 있는 식물이다. 너는 이 아이의 친구가 되어 아이와 쉬운 언어로 대화를 나누어야 한다. 객관적인 정보 전달은 최대한 줄이고, 감성적인 언어를 사용해야 한다. 대답은 최대 30자까지만 해야 하며, [] 안의 정보와 {}로 구분된 각 정보에 대한 설명을 참고하여 대화하라. 너는 식물임에도 불구하고 [] 안의 정보들을 알고 있다. 대화에 []안의 정보들이 필요하다면 []안의 정보들을 잘 살펴보고 대화하라. 높임말은 쓰지 말고 반말로 대화하라
    
    [
      아이의 이름: ${dbplant.child_name}
      아이의 나이: ${dbplant.child_age}
      현재시간: ${new Date().toISOString()}
      식물이 심어진 날짜: ${dbplant.start_date}
      마지막으로 물을 준 시간: ${waterlog.watered_date}
      온도: ${condition.temperature}
      조도: ${condition.light}
      토양의 습도: ${condition.moisture}
      식물종: ${plantinfo.species}
      식물의 물주는 주기: ${plantinfo.max_water_period}일
    ]
    {
    아이의 이름:  아이의 이름
    아이의 생년월일: 아이가 태어난 날짜
    현재시간: 현재 시간
    식물이 심어진 날짜: 너가 심어진 날짜
    마지막으로 물을 준 시간: 마지막 물을 준 시간
    온도: 현재 온도
    조도: 조도 (어두움, 보통, 밝음 중 하나). 낮에 어두우면 화분을 밝은 곳으로 옮기게 유도
    토양의 습도: 토양의 습도 (건조함, 보통, 촉촉함 중 하나)
    식물종: 너가 어떤 식물인지
    식물의 물주는 주기: 물을 주어야 하는 주기
    }
    `,
      };
      let history = [systemContent];
      let chatLog = await db.getRecentChatLog(msgJson.serial);
      history.push(...chatLog);

      // DB에 유저의 입력 저장
      let insertIndex = await db.saveChatLog({
        serial: msgJson.serial,
        role: "user",
        content: msgJson.content,
      });
      // 만약 qflag가 true라면 큐의 헤드에 있는 인덱스로 답변을 저장한다.
      if (qFlag & insertIndex !== -1) {
        await db.saveChildAnswer(indexQueue.dequeue(), insertIndex);
        qFlag = false;
      }

      // 히스토리에 유저의 입력 저장
      history.push({
        role: "user",
        content: msgJson.content,
      });

      // 1. gpt에게 답변을 받는다.
      // 2. count를 1증가 시킨다.
      // 3. gpt의 답변 맨 마지막에 ?가 들어 있으면 count를 다시 1 감소 시킨다.
      // 4. count가 randomPoint와 같아졌다면, db를 통해 무작위 질문을 붙인다.
      (async () => {
        let result = await gpt(history);
        // 답변속 이모지 제거
        result = stringPurify(result);

        // 부모님 질문 붙이기
        count = count + 1;
        winston.info(`current count: ${count}.......`);
        if (count >= randomPoint) {
          if (result.includes("?")) {
            count = count - 1;
          } else {
            let question = await db.addRandomQuestion(msgJson.serial);
            indexQueue.enqueue(question.index);
            result = result + question.result;
            qFlag = true;
          }
        }
        // 답변 DB에 저장
        winston.info(
          await db.saveChatLog({
            serial: msgJson.serial,
            role: "assistant",
            content: result,
          })
        );

        winston.info(`gpt answer: ${result}`);
        clients.forEach((client) => {
          if (
            client.serial === ws.serial &&
            client.readyState === WebSocket.OPEN
          ) {
            let answer = { about: "gpt", content: result };
            client.send(JSON.stringify(answer));
          }
        });
      })();

      // 사용자가 가까이 왔다는 메세지의 처리
    } else if (msgJson.purpose === "closer") {
      winston.info(`"closer" accepted from ${ws.serial}`);
      clients.forEach((client) => {
        if (
          client.role === "display" &&
          client.serial === msgJson.serial &&
          client.readyState === WebSocket.OPEN
        ) {
          winston.info(`send "closer" to ${client.serial}, ${client.role}`);
          client.send(JSON.stringify({ about: "closer" }));
        }
      });

      // 사용자가 떨어졌다는 메세지의 처리
    } else if (msgJson.purpose === "further") {
      winston.info(`"further" accepted from ${ws.serial}`);
      clients.forEach((client) => {
        if (
          client.role === "display" &&
          client.serial === msgJson.serial &&
          client.readyState === WebSocket.OPEN
        ) {
          winston.info(`send "further" to ${client.serial}, ${client.role}`);
          client.send(JSON.stringify({ about: "further" }));
        }
      });

      // 사용자가 캐릭터를 정했다는 메세지의 처리
    } else if (msgJson.purpose === "character") {
      db.setCnum(msgJson.serial, msgJson.content);

      // 그 이외는 에러처리
    } else {
      ws.send(
        JSON.stringify({
          about: "error",
          content: "purpose needed or purpose gpt need content",
        })
      );
    }
  });

  // 4. 에러 처리
  ws.on("error", (error) => {
    winston.info(`error occured from client[${ip}]: ${error}`);
  });

  // 5. 연결 종료 이벤트 처리
  ws.on("close", () => {
    // 클라이언트 연결이 닫히면 해당 웹소켓을 배열에서 제거
    clients = clients.filter((client) => client !== ws);
    winston.info(`client[${ip}] connection closed`);
  });
});

winston.info(`WebSocket server started on port ${process.env.PORT}.`);
