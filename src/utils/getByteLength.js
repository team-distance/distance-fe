/**
 * 문자열의 바이트 길이를 구하는 함수
 * @param {string} str 바이트 길이를 구할 문자열
 * @returns {number} 문자열의 바이트 길이
 */
export const getByteLength = (str) => {
  let bytes = 0;
  let i = 0;

  while (i < str.length) {
    const codePoint = str.codePointAt(i);

    if (codePoint <= 0x7f) {
      bytes += 1;
    } else if (codePoint <= 0x7ff) {
      bytes += 2;
    } else if (codePoint <= 0xffff) {
      bytes += 3;
    } else if (codePoint <= 0x10ffff) {
      bytes += 4;
      i++; // 이모지 같은 서로게이트 쌍의 경우 다음 코드 유닛을 건너뜀
    }
    i++;
  }
  return bytes;
};
