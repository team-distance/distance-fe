import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie-player';
import callAnimation from '../../lottie/call-animation.json';

const CallActiveLottie = () => {
  return (
    <LottieContainer>
      <div>
        <Lottie
          animationData={callAnimation}
          play
          style={{ width: 200, height: 200 }}
          loop={false}
        />
      </div>
      <p>
        <strong>전화 버튼이 활성화되었어요!</strong> <br />
        채팅 상대와 전화를 연결해보세요
      </p>
    </LottieContainer>
  );
};

const LottieContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  div {
    transform: rotate(20deg) translateX(10px);
  }

  p {
    color: white;
    text-align: center;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    line-height: 1.5rem;
    strong {
      font-weight: 700;
      font-size: 1rem;
    }
  }
`;

export default CallActiveLottie;
