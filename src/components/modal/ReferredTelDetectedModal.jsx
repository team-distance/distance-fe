import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const ReferredTelDetectedModal = ({ closeModal }) => {
  const navigate = useNavigate();

  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <div>
        추천받은 링크로 접속해주셨네요!
        <br />
        바로 가입하시겠어요?
      </div>

      <Button
        size="medium"
        onClick={() => {
          closeModal();
          navigate('/register/user');
        }}
      >
        가입하기
      </Button>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  display: grid;
  width: 60%;
  gap: 1rem;
  padding: 32px;
  padding-top: 56px;
  top: 50%;
  left: 50%;
  background-color: white;
  border-radius: 20px;
  z-index: 100;
  transform: translate(-50%, -50%);
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

export default ReferredTelDetectedModal;
