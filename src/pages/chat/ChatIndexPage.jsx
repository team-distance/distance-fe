import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { instance } from "../../api/instance";
import { parseTime } from "../../utils/parseTime";
import { CHARACTERS, COLORS } from "../../constants/character";
import ClipLoader from "react-spinners/ClipLoader";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "../../store/auth";
import Badge from "../../components/common/Badge";

/**
 * @todo LINE 61: localStorage에 저장된 대화 내역 삭제
 */
const ChatIndexPage = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const memberId = localStorage.getItem("memberId");
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const parseRoomName = (str) => {
    // 정규표현식: 학과명(capturing group 1), MBTI(capturing group 2), memberId(capturing group 3)
    const regex = /(.+)([A-Z]{4})#(\d+)/;
    const match = str.match(regex);

    if (match) {
      return {
        department: match[1], // 학과명
        mbti: match[2], // MBTI
        memberId: match[3], // memberId
      };
    } else {
      // 일치하는 패턴이 없을 경우
      return null;
    }
  };

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const res = await instance
        .get("/chatroom")
        .then((res) => res.data)
        .then((data) => {
          const tempResponse = [...data];
          tempResponse.sort(
            (a, b) => new Date(b.modifyDt) - new Date(a.modifyDt)
          );
          return tempResponse;
        });
      setChatList(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatList();

    const eventSource = new EventSource(
      `https://api.dis-tance.com/api/notify/subscribe/${memberId}`
    );

    eventSource.onopen = (event) => {
      console.log("Connection opened");
      console.log(event);
    };

    eventSource.onmessage = (event) => {
      console.log("Message received");
      console.log(event);
    };

    eventSource.onerror = (event) => {
      console.log("Error occurred");
      console.log(event);
    };

    return () => {
      eventSource.close();
    };
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
      return "어제";
    }
    // 그 외 (어제보다 이전의 날짜)
    else {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  };

  const goOutChatroom = async (chat) => {
    if (chat.lastMessage === "상대방이 탈퇴했습니다.") {
      const res = window.confirm("정말로 나가시겠습니까?");
      if (!res) return;
      try {
        await instance.get(`/room-member/leave/${chat.chatRoomId}`)
      } catch(error) {
        console.log(error);
      }
    }
  }

  return (
    <PagePadding>
      <Header />

      {isLoggedIn ? (
        loading ? (
          <LoaderContainer>
            <ClipLoader color={"#FF625D"} loading={loading} size={50} />
          </LoaderContainer>
        ) : (
          <>
            <WrapInboxButton>
              <InboxButton
                onClick={() => {
                  navigate("/inbox");
                }}>
                <div>요청함</div>
                <img src="/assets/arrow-pink-right.svg" alt="화살표 아이콘" />
              </InboxButton>
            </WrapInboxButton>
            {chatList.length !== 0 ? (
              chatList.map((chat) => {
                const roomNameParts = parseRoomName(chat.roomName);

                return (
                  <ChatRoomContainer
                    key={chat.chatRoomId}
                    to={`/chat/${chat.chatRoomId}`}
                    state={{
                      myId: memberId,
                      opponentId: chat.opponentMemberId,
                      roomId: chat.chatRoomId,
                    }}
                    onClick={()=>{goOutChatroom(chat)}}
                    >
                    <div className="left-section">
                      <CharacterBackground $character={chat.memberCharacter}>
                        <img
                          src={CHARACTERS[chat.memberCharacter]}
                          alt={chat.memberCharacter}
                        />
                      </CharacterBackground>

                      <div className="profile-section">
                        {roomNameParts ? (
                          <Profile>
                            {roomNameParts.department}
                            <Badge>{roomNameParts.mbti}</Badge>
                            {/* roomNameParts.memberId */}
                          </Profile>
                        ) : (
                          <Profile>{chat.roomName}</Profile>
                        )}
                        <Message>{chat.lastMessage}</Message>
                      </div>
                    </div>

                    <div className="right-section">
                      <Time>{formatTime(chat.modifyDt)}</Time>
                      {chat.askedCount !== 0 ? (
                        <UnreadCount>{chat.askedCount}</UnreadCount>
                      ) : (
                        <br />
                      )}
                    </div>
                  </ChatRoomContainer>
                );
              })
            ) : (
              <EmptyContainer>
                <div className="wrap">
                  <img src={"/assets/empty-icon.svg"} alt="empty icon" />
                  <div>채팅을 시작해보세요!</div>
                </div>
              </EmptyContainer>
            )}
          </>
        )
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={"/assets/empty-icon.svg"} alt="empty icon" />
            <div>로그인 후 채팅을 시작해보세요!</div>
          </div>
        </EmptyContainer>
      )}
    </PagePadding>
  );
};

const PagePadding = styled.div`
  padding: 2rem 1.5rem;
`;

const ChatRoomContainer = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration-line: none;
  padding: 16px 0;

  > .left-section {
    display: flex;
    align-items: center;
    gap: 12px;

    > .profile-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }

  > .right-section {
    display: flex;
    gap: 12px;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  background-color: ${(props) => COLORS[props.$character]};

  > img {
    position: absolute;
    width: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Profile = styled.div`
  display: flex;
  gap: 4px;
  color: #000000;
  font-size: 18px;
  font-weight: 700;
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
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
    text-align: center; // 텍스트를 중앙 정렬합니다.

    > img {
      margin-bottom: 1rem; // 아이콘과 텍스트 사이의 간격을 조정합니다.
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

export default ChatIndexPage;
