const AWS = require("aws-sdk");
const fs = require("fs");
const winston = require("./winston.js");

function uploadFileToS3(fileKey, sourceFilePath) {
  // AWS 설정
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const s3 = new AWS.S3();

  return new Promise((resolve, reject) => {
    // 파일 읽기
    const fileContent = fs.readFileSync(sourceFilePath);

    // S3 업로드 파라미터 설정
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileKey,
      Body: fileContent,
    };

    // 파일 업로드
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
}

module.exports = {
  uploadFileToS3,
};
