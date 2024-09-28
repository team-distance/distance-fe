import { instance } from '../api/instance';

export const useSendMessage = (
  draftMessage,
  setDraftMessage,
  setFile,
  file,
  client,
  roomId,
  opponentMemberId,
  myMemberId,
  showWaitToast
) => {
  // 이미지 전송
  const sendImageMessage = async () => {
    //S3 url 받기
    const formData = new FormData();
    formData.append('file', file);
    const response = await instance.post('/image', formData);
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: response.data.imageUrl,
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'IMAGE',
        }),
      });

      setDraftMessage('');
      setFile(null);
    } catch (error) {
      showWaitToast();
    }
  };

  // 텍스트 전송
  const sendTextMessage = () => {
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: draftMessage,
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'USER',
        }),
      });

      setDraftMessage('');
      setFile(null);
    } catch (error) {
      showWaitToast();
    }
  };

  // 읽음 신호 메세지
  const sendComeInMessage = () => {
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: '',
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'COME',
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { sendImageMessage, sendTextMessage, sendComeInMessage };
};
