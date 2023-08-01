const WebSocket = require("ws");
const gpt = require("./util/call-gpt");
// const dbConnection = require("./util/db.js");
const deleteEmoji = require("./util/delete-emoji");
require("dotenv").config();

const wss = new WebSocket.Server({ port: process.env.PORT });

// IP를 key로, 웹소켓 배열을 value로 갖는 Map
let clients = [];

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
  const history = [];
  // system 프롬프트 입력
  history.push({
    role: "system",
    content: `지금부터 너는 7살정도의 아이가 키우고 있는 화분속의 방울토마토 묘종이다. 너는 아이가 키우고 있는 식물의 입장에서 아이들과 대화를 하는 에이전트가 되어야 한다. 대화는 engaging해야 하며, 아이들도 이해할 수 있도록 쉬운 언어로 구성되어야 한다.  또한, 객관적인 정보의 전달은 최대한 억제하고, 감성적인 언어를 주로 사용하며, 대답의 길이는 최대 3줄까지만 하라. 내 입력은 아이가 너에게 하는 말이라고 생각하고 답변을 작성하라. 만약 내 입력 뒤에 괄호가 있다면, 그 내용은 아이의 말이 아니라 현재의 상황설명이다. 너의 답변에는 괄호가 있을 필요는 없다.`,
  });

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
  console.log(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송(현재는 생략됨)
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", (msg) => {
    let msgJson = JSON.parse(msg);
    console.log(
      `message from client[${ip}]:${msgJson.role}, ${msgJson.message}, ${msgJson.number}`
    );

    if (msgJson.role == "gpt") {
      // 히스토리에 유저의 답변 저장
      history.push({
        role: "user",
        content: msgJson.message,
      });
      // 1. gpt에게 답변을 받는다.
      // 2. count를 1증가 시킨다.
      // 3. gpt의 답변 맨 마지막에 ?가 들어 있으면 count를 다시 1 감소 시킨다.
      // 4. count가 randomPoint와 같아졌다면, db를 통해 무작위
      (async () => {
        let result = await gpt(history);
        // 답변속 이모지 제거
        result = deleteEmoji(result);
        // 답변 저장
        history.push({
          role: "assistant",
          content: result,
        });

        count = count + 1;
        if (count >= randomPoint) {
          if (result.charAt(result.length - 1) == "?") {
            count = count - 1;
          } else {
          }
        }

        console.log(`gpt answer: ${result}`);
        // ws.send(`gpt answer: ${result}`);
        // IP가 '특정 IP'인 클라이언트들에게 메시지를 전송
        // if (clients.has(ip)) {
        //   clients.get(ip).forEach((client) => {
        //     if (client.readyState === WebSocket.OPEN) {
        //       client.send(`gpt answer: ${result}`);
        //     }
        //   });
        // }
        clients.forEach((client) => {
          if (client.number === ws.number && client.readyState === WebSocket.OPEN) {
            client.send(`gpt answer: ${result}`);
          }
        });
      })();
    } else if (msgJson.role == "handshake") {
      ws.number = msgJson.number;
      clients.push(ws);
    } else {
      ws.send("error: role needed");
    }
  });

  // 4. 에러 처리
  ws.on("error", (error) => {
    console.log(`error occured from client[${ip}]: ${error}`);
  });

  // 5. 연결 종료 이벤트 처리
  ws.on("close", () => {
    // 클라이언트 연결이 닫히면 해당 웹소켓을 배열에서 제거
    clients = clients.filter((client) => client !== ws);
    console.log(`client[${ip}] connection closed`);
  });

  // ws.send("Hello! I am a WebSocket server.");
});

console.log("WebSocket server started on port 30002.");