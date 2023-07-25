// server.js
const express = require('express');
const mariadb = require('mariadb');
const app = express();
const port = 5000; // 사용할 포트 번호

// 미들웨어 설정 (JSON 파싱)
app.use(express.json());

// 라우팅 설정 예제
app.get('/', (req, res) => {
  res.send('백엔드 서버가 동작 중입니다.');
});
app.get('/SignUp', (req, res) => {
    res.send('백엔드 서버가 동작 중입니다.');
  });

// 라우팅 추가 가능

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});