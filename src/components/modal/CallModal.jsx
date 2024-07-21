import React from 'react';
import Button from '../common/Button';
import styled from 'styled-components';

const CallModal = ({ closeModal, onClick }) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <Title>🎉 이제 통화할 수 있어요!</Title>
      <Content>아래 버튼을 눌러 통화해보세요.</Content>

      <Button
        size="medium"
        onClick={() => {
          onClick();
          closeModal();
        }}
      >
        통화하기
      </Button>
    </Modal>
  );
};

export default CallModal;

const Modal = styled.div`
  width: 60%;
  display: grid;
  gap: 1rem;
  padding: 32px;
  text-align: center;
  line-height: normal;

  strong {
    font-weight: 600;
  }
`;

const CloseButton = styled.img`
  position: absolute;
  top: 25px;
  right: 32px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Content = styled.div`
  font-size: 14px;
  font-weight: 200;
`;
