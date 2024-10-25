import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useSse from '../../hooks/useSse';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../store/auth';
import { useQuery } from '@tanstack/react-query';
import { baseURL } from '../../constants/baseURL';
import { chatRoomListState } from '../../store/chatRoomListState';
import { waitingCountState } from '../../store/waitingCountState';
import ChatRoomListItem from '../../components/chat/ChatRoomListItem';
import dayjs from 'dayjs';

/**
 * @todo 채팅방 나가기 기능 실행 시 Optimistic Update 적용
 */
const ChatIndexPage = () => {
  const navigate = useNavigate();

  const [chatRoomList, setChatRoomList] = useRecoilState(chatRoomListState);
  const [waitingCount, setWaitingCount] = useRecoilState(waitingCountState);

  const isLoggedIn = useRecoilValue(isLoggedInState);

  const [sseUrl, setSseUrl] = useState('');

  const { data: authUniv } = useQuery({
    queryKey: ['authUniv'],
    queryFn: () =>
      instance.get('/member/check/university').then((res) => res.data),
    enabled: false,
  });

  const { data: memberId } = useQuery({
    queryKey: ['memberId'],
    queryFn: () => instance.get('/member/id').then((res) => res.data),
    staleTime: 'Infinity',
  });

  useSse({
    url: sseUrl,
    customEvents: {
      waitingCount: (event) => {
        const { waitingCount } = JSON.parse(event.data);
        setWaitingCount(waitingCount);
      },
      chatRoom: (event) => {
        const chatList = JSON.parse(event.data);
        chatList.sort((a, b) => dayjs(b.modifyDt) - dayjs(a.modifyDt));
        setChatRoomList(chatList);
      },
    },
    timeout: 1000,
  });

  useEffect(() => {
    if (memberId) setSseUrl(`${baseURL}/notify/subscribe/${memberId}`);
  }, [memberId]);

  const onClickChatroom = async (chat) => {
    if (authUniv?.startsWith('FAILED')) {
      window.confirm('학생 인증 후 이용해주세요.') && navigate('/verify/univ');
    } else {
      if (chat.opponentMemberId === null) {
        const res = window.confirm('정말로 나가시겠습니까?');
        if (!res) return;
        try {
          await instance.get(`/room-member/leave/${chat.chatRoomId}`);
        } catch (error) {
          console.log(error);
        }
      } else {
        navigate(`/chat/${chat.chatRoomId}`);
      }
    }
  };

  return isLoggedIn ? (
    <>
      <WrapInboxButton>
        <InboxButton onClick={() => navigate('/inbox')}>
          <div>
            {waitingCount > 0 && <UnreadCount>{waitingCount}</UnreadCount>}
            <div>요청함</div>
          </div>
          <img src="/assets/arrow-pink-right.svg" alt="화살표 아이콘" />
        </InboxButton>
      </WrapInboxButton>

      {chatRoomList.length === 0 ? (
        <EmptyContainer>
          <div className="wrap">
            <img src="/assets/empty-icon.svg" alt="empty icon" />
            <div>채팅을 시작해보세요!</div>
          </div>
        </EmptyContainer>
      ) : (
        <ChatListContainer>
          {chatRoomList.map((chat) => (
            <ChatRoomListItem
              key={chat.chatRoomId}
              onClick={() => onClickChatroom(chat)}
              memberCharacter={chat.memberCharacter}
              department={chat.department}
              mbti={chat.mbti}
              lastMessage={chat.lastMessage}
              modifyDt={chat.modifyDt}
              askedCount={chat.askedCount}
            />
          ))}
        </ChatListContainer>
      )}
      {/* <SurveyLinkContainer
        onClick={() => window.open('https://forms.gle/6ZgZvLD2iSM5LVuEA')}
      >
        <SurveyContentBox>
          <img src="/assets/chicken.png" alt="chicken" />
          <div>
            <div className="big-font">
              <em>설문</em>하고 <br />
            </div>
            치킨받으러가기
          </div>
        </SurveyContentBox>
      </SurveyLinkContainer> */}
    </>
  ) : (
    <EmptyContainer>
      <div className="wrap">
        <img src="/assets/empty-icon.svg" alt="empty icon" />
        <div>로그인 후 채팅을 시작해보세요!</div>
      </div>
    </EmptyContainer>
  );
};

const ChatListContainer = styled.div`
  margin-bottom: 10rem;
`;

const WrapInboxButton = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const InboxButton = styled.div`
  color: #333333;
  display: flex;
  gap: 8px;
  font-weight: 600;

  div {
    display: flex;
    margin-left: 5px;
  }
`;

const UnreadCount = styled.div`
  background-color: #ff625d;
  color: #ffffff;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.6rem;
  font-weight: 600;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 72vh;

  > .wrap {
    text-align: center;

    > img {
      margin-bottom: 1rem;
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

// const SurveyLinkContainer = styled.div`
//   width: 100%;
//   height: 80px;
//   position: fixed;
//   z-index: 1;
//   bottom: 15%;
//   left: 0;
//   right: 0;
//   background-color: #f3f3f3;
//   text-decoration: none;
//   color: black;
//   display: flex;
// `;

// const SurveyContentBox = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;

//   width: 100%;
//   font-size: 1rem;
//   font-weight: 200;

//   img {
//     height: 80px;
//   }
//   div {
//     padding-right: 3rem;

//     .big-font {
//       font-size: 1.5rem;
//     }

//     em {
//       font-style: normal;
//       font-weight: 600;
//     }
//   }
// `;

export default ChatIndexPage;
