import { useEffect, useState } from 'react';
import { instance } from '../api/instance';

// 페이지 개수 세기
export const useCountPages = (roomId) => {
  const fetchPagesNum = async (setCurrentPage) => {
    try {
      const res = await instance.get(`/chatroom/message/count/${roomId}`);
      let pageCount = Math.ceil(res.data / 10);
      setCurrentPage(pageCount - 1);
    } catch (error) {
      console.log(error);
    }
  };

  return fetchPagesNum;
};

// 페이지 메세지 불러오기
export const useFetchMessagesPerPage = (roomId, page) => {
  const [data, setData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const LOCAL_STORAGE_KEY = JSON.stringify(['messages', roomId, page]); // 각 쿼리 키에 대한 저장소 키 생성

  useEffect(() => {
    const fetchData = async () => {
      setIsSuccess(false);

      try {
        // 로컬 저장소에서 해당 쿼리 키의 데이터를 불러오기
        const storedData = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_KEY) || 'null'
        );

        if (storedData) {
          // 로컬 저장소에 데이터가 있으면 그 데이터를 설정
          setData(storedData);
        } else if (page >= 0) {
          // 로컬 저장소에 데이터가 없으면 API 호출
          const res = await instance.get(
            `/chatroom/${roomId}/message?page=${page}&size=10`
          );
          setData(res.data);

          // API 응답 후 조건이 맞으면 로컬 저장소에 데이터를 저장
          if (
            res.data.every((message) => message.unreadCount === 0) &&
            res.data.length === 10
          ) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
          }
        }
      } catch (error) {
        console.log('Error fetching messages:', error);
      }

      setIsSuccess(true);
    };

    fetchData();
  }, [roomId, page]);

  return { data, isSuccess };
};
