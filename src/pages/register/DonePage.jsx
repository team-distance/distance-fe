import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLoggedInState, login } from '../../store/auth';
import { useSetRecoilState } from 'recoil';
import { onGetToken } from '../../firebaseConfig';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const DonePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // const telNum = location.state.telNum;
  // const password = location.state.password;
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    // const instantLogin = async () => {
    //   if ('Notification' in window && Notification.permission !== 'granted') {
    //     alert('알림, 위치 권한을 허용해주세요!');
    //   }
    //   // clientToken 없어도 로그인 가능
    //   // 로딩 상태 설정
    //   setLoading(true);
    //   let clientToken = null;
    //   // clientToken 가져오기를 시도
    //   // 브라우저에서 최초로 앱을 실행할 때, clientToken이 없을 수 있음
    //   // 그래서 1회 시도 후 실패하면 다시 시도
    //   try {
    //     clientToken = await onGetToken();
    //     localStorage.setItem('clientToken', clientToken);
    //   } catch (err) {
    //     clientToken = await onGetToken().catch((error) => console.log(error));
    //     localStorage.setItem('clientToken', clientToken);
    //   }
    //   // 로그인 시도 (clientToken이 null일 수도 있음)
    //   try {
    //     await login({ telNum, password, clientToken });
    //     setIsLoggedIn(true);
    //   } catch (err) {
    //     console.log(err);
    //     toast.error('홈화면으로 이동해서 다시 로그인해주세요!');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // instantLogin();
  }, []);

  return (
    <Background>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
      <WrapContent>
        <WrapMessage>
          <div style={{ fontSize: '60px' }}>🎊</div>
          <Heading2>가입이 완료되었습니다!</Heading2>
          <p>학생 인증을 마치면 채팅 기능을 사용할 수 있어요</p>
        </WrapMessage>
        <WrapButton>
          <Button
            size="large"
            onClick={() => {
              navigate('/verify/univ');
            }}
            disabled={loading}
          >
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#fff',
                }}
              >
                <ClipLoader color={'#fff'} loading={true} size={16} />
                <div>로그인 중...</div>
              </div>
            ) : (
              <div>학생 인증하기</div>
            )}
          </Button>
          <MoveToHome
            onClick={() => {
              navigate('/');
            }}
          >
            홈으로 이동
          </MoveToHome>
        </WrapButton>
      </WrapContent>
    </Background>
  );
};

const Background = styled.div`
  width: 100dvw;
  height: 100dvh;
`;

const WrapContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const WrapMessage = styled.div`
  text-align: center;

  p {
    font-size: 0.75rem;
  }
`;

const Heading2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
`;

const WrapButton = styled.div`
  width: 80%;
  position: absolute;
  bottom: 2rem;
`;

const MoveToHome = styled.div`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  margin-top: 1rem;
`;

export default DonePage;
