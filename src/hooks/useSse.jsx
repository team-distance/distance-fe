import { useEffect, useState, useRef } from 'react';

const useSse = (url) => {
  const [waitingCount, setWaitingCount] = useState(0);
  const eventSourceRef = useRef(null);
  let reconnectTimeout = useRef(null);

  useEffect(() => {
    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close(); // 기존 연결 종료
      }

      const source = new EventSource(url);
      eventSourceRef.current = source;

      const updateWaitingCount = (event) => {
        const { waitingCount } = JSON.parse(event.data);
        setWaitingCount(waitingCount);
      };

      const updateChatList = (event) => {
        const chatList = JSON.parse(event.data);
        console.log(chatList);
      };

      source.onopen = (event) => {
        console.log('EventSource connected');
        console.log(event);
        clearTimeout(reconnectTimeout.current);
      };

      source.addEventListener('waitingCount', updateWaitingCount);
      source.addEventListener('message', updateChatList);

      source.onerror = (event) => {
        console.error('EventSource failed');
        console.error(event);
        source.close();

        // 3초 후 재연결 시도
        reconnectTimeout.current = setTimeout(() => {
          console.log('Reconnecting to EventSource...');
          connect();
        }, 3000);
      };

      // 클린업 함수에서 이벤트 리스너 제거
      return () => {
        source.removeEventListener('waitingCount', updateWaitingCount);
        source.close();
      };
    };

    const cleanup = connect();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('연결 끊기');
      }
      clearTimeout(reconnectTimeout.current);
      if (cleanup) cleanup();
    };
  }, [url]);

  return waitingCount;
};

export default useSse;
