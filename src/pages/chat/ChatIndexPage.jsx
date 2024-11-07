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

  const chatRoomCount = chatRoomList.filter(
    (chatRoom) => chatRoom.roomStatus === 'ACTIVE'
  ).length;

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

  const { data: availableChatRoomCount } = useQuery({
    queryKey: ['availableChatRoomCount'],
    queryFn: () =>
      instance.get('/member/available/roomcount').then((res) => res.data),
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

  const handleClickChatRoom = async (chat) => {
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

  const handleClickShareButton = async () => {
    let myTelNum;

    try {
      myTelNum = await instance
        .get('/member/own/telnum')
        .then((res) => res.data);
    } catch (error) {
      console.log('전화번호를 가져오는데 실패했습니다.');
    }

    if (navigator.share) {
      navigator
        .share({
          title: '💕 distance 디스턴스',
          text: '축제를 200% 즐기는 방법, distance 💕',
          url: 'https://dis-tance.com?referredTel=' + myTelNum,
        })
        .then(() => alert('공유가 성공적으로 완료되었습니다.'))
        .catch((error) => console.log('공유에 실패했습니다.', error));
    } else {
      alert('이 브라우저에서는 공유 기능을 사용할 수 없습니다.');
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

      <RoomCount>
        <div>전체 채팅방 개수</div>
        <div>
          <strong>{chatRoomCount}</strong>/{availableChatRoomCount}
        </div>
      </RoomCount>

      <SurveyLinkContainer
        onClick={() => window.open('https://forms.gle/8cjpjit7hVPNfdYc9')}
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
      </SurveyLinkContainer>

      {chatRoomList.length === 0 ? (
        <EmptyContainer>
          <div className="wrap">
            <img src="/assets/empty-icon.svg" alt="empty icon" />
            <div>채팅을 시작해보세요!</div>
          </div>
        </EmptyContainer>
      ) : (
        <>
          {chatRoomList.map((chat) => (
            <ChatRoomListItem
              key={chat.chatRoomId}
              onClick={() => handleClickChatRoom(chat)}
              memberCharacter={chat.memberCharacter}
              department={chat.department}
              mbti={chat.mbti}
              lastMessage={chat.lastMessage}
              modifyDt={chat.modifyDt}
              askedCount={chat.askedCount}
            />
          ))}
          {availableChatRoomCount < 5 && (
            <ShareSection>
              <img
                src="/assets/icon-message.svg"
                alt="share icon"
                width={70}
                height={70}
              />
              <div>
                채팅방 개수가 부족하신가요?
                <br />
                친구에게 디스턴스를 추천해 채팅방을 늘려보세요!
                <br />
                해당 링크로 가입하면 채팅방 개수가 늘어납니다.
              </div>
              <ShareButton onClick={handleClickShareButton}>
                친구에게 추천하기
              </ShareButton>
            </ShareSection>
          )}
        </>
      )}
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

const WrapInboxButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
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

const ShareSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;
  padding: 80px 0;

  color: rgba(0, 0, 0, 0.8);
  text-align: center;
  font-size: 14px;
  font-weight: 200;
  line-height: 20px; /* 142.857% */
`;

const ShareButton = styled.div`
  padding: 8px 26px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
`;

const RoomCount = styled.div`
  display: flex;
  height: 32px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background: #fbfbfb;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);

  text-align: center;
  font-size: 14px;
  font-weight: 200;
  letter-spacing: -0.3px;

  strong {
    font-weight: 600;
  }
`;

const SurveyLinkContainer = styled.div`
  background-color: #f3f3f3;
  text-decoration: none;
  color: black;
  display: flex;
`;

const SurveyContentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  font-weight: 200;

  img {
    height: 80px;
  }
  div {
    padding-right: 2rem;

    .big-font {
      font-size: 1.5rem;
    }

    em {
      font-style: normal;
      font-weight: 600;
    }
  }
`;

export default ChatIndexPage;
