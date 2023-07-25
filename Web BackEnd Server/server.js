// express 모듈 불러오기 및 사용
const express = require("express")
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const userRoutes = require("./app/routes/user-router");
app.use('/api/user', userRoutes);

// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})