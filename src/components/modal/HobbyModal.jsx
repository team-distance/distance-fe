import React from 'react';
import { createPortal } from 'react-dom';
import { HOBBY } from '../../constants/profile';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const HobbyModal = ({
  isOpen,
  onClose,
  selectedList,
  hashtagCount,
  onClick,
}) => {
  if (!isOpen) {
    document.body.style = 'overflow: auto';
    return null;
  } else {
    document.body.style = 'overflow: hidden';
    return createPortal(
      <>
        <Backdrop onClick={onClose} />
        <Modal>
          <Title>
            <div>취미 선택하기</div>
            <img
              src="/assets/cancel-button.png"
              alt="닫기 버튼"
              onClick={onClose}
            />
          </Title>
          <Body>
            {HOBBY.map((value) => (
              <ListItem
                key={value}
                onClick={() => {
                  if (hashtagCount >= 5) {
                    toast.error('해시태그는 5개까지만 선택 가능해요!', {
                      id: 'hashtag-limit',
                    });
                    return;
                  } else if (selectedList.includes(value)) {
                    toast.error('이미 선택한 해시태그에요!', {
                      id: 'hashtag-duplicate',
                    });
                    return;
                  }
                  onClick([...selectedList, value]);
                  onClose();
                }}
                color={selectedList.includes(value) ? '#FF625D' : 'black'}
              >
                {value}
              </ListItem>
            ))}
          </Body>
        </Modal>
      </>,
      document.getElementById('modal')
    );
  }
};

export default HobbyModal;

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
  top: 50%;
  left: 50%;
  width: 327px;
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
  max-height: 256px;
  overflow: auto;
  margin-top: 0.5rem;
`;

const ListItem = styled.div`
  color: ${(props) => props.color};
  padding: 0.5rem 1.3rem;
`;
