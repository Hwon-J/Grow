// express 모듈 불러오기 및 사용
const express = require("express")
const cors = require("cors");
const app = express();
require("dotenv").config();

// const bodyParser = require("body-parser");

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const userRoutes = require("./app/routes/user-router");
app.use('/api/user', userRoutes);

const potRoutes = require("./app/routes/pot-router");
app.use('/api/pot', potRoutes);

// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})