import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../../components/common/Badge';

const ChatInboxPage = () => {
  const [inboxList, setInboxList] = useState([]);
  const navigate = useNavigate();

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
      const createdChatRoom = await instance
        .get(`/waiting/accept/${chatWaitingId}`)
        .then((res) => res.data);
      navigate(`/chat/${createdChatRoom}`, {
        state: {
          myId: myMemberId,
          opponentId: opponentMemberId,
          roomId: createdChatRoom,
        },
      });
    } catch (error) {
      switch (error.response.data.code) {
        case 'TOO_MANY_MY_CHATROOM':
          alert(
            '이미 생성된 채팅방 5개입니다. 기존 채팅방을 지우고 다시 시도해주세요.'
          );
          break;
        case 'TOO_MANY_OPPONENT_CHATROOM':
          alert(
            '상대방이 이미 생성된 채팅방 5개입니다. 상대방과 연결에 실패했습니다.'
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
    try {
      await instance.delete(`/waiting/${chatWaitingId}`);
      fetchInboxList();
    } catch (error) {
      alert('요청 거절에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    fetchInboxList();
  }, []);

  return (
    <>
      <Title>요청함</Title>
      {inboxList.length !== 0 ? (
        inboxList.map((inbox) => (
          // 탈퇴한 사용자의 경우 캐릭터가 "?"로 표시되어야 하나
          // 현재는 곰 캐릭터로 표시되도록 설정되어 있음
          // 추후 컴포넌트 분리할 때 이 부분도 같이 해결하겠슴다
          <InboxContainer key={inbox.waitingRoomId}>
            {inbox.memberCharacter === null ? (
              <CharacterBackground $backgroundColor={'#C3C3C3'}>
                <img src={'/assets/home/profile-null.png'} alt="탈퇴" />
              </CharacterBackground>
            ) : (
              <CharacterBackground
                $backgroundColor={CHARACTERS[inbox.memberCharacter]?.color}
              >
                <StyledImage
                  $xPos={CHARACTERS[inbox.memberCharacter]?.position[0]}
                  $yPos={CHARACTERS[inbox.memberCharacter]?.position[1]}
                />
              </CharacterBackground>
            )}

            <div className="right-section">
              <Profile>
                <div className="department">{inbox.department}</div>
                <Badge>{inbox.mbti}</Badge>
              </Profile>
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
        ))
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/empty-inbox.svg'} alt="empty icon" />
            <div>요청함이 비어있어요!</div>
          </div>
        </EmptyContainer>
      )}
    </>
  );
};

export default ChatInboxPage;

const InboxContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px 0;

  > .right-section {
    display: grid;
    flex: 1;
    gap: 0.5rem;

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
  background-color: ${(props) => props.$backgroundColor};
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 40%;
  }
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
  font-size: 18px;
  font-weight: 700;
  min-width: 0;

  .department {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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
