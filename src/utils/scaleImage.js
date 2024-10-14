/**
 * 이미지 크기를 조절하는 함수
 * @param {File} file - 원본 이미지 파일
 * @param {number} scale - 이미지 크기 조절 비율 (0 ~ 1)
 * @param {string} format - 출력 이미지 형식 (예를 들어, 'image/jpeg')
 * @param {number} quality - 출력 이미지 품질 (0 ~ 1)
 * @returns {Promise<Blob>} - 크기가 조절된 이미지 Blob 객체
 */
export const scaleImage = (file, scale, format, quality) => {
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
                new Error('이미지 크기 조정에 실패했습니다. 다시 시도해주세요.')
              );
          },
          format,
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

    reader.readAsDataURL(file);
  });
};
