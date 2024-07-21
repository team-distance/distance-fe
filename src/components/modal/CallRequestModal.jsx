import React from 'react';
import Button from '../common/Button';
import styled from 'styled-components';

const CallRequestModal = ({ closeModal, onClick }) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <Title>📞 통화를 요청할까요?</Title>
      <Content>
        상대방이 요청을 수락하면
        <br />
        서로의 번호로 통화할 수 있어요.
      </Content>

      <Button
        size="medium"
        onClick={() => {
          onClick();
          closeModal();
        }}
      >
        요청하기
      </Button>
    </Modal>
  );
};

export default CallRequestModal;

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
