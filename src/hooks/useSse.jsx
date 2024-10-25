import { useEffect, useRef } from 'react';

/**
 * SSE(Server-Sent Events) 커스텀 훅
 * @param {Object} object
 * @param {string} object.url
 * @param {function} object.onopen
 * @param {function} object.onmessage
 * @param {function} object.onerror
 * @param {object} object.customEvents
 * @param {number} object.timeout
 * @returns {EventSource}
 */
const useSse = ({
  url,
  onopen,
  onmessage,
  onerror,
  customEvents = {},
  timeout = 1000,
}) => {
  const eventSourceRef = useRef(null);
  let reconnectTimeout = useRef(null);

  useEffect(() => {
    if (!url) return;

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close(); // 기존 연결 종료
      }

      const source = new EventSource(url);
      eventSourceRef.current = source;

      source.onopen = (event) => {
        if (onopen) onopen(event);
        console.log('SSE 연결 성공', event);
        clearTimeout(reconnectTimeout.current);
      };

      source.onmessage = (event) => {
        if (onmessage) onmessage(event);
      };

      source.onerror = (event) => {
        if (onerror) onerror(event);
        console.log('SSE 연결 에러', event);
        source.close();
        reconnectTimeout.current = setTimeout(() => {
          console.log('EventSource 재연결...');
          connect();
        }, timeout);
      };

      // 커스텀 이벤트 리스너 등록
      Object.entries(customEvents).forEach(([event, handler]) => {
        source.addEventListener(event, handler);
      });

      // 클린업 함수에서 이벤트 리스너 제거
      return () => {
        Object.entries(customEvents).forEach(([event, handler]) => {
          source.removeEventListener(event, handler);
        });

        source.close();
      };
    };

    const cleanup = connect();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log('EventSource 연결 해제');
      }

      clearTimeout(reconnectTimeout.current);
      if (cleanup) cleanup();
    };
  }, [url]);

  return eventSourceRef.current;
};

export default useSse;
