import React from 'react';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';
import Button from '../common/Button';

const MyProfileModal = ({ closeModal, onClick, myData, handleLogout }) => {
  return (
    <Modal>
      <LogoutButton
        src="/assets/leave-button.svg"
        alt="나가기 버튼"
        onClick={handleLogout}
      />
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />
      <WrapContent>
        <CharacterBackground
          $backgroundColor={CHARACTERS[myData.memberCharacter]?.color}
        >
          <Character
            $xPos={CHARACTERS[myData.memberCharacter]?.position[0]}
            $yPos={CHARACTERS[myData.memberCharacter]?.position[1]}
          />
        </CharacterBackground>
        <TextDiv>
          <MBTI>{myData.mbti}</MBTI>
          <Major>{myData.department}</Major>
        </TextDiv>
        <TagContainer>
          {myData?.memberHobbyDto?.map((hobby, index) => (
            <Badge key={index}>#{hobby.hobby}</Badge>
          ))}
          {myData?.memberTagDto?.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </WrapContent>
      <Button size="medium" onClick={onClick} backgroundColor="#FFAC0B">
        프로필 수정하기
      </Button>
    </Modal>
  );
};

export default MyProfileModal;

const Modal = styled.div`
  position: fixed;
  display: grid;
  gap: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  padding: 48px 32px 32px 32px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 0px #3333334d;
  z-index: 100;
  overflow: hidden;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 25px;
  right: 32px;
`;

const LogoutButton = styled.img`
  width: 24px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 25px;
  left: 32px;
`;

const WrapContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: ${(props) => props.$backgroundColor};
`;

const Character = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 60}px -${props.$yPos * 60}px`};
  background-size: calc(100% * 4);
`;

const TextDiv = styled.div`
  text-align: center;
  line-height: 20px;
  color: #333333;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Major = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
`;
