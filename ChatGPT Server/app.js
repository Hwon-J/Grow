const WebSocket = require("ws");
const gpt = require("./callGpt");

const wss = new WebSocket.Server({ port: 30002 });

wss.on("connection", (ws, req) => {
  // 1. 연결 클라이언트 IP 취득
  const ip = req.headers["x-forwarded"] || req.socket.remoteAddress;
  console.log(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", (msg) => {
    let msgJson = JSON.parse(msg);
    console.log(`message from client[${ip}]: ${msgJson.message}, ${msgJson.number}`);

    (async() => {
      const result = await gpt(msgJson.message);
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
    console.log(`client[${ip}] connection closed`);
  });

  // ws.send("Hello! I am a WebSocket server.");
});

console.log("WebSocket server started on port 30002.");
