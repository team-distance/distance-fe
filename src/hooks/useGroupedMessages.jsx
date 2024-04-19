import { useEffect, useState } from 'react';

const useGroupedMessages = (messages) => {
  const [groupedMessages, setGroupedMessages] = useState({});

  useEffect(() => {
    const groups = messages.reduce((acc, message) => {
      const date = message.sendDt.split('T')[0];
      acc[date] = acc[date] || [];
      acc[date].push(message);
      return acc;
    }, {});

    setGroupedMessages(groups);
  }, [messages]); // 메시지 배열이 변경될 때만 재계산

  return groupedMessages;
};

export default useGroupedMessages;
