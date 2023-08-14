const path = require("path");

function generateNewFileName(originalName, serial) {
  // 현재 날짜 및 시간 가져오기
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2); // 년도의 마지막 두 자리
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월 (0-11이므로 1을 추가)
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // aaa.exe 형식의 파일 이름에서 확장자를 제외한 부분 가져오기
  // const nameWithoutExtension = path.basename(originalName, path.extname(originalName));

  // 새 파일 이름 생성
  // const newFileName = `${nameWithoutExtension}_${year}${month}${day}_${hours}${minutes}${seconds}${path.extname(originalName)}`;
  const newFileName = `answer_${serial}_${year}${month}${day}_${hours}${minutes}${seconds}${path.extname(
    originalName
  )}`;

  return newFileName;
}

module.exports = generateNewFileName;
