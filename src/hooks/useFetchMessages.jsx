import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
  const queryKey = ['messages', roomId, page];
  const LOCAL_STORAGE_KEY = JSON.stringify(queryKey); // 각 쿼리 키에 대한 저장소 키 생성

  // `storedData`로 로컬 저장소에서 해당 쿼리 키의 데이터를 불러오기
  const storedData = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY) || 'null'
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await instance.get(
        `/chatroom/${roomId}/message?page=${page}&size=10`
      );
      return res.data;
    },
    enabled: !storedData && page >= 0,
    staleTime: 0,
    cacheTime: 0,
  });

  // 상태 조건 확인
  useEffect(() => {
    if (
      query.data &&
      query.data.every((message) => message.unreadCount === 0) &&
      query.data.length === 10
    ) {
      // console.log(
      //   'All messages have unreadCount of 0. Data will be persisted automatically.'
      // );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(query.data));
    }
  }, [query.data]);

  return query;
};
