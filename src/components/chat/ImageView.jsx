import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseDate } from '../../utils/parseDate';
import axios from 'axios';
import { usePromiseToast } from '../../hooks/useToast';
import usePinchZoom from '../../hooks/usePinchZoom';
import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { ease: [0.2, 0.8, 0.2, 1], duration: 1 },
  },
  hidden: {
    opacity: 0,
    y: 100,
    filter: 'blur(10px)',
    transition: { ease: [0.2, 0.8, 0.2, 1], duration: 2 },
  },
};

const ImageView = ({ imgSrc, handleCancel }) => {
  const [showButton, setShowButton] = useState(true);
  const [image, setImage] = useState(imgSrc + '?w=600&f=webp&q=75');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [requestCancelController, setRequestCancelController] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({
    loaded: 0,
    total: 0,
    progress: 0,
  });

  const {
    isTouching,
    imagePosition,
    scale,
    containerRef,
    imgRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePinchZoom();

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
    setIsError(false);
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
            progress: progressEvent.progress,
          });
        },
        signal: newController.signal,
      });
      setImage(URL.createObjectURL(response.data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (!(error.code === 'ERR_CANCELED')) {
        console.log('triggered');
        setIsError(true);
      }
    }
  };

  const cancelDownload = () => {
    if (requestCancelController) {
      requestCancelController.abort();
      setRequestCancelController(null);
      setIsLoading(false);
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
        <WrapImage
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            ref={imgRef}
            src={image}
            alt="view"
            style={{
              transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${scale})`,
              transition: isTouching ? 'none' : 'transform 0.3s ease-out',
            }}
          />
        </WrapImage>
      </Background>

      <AnimatePresence>
        {isLoading && (
          <DownloadIndicator
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
          >
            <div className="upper-section">
              <Progress
                value={Math.round(downloadProgress.progress * 100) || 0}
                max={100}
              />
              {isError ? (
                <img
                  width={16}
                  height={16}
                  src="/assets/retry-button.svg"
                  alt="retry"
                  onClick={() => {
                    downloadOriginalSizedImage();
                    setIsError(false);
                  }}
                />
              ) : (
                <img
                  width={16}
                  height={16}
                  src="/assets/cancel-button-gray.svg"
                  alt="cancel"
                  onClick={cancelDownload}
                />
              )}
            </div>
            <div className="lower-section">
              {isError ? (
                <div>이미지를 불러오는 중 오류가 발생했습니다.</div>
              ) : (
                <div>
                  {downloadProgress.loaded === downloadProgress.total ? (
                    <div>원본 크기로 변환 중</div>
                  ) : (
                    <div>
                      {(downloadProgress.loaded / (1024 * 1024)).toFixed(2)} MB
                      / {(downloadProgress.total / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  )}
                </div>
              )}
            </div>
          </DownloadIndicator>
        )}
      </AnimatePresence>
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
    z-index: -1;
    max-width: 100%;
    max-height: 100%;
  }
`;

const Progress = styled.progress`
  width: 100%;
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

const DownloadIndicator = styled(motion.div)`
  background: rgba(50, 50, 50, 0.5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .upper-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  .lower-section {
    text-align: center;
  }
`;

export default ImageView;
