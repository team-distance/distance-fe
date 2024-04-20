import React from 'react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LandingPage = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/home');
    } else {
      navigate('/');
    }
  }, []);

  return (
    <>
      <Background>
        <WrapContent>
          <img src="/assets/logo.svg" alt="디스턴스 로고" />
          <WrapButton>
            <LongButton
              onClick={() => {
                navigate('/register/user');
              }}
            >
              학생 메일로 가입하기
            </LongButton>
            <StyledLink to="/login">로그인</StyledLink>
          </WrapButton>
        </WrapContent>
      </Background>
    </>
  );
};

const Background = styled.div`
  height: 100vh;
  background-color: #ff625d;
`;

const WrapContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const WrapButton = styled.div`
  display: grid;
  gap: 1rem;
  text-align: center;
  position: absolute;
  bottom: 2rem;
`;

const LongButton = styled.div`
  background-color: #ffac0b;
  font-weight: 600;
  color: #333333;
  border: none;
  padding: 1.5rem 6.5rem;
  border-radius: 1rem;
`;

const StyledLink = styled(Link)`
  color: #ffffff;
`;

export default LandingPage;
