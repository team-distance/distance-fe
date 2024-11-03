import dayjs from 'dayjs';
import { useMemo } from 'react';

// 날짜 별로 messages 그룹화
const useGroupedMessages = (messages) => {
  const groupedMessages = useMemo(() => {
    const groups = messages.reduce((acc, message) => {
      // const date = message.sendDt.split('T')[0];
      const date = dayjs(message.sendDt).format('YYYY-MM-DD');
      acc[date] = acc[date] || [];
      acc[date].push(message);
      return acc;
    }, {});
    return groups;
  }, [messages]); // 메시지 배열이 변경될 때만 재계산

  return groupedMessages;
};

export default useGroupedMessages;
