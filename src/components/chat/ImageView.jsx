import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseDate } from '../../utils/parseDate';
import axios from 'axios';
import { usePromiseToast } from '../../hooks/useToast';

const ImageView = ({ imgSrc, handleCancel }) => {
  const [showButton, setShowButton] = useState(true);
  const [image, setImage] = useState(imgSrc + '?w=600&f=webp&q=75');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [requestCancelController, setRequestCancelController] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
  });

  const { showPromiseToast: showDownloadImageToast } = usePromiseToast();

  const handleClickDownload = () => {
    try {
      const res = axios.get(imgSrc, { responseType: 'blob' });

      showDownloadImageToast(
        res,
        (res) => {
          const blobURL = URL.createObjectURL(res.data);
          const aTag = document.createElement('a');

          const date = parseDate(new Date());

          aTag.href = blobURL;
          aTag.download = `distance/${date}.jpg`;

          aTag.click();

          return '이미지가 저장되었습니다.';
        },
        (error) => {
          console.log(error);
          return '이미지 다운로드를 다시 시도해주세요.';
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const downloadOriginalSizedImage = async () => {
    setIsLoading(true);
    const newController = new AbortController();
    setRequestCancelController(newController);

    try {
      const response = await axios.get(imgSrc + '?f=webp', {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          setDownloadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        },
        signal: newController.signal,
      });
      setImage(URL.createObjectURL(response.data));
    } catch (error) {
      if (!error?.code === 'ERR_CANCELED') {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cancelDownload = () => {
    if (requestCancelController) {
      requestCancelController.abort();
      setRequestCancelController(null);
    }
  };

  useEffect(() => {
    downloadOriginalSizedImage();

    return () => {
      if (requestCancelController) {
        requestCancelController.abort();
      }
      URL.revokeObjectURL(image);
    };
  }, []);

  return (
    <>
      {showButton && (
        <WrapButtons>
          <div className="container">
            <img
              src="/assets/chat/download-button.svg"
              alt="download"
              onClick={handleClickDownload}
            />
            <img
              src="/assets/chat/cancel-button.svg"
              alt="download"
              onClick={handleCancel}
            />
          </div>
        </WrapButtons>
      )}
      <Background onClick={() => setShowButton((prev) => !prev)}>
        <WrapImage>
          {isLoading && (
            <Backdrop>
              <Progress
                value={
                  (downloadProgress.loaded / downloadProgress.total) * 100 || 0
                }
                max={100}
              />
              {downloadProgress.loaded === downloadProgress.total ? (
                <div>원본 크기로 변환 중</div>
              ) : (
                <div>
                  {/* 바이트를 메가바이트로 변환 */}
                  {(downloadProgress.loaded / (1024 * 1024)).toFixed(2)} MB /{' '}
                  {(downloadProgress.total / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}

              <CancelButton onClick={cancelDownload}>취소</CancelButton>
            </Backdrop>
          )}
          {isError && (
            <Backdrop>
              <div>이미지를 불러오는 중 오류가 발생했습니다.</div>
              <CancelButton
                onClick={() => {
                  downloadOriginalSizedImage();
                  setIsError(false);
                }}
              >
                다시 시도
              </CancelButton>
            </Backdrop>
          )}
          <img src={image} alt="view" />
        </WrapImage>
      </Background>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: black;
  z-index: 999;
`;

const WrapButtons = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .container {
    display: flex;
    justify-content: space-between;
    padding: 1.5rem 1rem;
  }
`;

const WrapImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Progress = styled.progress`
  width: 80%;
  height: 8px;
  appearance: none;

  &::-webkit-progress-bar {
    background-color: #f5f5f5;
    border-radius: 9999px;
  }

  &::-webkit-progress-value {
    background-color: #ff625d;
    border-radius: 9999px;
  }
`;

const CancelButton = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 1rem;
`;

export default ImageView;
