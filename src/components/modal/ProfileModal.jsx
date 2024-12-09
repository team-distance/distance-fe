import React from 'react';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ProfileModal = ({
  closeModal,
  onClick,
  isButtonClicked,
  selectedProfile,
}) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />
      <WrapContent>
        <CharacterBackground
          $backgroundColor={
            CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]?.color
          }
        >
          <img src="/assets/christmas/christmas-hat.png" alt="산타모자" />
          <Character
            $xPos={
              CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]
                ?.position[0]
            }
            $yPos={
              CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]
                ?.position[1]
            }
          />
        </CharacterBackground>
        <TextDiv>
          <MBTI>{selectedProfile.memberProfileDto.mbti}</MBTI>
          <Major>{selectedProfile.memberProfileDto.department}</Major>
        </TextDiv>
        <TagContainer>
          {selectedProfile.memberProfileDto.memberHobbyDto.map(
            (hobby, index) => (
              <Badge key={index}>#{hobby.hobby}</Badge>
            )
          )}
          {selectedProfile.memberProfileDto.memberTagDto.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </WrapContent>
      <Button size="medium" onClick={onClick} disabled={isButtonClicked}>
        메시지 보내기
      </Button>
    </Modal>
  );
};

export default ProfileModal;

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
  background-color: ${(props) => props.$backgroundColor};

  img {
    width: 3rem;
    position: absolute;
    top: ${(props) => (props.$backgroundColor === '#D9EAD3' ? '5%' : '0%')};
    left: ${(props) => (props.$backgroundColor === '#D9EAD3' ? '21%' : '20%')};
    z-index: 99;
  }
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
  line-height: 1;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
`;
