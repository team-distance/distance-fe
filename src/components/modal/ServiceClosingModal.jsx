import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const ServiceClosingModal = ({ closeModal }) => {
  const dismissForever = () => {
    const dismissedList = localStorage.getItem('dismissForever') || [];
    dismissedList.push({ name: 'serviceClosing', type: 'modal' });
    localStorage.setItem('dismissForever', JSON.stringify(dismissedList));
  };

  return (
    <Modal>
      <Heading1>디스턴스가 곧 운영이 종료돼요! 👋🏻</Heading1>

      <Paragraph>
        디스턴스는 2024년 12월 31일(화)까지 서비스를 이용할 수 있습니다.
        <br />
        서비스 종료 이후에는 채팅방에 접속할 수 없으니, 대화 중인 사람과
        연락처를 교환하시는 것을 권장드립니다.
      </Paragraph>

      <Paragraph>지금까지 디스턴스를 사랑해주셔서 감사합니다 💕</Paragraph>

      <div
        style={{
          width: '70%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Button size="medium" onClick={closeModal}>
          확인
        </Button>
        <DontShowAgain
          onClick={() => {
            dismissForever();
            closeModal();
          }}
        >
          다시 보지 않기
        </DontShowAgain>
      </div>
    </Modal>
  );
};

export default ServiceClosingModal;

const Modal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 24px;
  transform: translate(-50%, -50%);
  width: 90%;
  box-sizing: border-box;
  padding: 72px 24px 24px 24px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 0px #3333334d;
  z-index: 100;
  overflow: hidden;
  text-align: center;
  text-wrap: balance;
  word-break: keep-all;
`;

const Heading1 = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.7px;
`;

const Heading2 = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.7px;
`;

const Paragraph = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.7px;
`;

const Small = styled.small`
  font-size: 0.75rem;
  font-weight: 200;
  line-height: 24px;
  letter-spacing: -0.7px;
`;

const DontShowAgain = styled.small`
  font-size: 0.75rem;
  font-weight: 200;
  line-height: normal;
  letter-spacing: -0.36px;
`;
