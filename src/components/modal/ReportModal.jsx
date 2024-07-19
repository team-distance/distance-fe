import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import TextInput from '../register/TextInput';
import { instance } from '../../api/instance';

const ReportModal = ({ isOpen, onClose, opponentMemberId }) => {
  const [reportMessage, setReportMessage] = useState('');

  if (!isOpen) {
    document.body.style = 'overflow: auto';
    return null;
  } else {
    document.body.style = 'overflow: hidden';

    const handleReportUser = async (reportMessage) => {
      try {
        await instance.post('/report', {
          declareContent: reportMessage,
          opponentId: opponentMemberId,
        });
        alert('신고가 완료되었어요!');
      } catch (error) {
        console.log(error);
        alert('이미 신고한 사용자예요! 신고는 한 번만 가능해요.');
      }
    };

    return createPortal(
      <>
        <Backdrop onClick={onClose} />
        <Modal>
          <TextInput
            label="사용자 신고하기"
            placeholder="신고 내용을 입력해주세요."
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
          <WrapButton>
            <ReportButton
              disabled={reportMessage === ''}
              onClick={() => {
                handleReportUser(reportMessage);
                onClose();
              }}
            >
              신고하기
            </ReportButton>
            <CancelButton onClick={onClose}>취소하기</CancelButton>
          </WrapButton>
        </Modal>
      </>,
      document.getElementById('modal')
    );
  }
};

export default ReportModal;

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
  border-radius: 20px;
  box-shadow: 0px 4px 10px 10px #3333334d;
  display: grid;
  gap: 1rem;
  width: 250px;
  padding: 1.25rem;
`;

const WrapButton = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: #ff625d;

  &:disabled {
    color: #e0e0e0;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
`;
