import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';

const OpponentProfileModal = ({ closeModal, opponentProfile }) => {
  return createPortal(
    <>
      <Backdrop onClick={closeModal} />
      <Modal>
        <CloseButton
          src="/assets/cancel-button-gray.svg"
          alt="닫기 버튼"
          onClick={closeModal}
        />
        <WrapContent>
          <CharacterBackground
            backgroundColor={CHARACTERS[opponentProfile.memberCharacter]?.color}
          >
            <Character
              $xPos={CHARACTERS[opponentProfile.memberCharacter]?.position[0]}
              $yPos={CHARACTERS[opponentProfile.memberCharacter]?.position[1]}
            />
          </CharacterBackground>
          <TextDiv>
            <MBTI>{opponentProfile.mbti}</MBTI>
            <Major>{opponentProfile.department}</Major>
          </TextDiv>
          <TagContainer>
            {opponentProfile.memberHobbyDto.map((hobby, index) => (
              <Badge key={index}>#{hobby.hobby}</Badge>
            ))}
            {opponentProfile.memberTagDto.map((tag, index) => (
              <Badge key={index}>#{tag.tag}</Badge>
            ))}
          </TagContainer>
        </WrapContent>
      </Modal>
    </>,
    document.getElementById('modal')
  );
};

export default OpponentProfileModal;

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 100;
`;

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
  background-color: ${(props) => props.backgroundColor};
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
