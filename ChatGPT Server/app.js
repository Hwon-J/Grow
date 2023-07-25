const WebSocket = require("ws");
const gpt = require("./call-gpt");

const wss = new WebSocket.Server({ port: 30002 });

// IP를 key로, 웹소켓 배열을 value로 갖는 Map
let clients = new Map();

wss.on("connection", (ws, req) => {
  // 1. 연결 클라이언트 IP 취득
  const ip = req.headers["x-forwarded"] || req.socket.remoteAddress;
  // 만약 이미 해당 IP의 클라이언트가 있다면
  if (clients.has(ip)) {
    // 해당 IP의 웹소켓 배열에 새로운 웹소켓을 추가
    clients.get(ip).push(ws);
  } else {
    // 처음 보는 IP라면 새 배열을 만들고 그 배열에 웹소켓을 추가
    clients.set(ip, [ws]);
  }
  console.log(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송(현재는 생략됨)
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", (msg) => {
    let msgJson = JSON.parse(msg);
    console.log(
      `message from client[${ip}]: ${msgJson.message}, ${msgJson.number}`
    );

    (async () => {
      const result = await gpt(msgJson.message);

      // IP가 '특정 IP'인 클라이언트들에게 메시지를 전송
      if (clients.has(ip)) {
        clients.get(ip).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }

      console.log(`gpt answer: ${result}`);
      ws.send(`gpt answer: ${result}`);
    })();
  });

  // 4. 에러 처리
  ws.on("error", (error) => {
    console.log(`error occured from client[${ip}]: ${error}`);
  });

  // 5. 연결 종료 이벤트 처리
  ws.on("close", () => {
    // 클라이언트 연결이 닫히면 해당 웹소켓을 배열에서 제거
    clients.set(
      ip,
      clients.get(ip).filter((socket) => socket !== ws)
    );
    // 배열에 웹소켓이 하나도 없다면
    if (clients.get(ip).length === 0) {
      // 해당 IP를 Map에서 제거
      clients.delete(ip);
    }
    console.log(`client[${ip}] connection closed`);
  });

  // ws.send("Hello! I am a WebSocket server.");
});

console.log("WebSocket server started on port 30002.");
