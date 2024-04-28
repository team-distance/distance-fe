import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS, COLORS } from '../../constants/character';
import Badge from '../../components/common/Badge';

/**
 * @todo 채팅 요청함 API 응답 수정되면 myRoomName을 department, mbti로 수정
 */
const ChatInboxPage = () => {
  const [inboxList, setInboxList] = useState([]);
  const navigate = useNavigate();

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

  const fetchInboxList = async () => {
    try {
      const res = await instance.get('/waiting').then((res) => res.data);
      setInboxList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptChat = async (
    myMemberId,
    opponentMemberId,
    chatWaitingId
  ) => {
    try {
      const chatRoomId = await instance.get(`/waiting/accept/${chatWaitingId}`);
      navigate(`/chat/${chatRoomId.data}`, {
        state: {
          myId: myMemberId,
          opponentId: opponentMemberId,
          roomId: chatRoomId.data,
        },
      });
    } catch (error) {
      switch (error?.response?.data?.code) {
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
    }

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
          const roomNameParts = parseRoomName(inbox.myRoomName);

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
                  {roomNameParts ? (
                    <Profile>
                      {roomNameParts.department}
                      <Badge>{roomNameParts.mbti}</Badge>
                      {/* roomNameParts.memberId */}
                    </Profile>
                  ) : (
                    <Profile>{inbox.myRoomName}</Profile>
                  )}
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
