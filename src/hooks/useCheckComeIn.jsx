import { useEffect, useState } from 'react';

export const useCheckComeIn = (messages, myId) => {
  const lastMessage = messages?.at(-1);
  const [isOpponentComeIn, setIsOpponentComeIn] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      console.log(
        'lastMessage.senderId',
        lastMessage.senderId,
        lastMessage.senderType
      );
      if (lastMessage.senderId !== myId && lastMessage.senderType === 'COME') {
        setIsOpponentComeIn(true);
      }
    }
  }, [messages, lastMessage, myId]);

  return { isOpponentComeIn };
};
