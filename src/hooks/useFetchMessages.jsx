import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['messages', roomId, page], // roomId와 page를 기준으로 캐시 키 설정
    queryFn: async () => {
      const res = await instance.get(
        `/chatroom/${roomId}/message?page=${page}&size=10`
      );
      return res.data;
    },
    enabled: page >= 0, // 현재 페이지가 0 이상일 때만 쿼리 실행
    staleTime: 0,
    cacheTime: 0,
  });
};
