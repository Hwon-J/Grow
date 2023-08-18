const maria = require("mysql");
const winston = require("./winston.js");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

let connection;

function handleDisconnect() {
  connection = maria.createConnection(dbConfig);

  connection.connect(err => {
    if (err) {
      winston.error('Error connecting to the database:', err);
      setTimeout(handleDisconnect, 2000);  // 2초 후에 재연결 시도
    } else {
      winston.info("Successfully connected to the database.");
    }
  });

  connection.on('error', err => {
    winston.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();  // 연결 끊김 시 재연결
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;