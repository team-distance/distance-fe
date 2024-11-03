import dayjs from 'dayjs';

/**
 * 시간을 포맷팅하는 함수 (카카오톡과 같은 형식)
 *
 * 오늘인 경우 "HH:mm", 어제인 경우 "어제", 그 외 "YYYY-MM-DD" 형식으로 반환
 * @param {string} date - 날짜 문자열
 * @returns {string} 포맷팅된 시간 문자열
 */
export const getDisplayTime = (date) => {
  const today = dayjs();
  const givenDate = dayjs(date);

  switch (today.diff(givenDate, 'day')) {
    case 0:
      return givenDate.format('HH:mm');
    case 1:
      return '어제';
    default:
      return givenDate.format('YYYY-MM-DD');
  }
};
