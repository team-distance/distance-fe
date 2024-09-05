import { Client } from '@stomp/stompjs';

export const useInitializeStompClient = (
  setClient,
  roomId,
  myMemberId,
  setMessages,
  setIsLoading
) => {
  // STOMP 메시지 수신 시 작동하는 콜백 함수
  const subscritionCallback = (message) => {
    const parsedMessage = JSON.parse(message.body);

    // 가장 최근 메시지가 상대방이 보낸 메시지인 경우 이전 메시지들은 모두 읽음 처리
    setMessages((prevMessages) => {
      const oldMessages = [...prevMessages];
      if (parsedMessage.body.senderId !== oldMessages.at(-1)?.senderId) {
        for (let i = 0; i < oldMessages.length; i++) {
          oldMessages[i].unreadCount = 0;
        }
      }
      return [...oldMessages, parsedMessage.body];
    });
  };

  const initializeClient = () => {
    const newClient = new Client({
      brokerURL: 'wss://dev.dis-tance.com/meet',
      connectHeaders: {
        chatRoomId: roomId,
        memberId: myMemberId,
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: (frame) => {
        setIsLoading(false);
        console.log('Connected: ' + frame);
        newClient.subscribe(`/topic/chatroom/${roomId}`, subscritionCallback);
      },
      onStompError: (error) => {
        console.log(error);
      },
      reconnectDelay: 50,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      newClient.deactivate();
    };
  };
  return initializeClient;
};
