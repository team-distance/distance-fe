import heic2any from 'heic2any';

/**
 * heic 파일을 jpeg, png, gif로 변환
 * @param {Object} params - 변환 파라미터
 * @param {File} params.heicFile - 원본 HEIC 파일
 * @param {string} [params.toType='jpeg'] - 출력 형식 (jpeg, png, gif)
 * @param {number} [params.scale] - 이미지 크기 조절 비율 (0 ~ 1)
 * @param {number} [params.quality] - 출력 품질 (0 ~ 1)
 * @returns {Promise<Blob>} - 변환된 이미지 Blob 객체
 */
export const convertHeic2Any = async ({
  heicFile,
  toType = 'jpeg',
  scale,
  quality,
}) => {
  if (!heicFile) {
    throw new Error('HEIC 파일이 제공되지 않았습니다.');
  }

  if (scale <= 0 || scale > 1) {
    console.warn('유효하지 않은 scale 값입니다. 기본값 1을 사용합니다.');
    scale = 1;
  }

  let convertedFile;

  // heic 파일을 jpeg, png, gif로 변환
  try {
    convertedFile = await heic2any({
      blob: heicFile,
      toType: `image/${toType.toLowerCase()}`,
      quality: quality,
    });
  } catch (error) {
    console.log(`HEIC 파일 변환 실패: ${error}`);
  }

  // 변환된 파일을 크기 조절 (scale이 주어진 경우에만)
  if (scale) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();

        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else
                reject(
                  new Error(
                    '이미지 크기 조정에 실패했습니다. 다시 시도해주세요.'
                  )
                );
            },
            `image/${toType.toLowerCase()}`,
            quality
          );
        };

        img.onerror = function () {
          reject(
            new Error('이미지를 불러오는데 실패했습니다. 다시 시도해주세요.')
          );
        };

        img.src = e.target.result;
      };

      reader.onerror = function () {
        reject(new Error('파일을 읽는데 실패했습니다. 다시 시도해주세요.'));
      };

      reader.readAsDataURL(convertedFile);
    });
  }

  return convertedFile;
};
