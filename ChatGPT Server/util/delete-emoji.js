// String속의 emoji를 지우는 함수

function removeEmojis(str) {
  return str.replace(/\s?([\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{1F300}-\u{1F5FF}\u{1F650}-\u{1F67F}\u{1F30D}-\u{1F567}\u{1F5FB}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6EB}-\u{1F6EC}\u{1F6F4}-\u{1F6FA}\u{1F7E0}-\u{1F7EB}\u{1F90C}-\u{1F93A}\u{1F93C}-\u{1F945}\u{1F947}-\u{1F978}\u{1F97A}-\u{1F9CB}\u{1F9CD}-\u{1F9FF}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7A}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAA8}\u{1FAB0}-\u{1FAB6}\u{1FAC0}-\u{1FAC2}\u{1FAD0}-\u{1FAD6}])/gu, "");
}

module.exports = removeEmojis;