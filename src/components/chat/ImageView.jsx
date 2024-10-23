import { useEffect, useRef, useState } from 'react';
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

  const [isTouching, setIsTouching] = useState(false);
  const [prevTouchPosition, setPrevTouchPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);

  const MAX_SCALE = 5;

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setPrevTouchPosition({ x: touch.clientX, y: touch.clientY });
      setIsTouching(true);
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setInitialDistance(distance);
      setIsTouching(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isTouching) return;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      const diffX = x - prevTouchPosition.x;
      const diffY = y - prevTouchPosition.y;

      setPrevTouchPosition({ x, y });

      setImagePosition((prev) => {
        const container = containerRef.current;
        const img = imgRef.current;

        if (!container || !img) return prev;

        const containerRect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        let newX = prev.x + diffX;
        let newY = prev.y + diffY;

        // 이미지가 화면 밖으로 벗어나지 않도록 조정
        if (imgRect.left + diffX > containerRect.left) {
          newX = 0;
        } else if (imgRect.right + diffX < containerRect.right) {
          newX = containerRect.width - imgRect.width;
        }

        if (imgRect.top + diffY > containerRect.top) {
          newY = 0;
        } else if (imgRect.bottom + diffY < containerRect.bottom) {
          newY = containerRect.height - imgRect.height;
        }

        // 확대된 상태에서 이미지의 끝부분이 부모 요소의 끝부분에서 떨어지지 않도록 조정
        if (imgRect.width > containerRect.width) {
          if (imgRect.left + diffX > containerRect.left) {
            newX = prev.x - (imgRect.left - containerRect.left);
          } else if (imgRect.right + diffX < containerRect.right) {
            newX = prev.x + (containerRect.right - imgRect.right);
          }
        }

        if (imgRect.height > containerRect.height) {
          if (imgRect.top + diffY > containerRect.top) {
            newY = prev.y - (imgRect.top - containerRect.top);
          } else if (imgRect.bottom + diffY < containerRect.bottom) {
            newY = prev.y + (containerRect.bottom - imgRect.bottom);
          }
        }

        return { x: newX, y: newY };
      });
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      const scaleChange = distance / initialDistance;
      setScale((prevScale) =>
        Math.min(MAX_SCALE, Math.max(1, prevScale * scaleChange))
      );
      setInitialDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    adjustScale();
    adjustImagePosition();
  };

  const adjustScale = () => {
    setScale((prevScale) => Math.min(MAX_SCALE, Math.max(1, prevScale)));
  };

  const adjustImagePosition = () => {
    const container = containerRef.current;
    const img = imgRef.current;

    if (!container || !img) return;

    const containerRect = container.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    let newX = imagePosition.x;
    let newY = imagePosition.y;

    // 이미지가 부모 요소의 테두리와 일치하도록 조정
    if (imgRect.left > containerRect.left) {
      newX = 0;
    } else if (imgRect.right < containerRect.right) {
      newX = containerRect.width - imgRect.width;
    }

    if (imgRect.top > containerRect.top) {
      newY = 0;
    } else if (imgRect.bottom < containerRect.bottom) {
      newY = containerRect.height - imgRect.height;
    }

    setImagePosition({ x: newX, y: newY });
  };

  useEffect(() => {
    if (!isTouching && scale === 1) {
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isTouching, scale]);

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
        <WrapImage
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                  {(downloadProgress.loaded / (1024 * 1024)).toFixed(2)} MB /{' '}
                  {(downloadProgress.total / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}

              <RoundedButton onClick={cancelDownload}>취소</RoundedButton>
            </Backdrop>
          )}
          {isError && (
            <Backdrop>
              <div>이미지를 불러오는 중 오류가 발생했습니다.</div>
              <RoundedButton
                onClick={() => {
                  downloadOriginalSizedImage();
                  setIsError(false);
                }}
              >
                다시 시도
              </RoundedButton>
            </Backdrop>
          )}
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

const RoundedButton = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 1rem;
`;

export default ImageView;
