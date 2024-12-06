import React from 'react';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';
import { getDisplayTime } from '../../utils/getDisplayTime';

const ChatRoomListItem = ({
  chatRoomId,
  onClick,
  memberCharacter,
  department,
  mbti,
  lastMessage,
  modifyDt,
  askedCount,
}) => {
  const timeDisplay = modifyDt ? getDisplayTime(modifyDt) : '(알수없음)';

  const characterXpos = CHARACTERS[memberCharacter]?.position[0];
  const characterYpos = CHARACTERS[memberCharacter]?.position[1];
  const characterColor = CHARACTERS[memberCharacter]?.color;

  const getMessageToDisplay = (lastMessage) => {
    if (lastMessage.includes('s3.ap-northeast')) {
      return '사진을 전송하였습니다.';
    }
    if (lastMessage.includes('새로운 질문이 도착했어요!')) {
      return '새로운 질문이 도착했어요!';
    }

    return lastMessage;
  };

  return (
    <ChatRoomContainer key={chatRoomId} onClick={onClick}>
      {memberCharacter ? (
        <CharacterBackground $backgroundColor={characterColor}>
          <StyledImage $xPos={characterXpos} $yPos={characterYpos} />
        </CharacterBackground>
      ) : (
        <CharacterBackground $backgroundColor="#C3C3C3">
          <img src="/assets/home/profile-null.png" alt="탈퇴" />
        </CharacterBackground>
      )}

      <div className="profile-section">
        <Profile>
          <div className="department">{department}</div>
          <div>{mbti && <Badge>{mbti}</Badge>}</div>
        </Profile>

        <Message>{getMessageToDisplay(lastMessage)}</Message>
      </div>

      <div className="right-section">
        <Time>{timeDisplay}</Time>
        {askedCount > 0 ? <UnreadCount>{askedCount}</UnreadCount> : <br />}
      </div>
    </ChatRoomContainer>
  );
};

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

const UnreadCount = styled.div`
  background-color: #ff625d;
  color: #ffffff;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.6rem;
  font-weight: 600;
`;

export default ChatRoomListItem;
