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
  showWaitToast,
  setIsUploadingImage,
  setUploadingProgress
) => {
  // 이미지 전송
  const sendImageMessage = async () => {
    //S3 url 받기
    setIsUploadingImage(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post('/image', formData, {
      timeout: 20000,
      onUploadProgress: (progressEvent) => {
        setUploadingProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
        });

        console.log(
          'Upload Progress: ' +
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            '%'
        );
      },
    });

    setIsUploadingImage(false);
    setUploadingProgress({
      loaded: 0,
      total: 0,
    });

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
