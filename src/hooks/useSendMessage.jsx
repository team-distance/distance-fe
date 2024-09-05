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
  const sendImageMessage = async () => {
    //S3 url 받기
    const formData = new FormData();
    formData.append('file', file);
    const response = await instance.post('/image', formData);

    //stomp 전송
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: response.data.imageUrl,
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

  return { sendImageMessage, sendTextMessage };
};
