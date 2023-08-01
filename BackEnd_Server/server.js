// express 모듈 불러오기 및 사용
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;

app.use(cors());

// Swagger 사용
const {swaggerUI, specs} = require("./util/swagger");

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

const userRoutes = require("./routes/user-router");
app.use("/api/user", userRoutes);

const potRoutes = require("./routes/pot-router");
app.use("/api/pot", potRoutes);

const sensorRoutes = require("./routes/sensor-router");
app.use("/api/sensor", sensorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
