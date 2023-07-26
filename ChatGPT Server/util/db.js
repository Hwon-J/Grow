const maria = require("mysql");

const connection = maria.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

// MariaDB connection 실행
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
})

module.exports = connection;