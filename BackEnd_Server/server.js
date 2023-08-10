// express 모듈 불러오기 및 사용
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const winston = require("./util/winston.js");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use(cors());

// Swagger 사용
const {swaggerUI, specs} = require("./util/swagger");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

// 정적 파일을 제공하기 위한 미들웨어를 사용합니다. 
// 'assets' 디렉토리의 파일들을 제공할 수 있게 됩니다.
app.use('/uploads', express.static(path.join(__dirname, 'assets')));

const userRoutes = require("./routes/user-router");
app.use("/api/user", userRoutes);

const potRoutes = require("./routes/pot-router");
app.use("/api/pot", potRoutes);

const sensorRoutes = require("./routes/sensor-router");
app.use("/api/sensor", sensorRoutes);

const plantRoutes = require("./routes/plant-router");
app.use("/api/plant", plantRoutes);

app.listen(PORT, () => {
  winston.info(`Server is running on port ${PORT}(ver.1.0.8)`);
});
