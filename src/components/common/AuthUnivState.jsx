import React, { useEffect } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AuthUnivState = () => {
  const queryClient = useQueryClient();

  const { data: authUniv } = useQuery({
    queryKey: ['authUniv'],
    queryFn: () => instance.get('/member/check/university'),
  });

  useEffect(() => {
    queryClient.setQueryDefaults(['authUniv'], {
      staleTime: authUniv?.data === 'SUCCESS' && Infinity,
    });
  }, [authUniv?.data]);

  switch (authUniv?.data) {
    case 'SUCCESS':
      return;
    case 'PENDING':
      return (
        <Wrapper $authUniv={authUniv?.data}>
          <img
            className="icon"
            src="/assets/auth-warning.svg"
            alt="경고 아이콘"
          />
          <div>교내 학생 심사 중</div>
        </Wrapper>
      );
    case 'FAILED_1':
    case 'FAILED_2':
    case 'FAILED_3':
    case 'FAILED_4':
    case 'FAILED_5':
    case 'FAILED_6':
    case 'FAILED_7':
      return (
        <Wrapper $authUniv={authUniv?.data}>
          <img className="icon" src="/assets/auth-fail.svg" alt="실패 아이콘" />
          <div>교내 학생 인증 실패</div>
        </Wrapper>
      );
    default:
      return;
  }
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
