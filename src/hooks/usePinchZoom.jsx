import { useEffect, useRef, useState } from 'react';

const MAX_SCALE = 5;

/**
 * 두 점 사이의 거리를 구하는 함수
 * @param {{ x: number, y: number }} point1
 * @param {{ x: number, y: number }} point2
 */
const getDistance = (point1, point2) =>
  Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );

/**
 *  두 점 사이의 중점을 구하는 함수
 * @param {{ x: number, y: number }} point1
 * @param {{ x: number, y: number }} point2
 * @returns
 */
// const getCenterPoint = (point1, point2) => ({
//   x: (point1.x + point2.x) / 2,
//   y: (point1.y + point2.y) / 2,
// });

/**
 * 핀치 줌을 위한 커스텀 훅
 */
const usePinchZoom = () => {
  const [isTouching, setIsTouching] = useState(false);
  const [prevTouchPosition, setPrevTouchPosition] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState(0);

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
      const distance = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
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

      const distance = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
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

  return {
    isTouching,
    imagePosition,
    scale,
    containerRef,
    imgRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

export default usePinchZoom;
