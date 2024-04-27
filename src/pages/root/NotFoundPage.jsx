import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <LogoImg src="/assets/logo-pink.png" alt="디스턴스 로고" />

      <Box>
        <img src="/assets/not-found.svg" alt="404 이미지" />
        <div>잘못된 접근입니다!</div>
      </Box>
      <WrapButton>
        <Button
          size="large"
          onClick={() => {
            navigate('/');
          }}
        >
          홈 화면으로 이동
        </Button>
      </WrapButton>
    </Wrapper>
  );
};

export default NotFoundPage;

const Wrapper = styled.div`
  padding: 2rem;
`;

const LogoImg = styled.img`
  width: 8rem;
`;

const Box = styled.div`
  position: absolute;
  display: grid;
  text-align: center;
  gap: 1rem;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 100%;
  }
`;

const WrapButton = styled.div`
  position: absolute;
  width: 80%;
  bottom: 2rem;
  left: 50%;
  transform: translate(-50%);
`;
