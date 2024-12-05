import dayjs from 'dayjs';
import { useMemo } from 'react';

// 날짜 별로 messages 그룹화
const useGroupedMessages = (messages) => {
  const groupedMessages = useMemo(() => {
    const groups = messages.reduce((acc, message) => {
      const date = dayjs(message.sendDt).format('YYYY-MM-DD');
      acc[date] = acc[date] || [];
      acc[date].push(message);

      // const newQuestionMessage = {
      //   chatMessage: '',
      //   checkTiKiTaKa: message.checkTiKiTaKa,
      //   messageId: `${message.messageId}_${message.checkTiKiTaKa}`,
      //   roomStatus: '',
      //   sendDt: '',
      //   senderId: '',
      //   senderName: '',
      //   senderType: 'NEW_QUESTION',
      //   unreadCount: 0,
      // };

      // // 3의 배수마다 메시지 추가
      // if (
      //   message.checkTiKiTaKa % 3 === 0 &&
      //   !acc[date].find(
      //     (m) =>
      //       m.checkTiKiTaKa === message.checkTiKiTaKa &&
      //       m.senderType === 'NEW_QUESTION'
      //   )
      // ) {
      //   acc[date].push(newQuestionMessage);
      // }

      return acc;
    }, {});
    return groups;
  }, [messages]); // 메시지 배열이 변경될 때만 재계산

  return groupedMessages;
};

export default useGroupedMessages;
