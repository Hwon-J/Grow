// String속의 emoji를 지우는 함수

function removeEmojisWithSpace(str) {
  // 이모지와 그 앞에 붙어있는 공백을 검색할 정규식 패턴
  const emojiWithSpacePattern = /(\s*)([\uD800-\uDFFF].|[\u2600-\u1F6FF].|[\u2300-\u27BF].)/g;

  // 정규식 패턴에 일치하는 이모지와 앞에 붙어있는 공백을 빈 문자열로 대체하여 제거
  const result = str.replace(emojiWithSpacePattern, '');

  return result;
}

module.exports = removeEmojisWithSpace;