import React, { useEffect } from 'react';
import Button from '../common/Button';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { instance } from '../../api/instance';
import toast from 'react-hot-toast';

const CallModal = ({ closeModal, opponentMemberId, roomId }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  const fetchOpponentTelNum = async () => {
    try {
      const res = await instance.get(
        `/member/tel-num?memberId=${opponentMemberId}&chatRoomId=${roomId}`
      );
      window.location.href = `tel:${res.data.telNum}`;
    } catch (error) {
      toast.error('상대방의 전화번호를 가져오는데 실패했어요!', {
        position: 'bottom-center',
      });
    }
  };

  return createPortal(
    <>
      <Backdrop onClick={closeModal} />
      <Modal>
        <CloseButton
          src="/assets/cancel-button-gray.svg"
          alt="닫기 버튼"
          onClick={closeModal}
        />

        <Title>🎉 이제 통화할 수 있어요!</Title>
        <Content>아래 버튼을 눌러 통화해보세요.</Content>

        <Button size="medium" onClick={fetchOpponentTelNum}>
          통화하기
        </Button>
      </Modal>
    </>,
    document.getElementById('modal')
  );
};

export default CallModal;

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
