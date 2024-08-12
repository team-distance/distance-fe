import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../register/TextInput';

const ReportModal = ({ closeModal, onClick, setIsMenuOpen }) => {
  const [reportMessage, setReportMessage] = useState('');

  return (
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
            onClick(reportMessage);
            closeModal();
            setIsMenuOpen(false);
          }}
        >
          신고하기
        </ReportButton>
        <CancelButton onClick={()=> {closeModal(); setIsMenuOpen(false);}}>취소하기</CancelButton>
      </WrapButton>
    </Modal>
  );
};

export default ReportModal;

const Modal = styled.div`
  position: fixed;
  top: 43%;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
  background-color: white;
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
