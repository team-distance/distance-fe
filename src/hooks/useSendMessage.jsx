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
  setUploadProgress,
  uploadingImagePreviewUrl,
  setUploadingImagePreviewUrl,
  setRequestCancelController
) => {
  // 이미지 전송
  const sendImageMessage = async () => {
    try {
      // 1. 이미지 업로드 중 상태로 변경
      setIsUploadingImage(true);

      // 2. 이미지 업로드 취소를 위한 AbortController 생성
      const newController = new AbortController();
      setRequestCancelController(newController);

      // 3. S3 Pre-signed URL과 파일 이름 가져오기
      const { fileName, s3Url } = await instance
        .post('/image')
        .then((res) => res.data);

      // 4. 가져온 파일 이름으로 새로운 File 객체 생성
      const newFile = new File([file], fileName, { type: file.type });

      // 5. 이미지 미리보기 URL 업데이트
      setUploadingImagePreviewUrl(URL.createObjectURL(newFile));

      // 6. 새로운 File 객체로 이미지 업로드
      await axios.put(s3Url, newFile, {
        headers: {
          'Content-Type': newFile.type,
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            progress: progressEvent.progress,
          });
        },
        signal: newController.signal,
      });

      // 7. S3에 업로드한 이미지 URL로 메시지 전송
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: `https://distance-buckets.s3.ap-northeast-2.amazonaws.com/${fileName}`,
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'IMAGE',
        }),
      });
    } catch (error) {
      if (!error?.code === 'ERR_CANCELED') {
        showWaitToast();
      }
    } finally {
      setIsUploadingImage(false);
      setUploadProgress({
        loaded: 0,
        total: 0,
      });
      setDraftMessage('');
      setFile(null);
      URL.revokeObjectURL(uploadingImagePreviewUrl); // 이미지 미리보기 URL 해제
      setUploadingImagePreviewUrl('');
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

  return { sendImageMessage, sendTextMessage };
};
