import React from 'react';
import styled from 'styled-components';
import { TiKiTaKa } from '../../constants/TiKiTaKaCount';
import { calcTiKiTaKaPercent } from '../../utils/calcTiKiTaKaPercent';

const CallDistanceModal = ({ closeModal, tikitakaCount }) => {
  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />
      <div>
        <Text>통화까지 남은 거리</Text>
        <Distance>
          {TiKiTaKa >= tikitakaCount ? TiKiTaKa - tikitakaCount : 0}M
        </Distance>
      </div>
      <StatusBar $checkTikitaka={calcTiKiTaKaPercent(TiKiTaKa, tikitakaCount)}>
        <div className="filled" />
      </StatusBar>
      <Text>
        대화를 통해 상대와의 거리를 좁혀 보세요 일정 대화 수를 충족하면 통화
        버튼이 활성화됩니다
      </Text>
    </Modal>
  );
};

export default CallDistanceModal;

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

const Text = styled.div`
  font-size: 0.8rem;
  font-weight: 400;
`;

const Distance = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatusBar = styled.div`
  width: 100%;
  height: 0.5625rem;
  background-color: #d9d9d9;
  border-radius: 0.63rem;
  position: relative;

  .filled {
    position: absolute;
    left: 0;
    width: ${({ $checkTikitaka }) => `${$checkTikitaka}%`};
    height: 0.5625rem;
    background-color: #ff625d;
    border-radius: 0.63rem;
  }
`;
