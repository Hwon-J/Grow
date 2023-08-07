const swaggerUI = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Grow Web BackEnd Server",
      version: "0.1.0",
      description:
        "Grow 프로젝트의 웹과 IoT 디스플레이의 백엔드 서버의 Swagger UI",
    },
    servers: [
      {
        // 요청 url
        url: `http://i9c103.p.ssafy.io:${process.env.PORT}`,
        // url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  // swagger로 관리할 파일들
  apis: ["./app/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUI, specs };
