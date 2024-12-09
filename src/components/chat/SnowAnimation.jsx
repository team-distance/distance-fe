import React from 'react';
import styled, { keyframes } from 'styled-components';

const Snowflake = ({ num, style }) => {
  return (
    <SnowflakeImg
      src={`/assets/christmas/snow${num}.png`}
      alt="눈송이"
      style={{
        ...style,
        position: 'absolute', // 눈송이가 화면에 랜덤 배치되도록 추가
        top: 0, // 화면 높이 기준 랜덤 위치
        left: `${Math.random() * 100}vw`, // 화면 너비 기준 랜덤 위치
      }}
    />
  );
};

const makeSnowFlakes = () => {
  let animationDelay = '0s'; // 기본 값은 0초
  let widthSize = '14px'; // 기본 크기
  const arr = Array.from('!!!디스턴스 대박기원!!!'); // length가 15인 배열

  // arr의 length 만큼의 <Snowflake />를 반환
  return arr.map((_, i) => {
    animationDelay = `${(Math.random() * 16).toFixed(2)}s`; // 0~16 사이 랜덤 숫자
    widthSize = `${Math.floor(Math.random() * 10) + 10}px`; // 10~20 사이 정수
    const randomNum = Math.floor(Math.random() * 4) + 1; // 1~4 사이 정수 랜덤 생성
    const style = {
      animationDelay,
      width: widthSize,
    };
    return <Snowflake key={i} num={randomNum} style={style} />;
  });
};

const SnowAnimation = () => {
  return <div className="snow-container">{makeSnowFlakes()}</div>;
};

export default SnowAnimation;

const fall = keyframes`
  0% {
    transform: translateY(-100%) rotate(0deg); /* 화면 위에서 시작, 회전 없음 */
  }
  100% {
    transform: translateY(100vh) rotate(360deg); /* 화면 아래로 이동, 한 바퀴 회전 */
  }
`;

const SnowflakeImg = styled.img`
  position: absolute;
  animation: ${fall} 10s linear infinite;
`;
