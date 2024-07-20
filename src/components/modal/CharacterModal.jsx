import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';

const CharacterModal = ({ closeModal, onClick }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  return createPortal(
    <>
      <Backdrop onClick={closeModal} />
      <Modal>
        <Title>
          <div>캐릭터 선택하기</div>
          <img
            src="/assets/cancel-button.png"
            alt="닫기 버튼"
            onClick={closeModal}
          />
        </Title>
        <Body>
          {Object.entries(CHARACTERS).map(
            ([character, characterProperties]) => (
              <Character
                key={character}
                onClick={() => {
                  onClick(character);
                  closeModal();
                }}
                $xPos={characterProperties?.position[0]}
                $yPos={characterProperties?.position[1]}
              />
            )
          )}
        </Body>
      </Modal>
    </>,
    document.getElementById('modal')
  );
};

export default CharacterModal;

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 10px #3333334d;
  z-index: 100;
  overflow: hidden;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #ff625d;
  color: white;
  font-size: 18px;
  padding: 22px 28px;
  font-weight: 700;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  gap: 20px;
  padding: 40px;
`;

const Character = styled.div`
  width: 48px;
  height: 48px;
  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 48}px -${props.$yPos * 48}px`};
  background-size: calc(100% * 4);
`;
