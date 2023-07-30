// express 모듈 불러오기 및 사용
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// const bodyParser = require("body-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

// CORS 설정
// const corsOptions = {
//     origin: function(origin, callback) {
//       // 특정 도메인이나 IP에 대한 접근을 허용하고 싶은 경우 이 부분을 변경하면 됩니다.
//       if (/^192\.168\.\d+\.\d+$/.test(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     allowedHeaders: "Content-Type, Accept, X-Requested-With, Authorization"
//   };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
//   console.log(res);
// });

app.use(cors());

const userRoutes = require("./app/routes/user-router");
app.use("/api/user", userRoutes);

const potRoutes = require("./app/routes/pot-router");
app.use("/api/pot", potRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
