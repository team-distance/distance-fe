import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { authInstance } from "../../api/instance";
import { parseTime } from "../../utils/parseTime";
import Characters from "../../constants/character";
import ClipLoader from "react-spinners/ClipLoader";
/**
 * @todo LINE 61: localStorage에 저장된 대화 내역 삭제
 */
const ChatIndexPage = () => {
  const navigate = useNavigate();
  const [chatList, setChatList] = useState([]);
  const memberId = localStorage.getItem("memberId");
  const [loading, setLoading] = useState(false);

  const fetchChatList = async () => {
    try {
      setLoading(true);
      const res = await authInstance
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
  }, []);

  const handleLeaveChat = async (chatId) => {
    await authInstance.get(`/room-member/leave/${chatId}`).then(() => {
      const localStorageChat = JSON.parse(
        localStorage.getItem("staleMessages")
      );
      delete localStorageChat[chatId];
      localStorage.setItem("staleMessages", JSON.stringify(localStorageChat));
      fetchChatList(); // 새로 고침
    });
  };

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

  return (
    <PagePadding>
      <Header />
      {loading ? (
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
          <Spacer>
            {chatList.length !== 0 ? (
              chatList.map((chat) => {
                return (
                  <ChatRoomContainer
                    key={chat.chatRoomId}
                    to={`/chat/${chat.chatRoomId}`}
                    state={{
                      myId: memberId,
                      opponentId: chat.opponentMemberId,
                      roomId: chat.chatRoomId,
                    }}>
                    <div className="left-section">
                      <ImageContainer>
                        {/* characer에 따라 src 변경 */}
                        <img src={Characters[chat.memberCharacter]} alt="캐릭터" />
                      </ImageContainer>

                      <div className="profile-section">
                        <Profile>{chat.roomName}</Profile>
                        <Message>{chat.lastMessage}</Message>
                      </div>
                    </div>

                    <div className="right-section">
                      <Time>{formatTime(chat.modifyDt)}</Time>
                      <LeaveButton
                        onClick={() => {
                          const isLeave = window.confirm("정말로 나가시겠습니까?");
                          if (isLeave) {
                            handleLeaveChat(chat.chatRoomId);
                          }
                        }}>
                        나가기
                      </LeaveButton>
                    </div>
                  </ChatRoomContainer>
                );
              })
            ) : (
              <div>접속중인 대화방이 없어요!</div>
            )}
          </Spacer>
        </>)}
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
  color: inherit;
  text-decoration-line: none;

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

const Spacer = styled.div`
  display: grid;
  gap: 1rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 9999px;
  box-shadow: 0px 2px 8px 0px rgba(50, 50, 50, 0.66);

  > img {
    position: absolute;
    width: 70%;
    height: 70%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Profile = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Message = styled.div`
  font-size: 0.75rem;
`;

const Time = styled.div`
  color: #898989;
  font-weight: 400;
  font-size: 0.6rem;
`;

const LeaveButton = styled.button`
  background-color: #ff6b6b;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 6px 12px;
  font-weight: 600;
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


export default ChatIndexPage;
