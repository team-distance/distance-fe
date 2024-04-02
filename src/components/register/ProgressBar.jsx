import React from 'react';
import styled from 'styled-components';

const UlProgress = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0; // 상단과 하단에 여백 추가
  width: 50%;
  margin: 0; // 기본 마진 제거
  position: relative; // 수평 선을 위한 포지셔닝 기준

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background-image: ${ ({$step}) => $step > 0 ? `linear-gradient(to right, #FF625D, #D3D3D3 ${$step * 50}%)` : 'none'};
    z-index: 0;
  }
`;

const ProgressPoint = styled.li`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$active}) => ($active ? '#FF625D' : '#D3D3D3')};
  z-index: 1;

  text-align: center;
  color: ${({$active}) => ($active ? 'white' : 'black')};
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.2rem;
`;

const ProgressBar = ({progress}) => {

  return (
    <UlProgress $step={progress}>
      <ProgressPoint $active={progress >= 1}>1</ProgressPoint>
      <ProgressPoint $active={progress >= 2}>2</ProgressPoint>
      <ProgressPoint $active={progress >= 3}>3</ProgressPoint>
    </UlProgress>
  );
};

export default ProgressBar;