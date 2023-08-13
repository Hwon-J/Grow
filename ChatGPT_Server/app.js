const WebSocket = require("ws");
const aws = require("./util/aws-s3.js");
const Queue = require("./util/queue.js");
const gpt = require("./util/call-gpt.js");
const db = require("./util/db.js");
const stringPurify = require("./util/string-purifier.js");
const newFileName = require("./util/new-file-name.js");
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
  // AWS 테스트 부분
  // const date = new Date();
  // const timestamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;

  // let name = `dummy_${timestamp}.wav`;
  // winston.info(`name: ${name}`);
  // aws.uploadFileToS3(name, `./assets/dummy.wav`);

  // 부모님이 설정한 대화를 나누기 위한 프리셋 부분
  // 대화를 나눈 횟수
  let count = 0;
  // 부모님 설정 대화를 꺼낼 랜덤 값. count가 이 값과 같아지면 부모님 질문을 끼워 넣음
  let randomPoint =
    Math.floor(
      Math.random() * (process.env.RANDOM_MAX - process.env.RANDOM_MIN)
    ) + process.env.RANDOM_MIN;

  // 부모님 질문이 포함된 대화의 인덱스를 저장할 큐
  const qindexQueue = new Queue();
  // 대답 채팅로그의 인덱스가 담긴 큐
  const cindexQueue = new Queue();
  // 다음 사용자의 입력은 질문에 대한 대답이라는 플래그
  let qFlag = false;
  let insertIndex;
  let fileName;
  let fileStream;
  // 바로 이전 상태: 0-대기, 1-가까워지는 중, 2-말할 수 있을만큼 가까움, 3-멀어짐
  let status = 0;

  // 1. 연결 클라이언트 IP 취득
  const ip = req.headers["x-forwarded"] || req.socket.remoteAddress;
  winston.info(`new client[${ip}] connected`);

  // 2. 클라이언트에게 메세지 전송(현재는 생략됨)
  if (ws.readyState === ws.OPEN) {
    // ws.send(`Server: Welcome Client[${ip}]`);
  }

  // 3. 클라이언트로부터 메세지 수신 이벤트 처리
  ws.on("message", async (msg) => {
    try {
      let msgJson = JSON.parse(msg);
      if (msgJson.purpose !== "file") {
        winston.info(
          `message from client[${ip}]:${msgJson.purpose}, ${msgJson.role}, ${msgJson.content}, ${msgJson.serial}`
        );
      } else {
        winston.info(
          `message from client[${ip}]:${msgJson.purpose}, ${msgJson.role}, ${msgJson.serial}`
        );
      }

      // purpose에 따라 분기하는 switch문
      switch (msgJson.purpose) {
        // 클라이언트의 메세지가 핸드셰이크인 경우
        // 연결 후 클라이언트는 첫 메세지로 핸드셰이크를 보낸다
        case "handshake":
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
            break;
          }

          // clients에 시리얼 넘버와 디스플레이/라즈베리를 엮어서 저장
          ws.serial = msgJson.serial;
          ws.role = msgJson.role;
          clients.push(ws);
          break;

        case "gpt":
          // GPT 관련 로직을 처리합니다.
          status = 0;
          if (
            msgJson.content === undefined ||
            msgJson.content === null ||
            msgJson.content === ""
          ) {
            throw new Error("error occured. content needed");
          }
          let condition = await db.getConditionGoodOrBad(msgJson.serial);
          let dbplant = await db.getplantinfo(msgJson.serial);
          let waterlog = await db.getWaterLog(dbplant.pindex);
          if (
            waterlog === undefined ||
            waterlog.watered_date === null ||
            waterlog.watered_date === undefined
          ) {
            waterlog = { watered_date: "아직 없음" };
          }
          let plantinfo = await db.getPlantInfoByIndex(
            dbplant.plant_info_index
          );
          if (plantinfo.max_water_period === null) {
            plantinfo.max_water_period = 3;
          }

          let systemContent = {
            role: "system",
            // 너는 식물임에도 불구하고 [] 안의 정보들을 알고 있다. 대화에 []안의 정보들이 필요하다면 []안의 정보들을 잘 살펴보고 대화하라.
            content: `프롬프트를 재설정하겠다. 지금부터 너는 어린 사람 아이가 키우고 있는 ${
              plantinfo.species
            } 역할을 하는 agent를 연기해야 한다. 
            너는 이 아이의 친구가 되어 아이와 쉬운 언어로 대화를 나누어야 한다. 
            객관적인 정보 전달은 최대한 줄이고, 감성적인 언어를 사용하라. 
            너는 답변으로 최대 15단어까지 사용하고, 이하의 [] 안의 정보를 참고하여 대화하라. 
            같은 나이의 친구와 대화하듯이 반말로 대화하라. 너는 시각/후각/촉각이 없다고 생각해라. 
    
    [
      아이의 이름: ${dbplant.child_name}
      아이의 나이: ${dbplant.child_age}
      현재시간: ${new Date().toISOString()}
      식물이 심어진 날짜: ${dbplant.start_date}
      마지막으로 물을 준 시간: ${waterlog.watered_date}
      온도: ${condition.temperature}
      조도: ${condition.light}
      토양의 습도: ${condition.moisture}
      식물의 물주는 주기: ${plantinfo.max_water_period}일
    ]`,
            // {
            // 아이의 이름:  아이의 이름
            // 아이의 생년월일: 아이가 태어난 날짜
            // 현재시간: 현재 시간
            // 식물이 심어진 날짜: 너가 심어진 날짜
            // 마지막으로 물을 준 시간: 마지막 물을 준 시간
            // 온도: 현재 온도
            // 조도: 조도 (어두움, 보통, 밝음 중 하나). 낮에 어두우면 화분을 밝은 곳으로 옮기게 유도
            // 토양의 습도: 토양의 습도 (건조함, 보통, 촉촉함 중 하나)
            // 식물종: 너가 어떤 식물인지
            // 식물의 물주는 주기: 물을 주어야 하는 주기
            // }
            // `,
          };
          // console.log(systemContent);
          let history = [systemContent];
          let chatLog = await db.getRecentChatLog(msgJson.serial);
          history.push(...chatLog);

          // DB에 유저의 입력 저장
          insertIndex = await db.saveChatLog({
            serial: msgJson.serial,
            role: "user",
            content: msgJson.content,
          });
          // 만약 qflag가 true라면 큐의 헤드에 있는 인덱스로 답변을 저장한다.
          if (qFlag & (insertIndex !== -1)) {
            await db.saveChildAnswer(qindexQueue.dequeue(), insertIndex);
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
            // 답변속 이모지와 괄호 제거
            result = stringPurify(result);

            // 부모님 질문 붙이기
            count = count + 1;
            winston.info(`current count: ${count}.......`);
            if (count >= randomPoint) {
              if (result.includes("?")) {
                count = count - 1;
              } else {
                // 카운트가 다 차면 부모님의 질문을 추가
                let question = await db.addRandomQuestion(msgJson.serial);
                qindexQueue.enqueue(question.index);
                qindexQueue2.enqueue(question.index);
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

            clients.forEach((client) => {
              if (
                client.serial === ws.serial &&
                client.readyState === WebSocket.OPEN
              ) {
                let answer = { about: "gpt", content: result };
                // if (qFlag) {
                answer.isQuest = true;
                // qFlag = false;
                // }
                winston.info(`server sent : ${JSON.stringify(answer)}`);
                client.send(JSON.stringify(answer));
              }
            });
          })();
          break;

        // 사용자가 가까이 왔다는 메세지의 처리
        case "closer":
          winston.info(
            `"closer" accepted from ${ws.serial}, status: ${status}`
          );
          if (status === 1) {
            winston.inf(`status is ${status}, so break occured`);
            break;
          }
          status = 1;
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
          break;

        // 사용자가 매우 가까이 있다는 메세지
        case "hear":
          winston.info(`"hear" accepted from ${ws.serial}, status: ${status}`);
          if (status === 2) {
            winston.inf(`status is ${status}, so break occured`);
            break;
          }
          status = 2;
          clients.forEach((client) => {
            if (
              client.role === "display" &&
              client.serial === msgJson.serial &&
              client.readyState === WebSocket.OPEN
            ) {
              winston.info(`send "hear" to ${client.serial}, ${client.role}`);
              client.send(JSON.stringify({ about: "hear" }));
            }
          });
          break;

        // 사용자가 떨어졌다는 메세지의 처리
        case "further":
          winston.info(
            `"further" accepted from ${ws.serial}, status: ${status}`
          );
          if (status === 3) {
            winston.inf(`status is ${status}, so break occured`);
            break;
          }
          clients.forEach((client) => {
            if (
              client.role === "display" &&
              client.serial === msgJson.serial &&
              client.readyState === WebSocket.OPEN
            ) {
              if (status === 1) {
                winston.info(
                  `send "break" to ${client.serial}, ${client.role}`
                );
                client.send(JSON.stringify({ about: "break" }));
              } else if (status === 2) {
                winston.info(
                  `send "further" to ${client.serial}, ${client.role}`
                );
                client.send(JSON.stringify({ about: "further" }));
              }
            }
          });
          status = 3;
          break;

        // 캐릭터 골랐을 때의 부분
        case "character":
          winston.info(`"character" accepted from ${ws.serial}`);
          db.setCnum(msgJson.serial, msgJson.content);
          break;

        // 파일 전송 시작 알림
        case "file":
          winston.info(`"file" accepted from ${ws.serial}`);
          if (!fileStream) {
            winston.info("filestream started...");
            fileName = message.content; // content에서 파일명을 가져옵니다.
            winston.info(`fileName: ${fileName}`);
            fileStream = fs.createWriteStream(`./assets/${fileName}`);
            winston.info(`Started writing to ./assets/${fileName}`);
          } else {
            // 바이너리 데이터를 수신하면 파일에 쓴다.
            winston.info(`writing....... ${ws.serial}`);
            fileStream.write(message.content);
          }
          break;

        // 파일 전송 종료 알림
        case "file_end":
          winston.info(
            `"file_end" accepted from ${ws.serial}, ${msgJson.content}`
          );
          if (fileStream) {
            winston.info("filestream ended...");
            fileStream.end();
            winston.info("File saved. Start sending to AWS");
            // aws 부분 시작
            let newName = newFileName(fileName);
            aws.uploadFileToS3(newFileName(newName), `./assets/${fileName}`);
            db.updateFilePath(qindex, `./${newName}`);
            winston.info(`aws completed`);
          }
          break;

        default:
          winston.info("error: purpose needed or purpose gpt need content");
          ws.send(
            JSON.stringify({
              about: "error",
              content: "purpose needed or purpose gpt need content",
            })
          );
      }
    } catch (error) {
      // data가 바이너리 또는 JSON이 아닌 경우 처리합니다.
      if (fileStream) {
        fileStream.write(data);
      } else {
        winston.error(error);
      }
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
