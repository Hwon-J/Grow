// express 모듈 불러오기 및 사용
const express = require("express")
const cors = require("cors");
const app = express();

require("dotenv").config();

const bodyParser = require("body-parser");

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const userRoutes = require("./app/routes/user-router");
app.use('/api/user', userRoutes);

const potRoutes = require("./app/routes/pot-router");
app.use('/api/pot', potRoutes);

// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT;

// 클라이언트 도메인 주소를 지정하여 CORS 허용
// const allowedOrigins = ['192.168.100.38'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));
app.use( function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
        // next();
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})