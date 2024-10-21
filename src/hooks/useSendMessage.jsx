import axios from 'axios';
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
  setUploadingProgress,
  uploadingImagePreviewUrl,
  setUploadingImagePreviewUrl
) => {
  // 이미지 전송
  const sendImageMessage = async () => {
    setIsUploadingImage(true);

    // S3 Pre-signed URL과 파일 이름 가져오기
    const { fileName, s3Url } = await instance
      .post('/image')
      .then((res) => res.data);

    // 가져온 파일 이름으로 새로운 File 객체 생성
    const newFile = new File([file], fileName, { type: file.type });

    // 이미지 미리보기 URL 업데이트
    setUploadingImagePreviewUrl(URL.createObjectURL(newFile));

    // 새로운 File 객체로 이미지 업로드
    await axios.put(s3Url, newFile, {
      timeout: 20000,
      headers: {
        'Content-Type': newFile.type,
      },
      onUploadProgress: (progressEvent) => {
        setUploadingProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
        });
      },
    });

    setIsUploadingImage(false);
    setUploadingProgress({
      loaded: 0,
      total: 0,
    });

    // S3에 업로드한 이미지 URL로 메시지 전송
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: `https://distance-buckets.s3.ap-northeast-2.amazonaws.com/${fileName}`,
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'IMAGE',
        }),
      });

      setDraftMessage('');
      setFile(null);

      // 이미지 미리보기 URL 해제
      URL.revokeObjectURL(uploadingImagePreviewUrl);
      setUploadingImagePreviewUrl('');
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
