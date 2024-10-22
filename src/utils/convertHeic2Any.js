import heic2any from 'heic2any';

/**
 * heic 파일을 jpeg, png, gif로 변환
 * @param {File}} heicFile - 원본 heic 파일
 * @param {string} toType - 출력 확장자 jpeg, png, gif
 * @param {number} quality - 출력 품질 (0 ~ 1)
 * @returns {Promise<Blob>} - 변환된 이미지 Blob 객체
 */
export const convertHeic2Any = async (
  heicFile,
  toType = 'jpeg',
  quality = 1
) => {
  try {
    return await heic2any({
      blob: heicFile,
      toType: `image/${toType.toLowerCase()}`,
      quality: quality,
    });
  } catch (error) {
    console.log(`HEIC 파일 변환 실패: ${error}`);
  }
};
