import React from 'react';
import styled from 'styled-components';

const ConstructionPage = () => {
  return (
    <Wrapper>
      <div>
        <div>
          <img
            width={100}
            className="logo"
            src="/assets/logo-pink.png"
            alt="디스턴스 로고"
          />
          <br />
          <br />
          서비스 점검중입니다.
          <br />더 나은 서비스로 돌아올게요!
        </div>
      </div>
    </Wrapper>
  );
};

export default ConstructionPage;

const Wrapper = styled.div`
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
