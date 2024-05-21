import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';

const AuthUnivState = () => {
  const [authUniv, setAuthUniv] = useState('');

  const checkVerified = async () => {
    try {
      const res = await instance.get('/member/check/university');
      setAuthUniv(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkVerified();
  }, []);

  return (
    <>
      {authUniv === 'PENDING' && (
        <Wrapper $authUniv={authUniv}>
          <img
            className="icon"
            src="/assets/auth-warning.svg"
            alt="경고 아이콘"
          />
          <div>교내 학생 심사 중</div>
        </Wrapper>
      )}

      {authUniv !== 'SUCCESS' && authUniv !== 'PENDING' && authUniv !== '' && (
        <Wrapper $authUniv={authUniv}>
          <img className="icon" src="/assets/auth-fail.svg" alt="실패 아이콘" />
          <div>교내 학생 인증 실패</div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => {
    if (props.$authUniv === 'PENDING') {
      return '#FFAC0B';
    } else if (props.$authUniv !== 'SUCCESS' && props.$authUniv !== 'PENDING') {
      return '#FF625D';
    }
  }};

  img.icon {
    width: 14px;
  }
`;

export default AuthUnivState;
