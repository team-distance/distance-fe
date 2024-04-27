import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import { instance } from '../../api/instance';
import { useNavigate, useLocation } from 'react-router-dom';
import { CHARACTERS, COLORS } from '../../constants/character';
import Badge from '../../components/common/Badge';

const ChatInboxPage = () => {
  const [inboxList, setInboxList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchInboxList = async () => {
    setInboxList(location.state.inboxList);
  };

  const handleAcceptChat = async (
    myMemberId,
    opponentMemberId,
    chatWaitingId
  ) => {
    await instance
      .get(`/waiting/accept/${chatWaitingId}`)
      .then((res) => {
        const createdChatRoom = res.data;
        navigate(`/chat/${createdChatRoom}`, {
          state: {
            myId: myMemberId,
            opponentId: opponentMemberId,
            roomId: createdChatRoom,
          },
        });
      })
      .catch((error) => {
        switch (error.response.data.code) {
          case 'TOO_MANY_MY_CHATROOM':
            alert(
              '이미 생성된 채팅방 3개입니다. 기존 채팅방을 지우고 다시 시도해주세요.'
            );
            break;
          case 'TOO_MANY_OPPONENT_CHATROOM':
            alert(
              '상대방이 이미 생성된 채팅방 3개입니다. 상대방과 연결에 실패했습니다.'
            );
            break;
          default:
            alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
            break;
        }
      });

    fetchInboxList(); // 새로고침
  };

  const handleDenyChat = async (chatWaitingId) => {
    await instance
      .delete(`/waiting/${chatWaitingId}`)
      .then((res) => {
        fetchInboxList(); // 새로고침
      })
      .catch((error) => {
        alert('요청 거절에 실패했습니다. 다시 시도해주세요.');
      });
  };

  useEffect(() => {
    fetchInboxList();
  }, []);

  return (
    <PagePadding>
      <Header />
      <Title>요청함</Title>
      {inboxList.length !== 0 ? (
        inboxList.map((inbox) => {
          return (
            <InboxContainer key={inbox.waitingRoomId}>
              <CharacterBackground $character={inbox.memberCharacter}>
                <img
                  src={CHARACTERS[inbox.memberCharacter]}
                  alt={inbox.memberCharacter}
                />
              </CharacterBackground>

              <div className="right-section">
                <div className="upper-area">
                  <Profile>
                    {inbox.department}
                    <Badge>{inbox.mbti}</Badge>
                  </Profile>
                </div>
                <div className="lower-area">
                  <AcceptButton
                    onClick={() => {
                      const isAccepted =
                        window.confirm('요청을 수락하시겠습니까?');
                      if (isAccepted) {
                        handleAcceptChat(
                          inbox.loveReceiverId,
                          inbox.loveSenderId,
                          inbox.waitingRoomId
                        );
                      }
                    }}
                  >
                    수락하기
                  </AcceptButton>
                  <DenyButton
                    onClick={() => {
                      const isAccepted =
                        window.confirm('요청을 거절하시겠습니까?');

                      if (isAccepted) {
                        handleDenyChat(inbox.waitingRoomId);
                      }
                    }}
                  >
                    거절하기
                  </DenyButton>
                </div>
              </div>
            </InboxContainer>
          );
        })
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/empty-inbox.svg'} alt="empty icon" />
            <div>요청함이 비어있어요!</div>
          </div>
        </EmptyContainer>
      )}
    </PagePadding>
  );
};

export default ChatInboxPage;

const PagePadding = styled.div`
  padding: 2rem 1.5rem;
`;

const InboxContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 0;

  > .right-section {
    display: grid;
    flex: 1;
    gap: 0.5rem;

    > .upper-area {
      display: flex;
      justify-content: space-between;
    }

    > .lower-area {
      display: flex;
      gap: 0.5rem;

      > button {
        flex: 1;
      }
    }
  }
`;

const Title = styled.div`
  color: #000000;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
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
`;

const AcceptButton = styled.button`
  background-color: #ff625d;
  border: none;
  color: white;
  border-radius: 10px;
  padding: 8px 0;
  font-weight: 600;
  font-size: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
`;

const DenyButton = styled.button`
  background: #d3d3d3;
  border: none;
  color: white;
  border-radius: 10px;
  padding: 8px 0;
  font-weight: 600;
  font-size: 8px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64vh;

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
