import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const ChristmasEventAnnouncementModal = ({ closeModal }) => {
  const dismissForever = () => {
    const dismissedList = localStorage.getItem('dismissForever') || [];
    dismissedList.push({ name: 'christmasEventAnnouncement', type: 'modal' });
    localStorage.setItem('dismissForever', JSON.stringify(dismissedList));
  };

  return (
    <Modal>
      <Heading1>크리스마스 이벤트</Heading1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Heading2>메시지를 3번 보낼 때마다 새로운 질문이 생성돼요!</Heading2>
        <Paragraph>
          서로 질문에 답변하면 크리스마스 트리에 장식품이 하나씩 생성됩니다.
          <br />
          장식품을 10개를 완성하면 상대방과 함께 자동으로 응모됩니다.
        </Paragraph>
      </div>

      <Paragraph>
        화면 오른쪽 위 트리를 눌러 현황을 확인할 수 있습니다.
      </Paragraph>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Small>경품: CGV 영화티켓 (3팀)</Small>
        <Small>추첨일: 2024년 12월 25일(수)</Small>
      </div>

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

export default ChristmasEventAnnouncementModal;

const Modal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 24px;
  transform: translate(-50%, -50%);
  justify-content: space-between;
  width: 90%;
  min-height: 451px;
  box-sizing: border-box;
  padding: 72px 32px 32px 32px;
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
  margin-bottom: 20px;
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
