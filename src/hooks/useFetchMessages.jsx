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
export const useFetchMessagesPerPage = (roomId) => {
  const fetchPageMessages = async (
    setMessages,
    setCurrentPage,
    page,
    pageSize
  ) => {
    try {
      if (page < 0) {
        return [];
      }

      const res = await instance.get(
        `/chatroom/${roomId}/message?page=${page}&size=${pageSize}`
      );

      // 받아온 데이터가 없으면 더 이상 로딩하지 않음
      if (res.data.length === 0) {
        return [];
      }

      setMessages((prevMessages) => [...res.data, ...prevMessages]);
      setCurrentPage((prevPage) => prevPage - 1);

      console.log('fetchPageMessages', page);
    } catch (error) {
      console.log(error);
    }
  };

  return fetchPageMessages;
};

// // 로컬 스토리지에 저장된 메세지 불러오기
// export const useFetchMessagesFromLocal = (roomId) => {
//   const fetchLocalMessages = (setMessages) => {
//     const staleMessages = localStorage.getItem('staleMessages');
//     if (staleMessages) {
//       const parsedStaleMessages = JSON.parse(staleMessages);
//       if (parsedStaleMessages[roomId]) {
//         const localMessages = JSON.parse(parsedStaleMessages[roomId]);
//         setMessages(JSON.parse(parsedStaleMessages[roomId]));
//         return localMessages;
//       }
//     }
//     return [];
//   };
//   return fetchLocalMessages;
// };

// // 서버에 저장된 모든 메세지 불러오기
// export const useFetchMessagesFromServer = (roomId) => {
//   const navigate = useNavigate();
//   const fetchAllMessagesFromServer = async (setMessages) => {
//     try {
//       const msg = await instance.get(`/chatroom/${roomId}/allmessage`);
//       if (msg.data.length === 0) return;
//       setMessages(msg.data);
//     } catch (error) {
//       window.confirm('학생 인증 후 이용해주세요.')
//         ? navigate('/verify/univ')
//         : navigate('/chat');
//     }
//   };

//   return fetchAllMessagesFromServer;
// };

// export const useFetchUnreadMessagesFromServer = (roomId) => {
//   // 읽지 않은 메세지 서버에서 가져오기
//   const fetchUnreadMessagesFromServer = async (messages, setMessages) => {
//     try {
//       const unreadMessages = await instance
//         .get(`/chatroom/${roomId}`)
//         .then((res) => res.data);
//       if (unreadMessages.length === 0) return;

//       // unreadMessages를 local에 저장된 stalesMessage에 추가
//       unreadMessages.forEach((unreadMessage) => {
//         if (
//           !messages.find(
//             (message) => message.messageId === unreadMessage.messageId
//           )
//         ) {
//           setMessages((messages) => [...messages, unreadMessage]);
//         }
//       });
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   return fetchUnreadMessagesFromServer;
// };
