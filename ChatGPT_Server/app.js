const WebSocket = require("ws");
const gpt = require("./util/call-gpt.js");
const db = require("./util/db.js");
const stringPurify = require("./util/string-purifier.js");
const winston = require("./util/winston.js");
require("dotenv").config();

const wss = new WebSocket.Server({ port: process.env.PORT });

// IP를 key로, 웹소켓 배열을 value로 갖는 Map
let clients = [];

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

wss.on("connection", (ws, req) => {
  // 부모님이 설정한 대화를 나누기 위한 프리셋 부분
  // 대화를 나눈 횟수
  let count = 0;
  // 부모님 설정 대화를 꺼낼 랜덤 값. count가 이 값과 같아지면 부모님 질문을 끼워 넣음
  let randomPoint =
    Math.floor(
      Math.random() * (process.env.RANDOM_MAX - process.env.RANDOM_MIN)
    ) + process.env.RANDOM_MIN;

  // 현재까지 해당 ip에서 나눈 대화기록
  let history = [];
  // system 프롬프트 입력
  // history.push({
  //   role: "system",
  //   content: `지금부터 너는 7살정도의 아이가 키우고 있는 화분속의 방울토마토 묘종이다. 너는 아이가 키우고 있는 식물의 입장에서 아이들과 대화를 하는 에이전트가 되어야 한다. 대화는 engaging해야 하며, 아이들도 이해할 수 있도록 쉬운 언어로 구성되어야 한다.  또한, 객관적인 정보의 전달은 최대한 억제하고, 감성적인 언어를 주로 사용하며, 대답의 길이는 최대 3줄까지만 하라. 내 입력은 아이가 너에게 하는 말이라고 생각하고 답변을 작성하라. 만약 내 입력 뒤에 괄호가 있다면, 그 내용은 아이의 말이 아니라 현재의 상황설명이다. 너의 답변에는 괄호가 있을 필요는 없다.`,
  // });
  let systemContent = {
    role: "system",
    content: `지금부터 너는 7살정도의 아이가 키우고 있는 화분속의 방울토마토 묘종이다. 너는 아이가 키우고 있는 식물의 입장에서 아이들과 대화를 하는 에이전트가 되어야 한다. 대화는 engaging해야 하며, 아이들도 이해할 수 있도록 쉬운 언어로 구성되어야 한다.  또한, 객관적인 정보의 전달은 최대한 억제하고, 감성적인 언어를 주로 사용하며, 대답의 길이는 최대 3줄까지만 하라. 내 입력은 아이가 너에게 하는 말이라고 생각하고 답변을 작성하라. 만약 내 입력 뒤에 괄호가 있다면, 그 내용은 아이의 말이 아니라 현재의 상황설명이다. 너의 답변에는 괄호가 있을 필요는 없다.`,
  }

  // 10초에 한번씩 센서의 데이터를 디스플레이 클라이언트로 보내는 부분
  setInterval(sendSensorData, 10000);

  // 1. 연결 클라이언트 IP 취득
  const ip = req.headers["x-forwarded"] || req.socket.remoteAddress;
  // // 만약 이미 해당 IP의 클라이언트가 있다면
  // if (clients.has(ip)) {
  //   // 해당 IP의 웹소켓 배열에 새로운 웹소켓을 추가
  //   clients.get(ip).push(ws);
  // } else {
  //   // 처음 보는 IP라면 새 배열을 만들고 그 배열에 웹소켓을 추가
  //   clients.set(ip, [ws]);
  // }
  winston.info(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송(현재는 생략됨)
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", async (msg) => {
    // 히스토리 없는 형태로 진행중
    // history = [
    //   {
    //     role: "system",
    //     content: `지금부터 너는 7살정도의 아이가 키우고 있는 화분속의 방울토마토 묘종이다. 너는 아이가 키우고 있는 식물의 입장에서 아이들과 대화를 하는 에이전트가 되어야 한다. 대화는 engaging해야 하며, 아이들도 이해할 수 있도록 쉬운 언어로 구성되어야 한다.  또한, 객관적인 정보의 전달은 최대한 억제하고, 감성적인 언어를 주로 사용하며, 대답의 길이는 최대 3줄까지만 하라. 내 입력은 아이가 너에게 하는 말이라고 생각하고 답변을 작성하라. 만약 내 입력 뒤에 괄호가 있다면, 그 내용은 아이의 말이 아니라 현재의 상황설명이다. 너의 답변에는 괄호가 있을 필요는 없다.`,
    //   },
    // ];

    let msgJson = JSON.parse(msg);
    winston.info(
      `message from client[${ip}]:${msgJson.purpose}, ${msgJson.role}, ${msgJson.content}, ${msgJson.serial}`
    );

    // 클라이언트의 메세지가 핸드셰이크인 경우
    // 연결 후 클라이언트는 첫 메세지로 핸드셰이크를 보낸다
    if (msgJson.purpose == "handshake") {
      let result = await db.checkSerial(msgJson.serial);

      if (result === "ok") {
        winston.info(
          "success: Successfully connection to the server. (IP: " + ip + ")"
        );
        ws.send(
          JSON.stringify({
            about: "serialCheck",
            content: "success",
          })
        );
      } else {
        // 핸드셰이크 과정에서 유효하지 않은 시리얼을 보냈다면 강제로 끊는다.
        // 등록되지 않은 시리얼인 경우
        if (result === "unregistered") {
          winston.info(
            "fail: Unregistered serial number. Please check again. (IP: " +
              ip +
              ")"
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
            "fail: a non-existent serial number. Please check again. (IP: " +
              ip +
              ")"
          );
          ws.send(
            JSON.stringify({
              about: "serialCheck",
              content: "not exist",
            })
          );
          // 그 이외의 에러처리
        } else {
          winston.info("fail: Error occured in handshake. (IP: " + ip + ")");
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
      let history = [systemContent];
      let chatLog = await db.getRecentChatLog(msgJson.serial);
      history.push(...chatLog);

      // DB에 유저의 입력 저장
      winston.info(
        await db.saveChatLog({
          serial: msgJson.serial,
          role: "user",
          content: msgJson.content,
        })
      );

      // 히스토리에 유저의 답변 저장
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
        if (count >= randomPoint) {
          if (result.charAt(result.length - 1) == "?") {
            count = count - 1;
          } else {
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
        // 답변 히스토리에 저장
        // history.push({
        //   role: "assistant",
        //   content: result,
        // });

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
    } else {
      ws.send(JSON.stringify({about:"error", content: "purpose needed or purpose gpt need content"}));
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
