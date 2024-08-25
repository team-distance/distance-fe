import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { parseTime } from '../../utils/parseTime';
import { CHARACTERS } from '../../constants/CHARACTERS';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../store/auth';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const ChatIndexPage = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState();
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [waitingCount, setWaitingCount] = useState(0);
  const [authUniv, setAuthUniv] = useState(false);

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const res = await instance
        .get('/chatroom')
        .then((res) => res.data)
        .then((data) => {
          const tempResponse = [...data];
          tempResponse.sort(
            (a, b) => new Date(b.modifyDt) - new Date(a.modifyDt)
          );
          return tempResponse;
        });
      setChatList(res);
      // console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatWaiting = async () => {
    try {
      const res = await instance.get('/waiting').then((res) => res.data);
      setWaitingCount(res.length);
    } catch (error) {
      console.log(error);
    }
  };

  const checkVerified = async () => {
    try {
      const authUniv = await instance.get('/member/check/university');
      if (authUniv.data === 'SUCCESS' || authUniv.data === 'PENDING') {
        setAuthUniv(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatList();
    fetchChatWaiting();
    checkVerified();
  }, []);

  const formatTime = (time) => {
    const today = new Date();
    const date = new Date(time);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 오늘 날짜와 같은 경우
    if (today.toDateString() === date.toDateString()) {
      return parseTime(time);
    }
    // 어제 날짜와 같은 경우
    else if (yesterday.toDateString() === date.toDateString()) {
      return '어제';
    }
    // 그 외 (어제보다 이전의 날짜)
    else {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  const onClickChatroom = async (chat) => {
    if (!authUniv) {
      window.confirm('학생 인증 후 이용해주세요.') && navigate('/verify/univ');
    } else {
      if (chat.opponentMemberId === null) {
        const res = window.confirm('정말로 나가시겠습니까?');
        console.log(res);
        if (!res) return;
        try {
          await instance.get(`/room-member/leave/${chat.chatRoomId}`);
          fetchChatList();
        } catch (error) {
          console.log(error);
        }
      } else {
        navigate(`/chat/${chat.chatRoomId}`);
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
        loading ? (
          <Loader />
        ) : (
          <>
            <WrapInboxButton>
              <InboxButton
                onClick={() => {
                  navigate('/inbox');
                }}
              >
                <div>
                  {waitingCount > 0 && (
                    <UnreadCount>{waitingCount}</UnreadCount>
                  )}
                  <div>요청함</div>
                </div>
                <img src="/assets/arrow-pink-right.svg" alt="화살표 아이콘" />
              </InboxButton>
            </WrapInboxButton>
            {chatList && chatList.length === 0 ? (
              <EmptyContainer>
                <div className="wrap">
                  <img src={'/assets/empty-icon.svg'} alt="empty icon" />
                  <div>채팅을 시작해보세요!</div>
                </div>
              </EmptyContainer>
            ) : (
              <ChatListContainer>
                {chatList &&
                  chatList.map((chat) => {
                    const timeDisplay = chat.modifyDt
                      ? formatTime(chat.modifyDt)
                      : '(알수없음)';

                    return (
                      // 탈퇴한 사용자의 경우 캐릭터가 "?"로 표시되어야 하나
                      // 현재는 곰 캐릭터로 표시되도록 설정되어 있음
                      // 추후 컴포넌트 분리할 때 이 부분도 같이 해결하겠슴다
                      <ChatRoomContainer
                        key={chat.chatRoomId}
                        onClick={() => onClickChatroom(chat)}
                      >
                        <CharacterBackground
                          backgroundColor={
                            CHARACTERS[chat.memberCharacter]?.color
                          }
                        >
                          <StyledImage
                            $xPos={
                              CHARACTERS[chat.memberCharacter]?.position[0]
                            }
                            $yPos={
                              CHARACTERS[chat.memberCharacter]?.position[1]
                            }
                          />
                        </CharacterBackground>

                        <div className="profile-section">
                          <Profile>
                            <div className="department">{chat.department}</div>
                            <div>{chat.mbti && <Badge>{chat.mbti}</Badge>}</div>
                          </Profile>
                          {chat.lastMessage.includes('s3.ap-northeast') ? (
                            <Message>(사진)</Message>
                          ) : (
                            <Message>{chat.lastMessage}</Message>
                          )}
                        </div>

                        <div className="right-section">
                          <Time>{timeDisplay}</Time>
                          {chat.askedCount > 0 ? (
                            <UnreadCount>{chat.askedCount}</UnreadCount>
                          ) : (
                            <br />
                          )}
                        </div>
                      </ChatRoomContainer>
                    );
                  })}
              </ChatListContainer>
            )}
            <SurveyLinkContainer
              onClick={() => window.open('https://forms.gle/6ZgZvLD2iSM5LVuEA')}
            >
              <SurveyContentBox>
                <img src={'/assets/chicken.png'} alt="chicken" />
                <div>
                  <div className="big-font">
                    <em>설문</em>하고 <br />
                  </div>
                  치킨받으러가기
                </div>
              </SurveyContentBox>
            </SurveyLinkContainer>
          </>
        )
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/empty-icon.svg'} alt="empty icon" />
            <div>로그인 후 채팅을 시작해보세요!</div>
          </div>
        </EmptyContainer>
      )}
    </>
  );
};

const ChatListContainer = styled.div`
  margin-bottom: 10rem;
`;

const ChatRoomContainer = styled.div`
  display: flex;
  align-items: center;
  text-decoration-line: none;
  padding: 16px 0;

  > .profile-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0 16px;
    min-width: 0;
    flex-grow: 1;
  }

  > .right-section {
    display: flex;
    gap: 12px;
    flex-direction: column;
    flex-shrink: 0;
    align-items: flex-end;
  }
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  background-color: ${(props) => props.backgroundColor};
  flex-shrink: 0;
`;

const StyledImage = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 40}px -${props.$yPos * 40}px`};
  background-size: calc(100% * 4);
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #000000;
  font-size: 18px;
  font-weight: 700;
  position: relative;

  .department {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Message = styled.div`
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Time = styled.div`
  color: #767676;
  text-align: right;
  font-size: 12px;
  font-weight: 400;
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

const SurveyLinkContainer = styled.div`
  width: 100%;
  height: 80px;
  position: fixed;
  z-index: 1;
  bottom: 15%;
  left: 0;
  right: 0;
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
  font-size: 1rem;
  font-weight: 200;

  img {
    height: 80px;
  }
  div {
    padding-right: 3rem;

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
