import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import TabBar from '../components/common/TabBar';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';
import PWAInstallPrompt from '../components/common/PWAInstallPrompt';
import Header from '../components/common/Header';
import { useCheckGpsActive } from '../hooks/useCheckGpsActive';
import { useCheckAlarmActive } from '../hooks/useCheckAlarmActive';
import { useToast } from '../hooks/useToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggedInState } from '../store/auth';
import { registerDataState } from '../store/registerDataState';
import { CHARACTERS } from '../constants/CHARACTERS';

const NavLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchParams = new URLSearchParams(useLocation().search);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setRegisterData = useSetRecoilState(registerDataState);

  useEffect(() => {
    const referredTel = searchParams.get('referredTel');

    // 추천인으로부터 전달받은 링크에서 접속했으며 로그인 상태가 아닌 경우 추천인 전화번호를 전역 상태에 저장
    if (referredTel && !isLoggedIn) {
      setRegisterData((prev) => ({
        ...prev,
        referredTel,
      }));
    }
  }, []);

  const isGpsActive = useCheckGpsActive();
  const isAlarmActive = useCheckAlarmActive();

  const { showToast: showAlarmGPSErrorToast } = useToast(
    () => (
      <>
        <span style={{ textAlign: 'center' }}>
          알림과 위치 설정이 꺼져있어요!
          <br />
          <Link to="/mypage" style={{ color: '#0096FF' }}>
            해결하기
          </Link>
        </span>
      </>
    ),
    'alarm-gps-disabled',
    'bottom-center',
    'none'
  );

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('kakao')) {
      navigate('/kakaotalk-fallback');
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const isFirstLogin = localStorage.getItem('isFirstLogin');

    if (isFirstLogin === 'true') {
      if (!isGpsActive || !isAlarmActive) {
        console.log('알림, 위치 권한을 허용해주세요!');
        showAlarmGPSErrorToast();
        localStorage.setItem('isFirstLogin', 'false');
      }
    }
  }, [isGpsActive, isAlarmActive]);

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('FOREGROUND MESSAGE RECEIVED', payload);

        const title = payload?.data?.title;
        const icon = payload?.data?.icon;
        const body = payload?.data?.body;
        const image = payload?.data?.image;

        const imageViaCdn =
          image?.replace(
            'https://distance-buckets.s3.ap-northeast-2.amazonaws.com',
            'https://cdn.dis-tance.com'
          ) + '?w=120&h=120&f=webp&q=75';

        toast(
          (t) => (
            <ToastContainer
              onClick={() => {
                navigate('/chat');
                toast.dismiss(t.id);
              }}
            >
              <ToastSectionLeft>
                {icon === 'DISTANCE' ? (
                  <img
                    width={40}
                    height={40}
                    style={{ borderRadius: '8px' }}
                    src="/icons/apple-touch-icon-60x60.png"
                    alt="알림 아이콘"
                  />
                ) : (
                  <CharacterBackground
                    $backgroundColor={CHARACTERS[icon]?.color}
                  >
                    <StyledImage
                      $xPos={CHARACTERS[icon]?.position[0]}
                      $yPos={CHARACTERS[icon]?.position[1]}
                    />
                  </CharacterBackground>
                )}

                <div>
                  <ToastTitle>{title}</ToastTitle>
                  <ToastBody>
                    {body.includes('buckets.s3.ap-northeast-2.amazonaws.com')
                      ? '사진을 전송하였습니다.'
                      : body}
                  </ToastBody>
                </div>
              </ToastSectionLeft>
              <ToastSectionRight>
                {image !== 'null' && <ToastImage src={imageViaCdn} alt="" />}
                <ToastCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                  }}
                >
                  <img src="/assets/cancel-button-gray.svg" alt="닫기 아이콘" />
                </ToastCloseButton>
              </ToastSectionRight>
            </ToastContainer>
          ),
          {
            id: 'foreground-message',
            style: {
              width: '100%',
            },
            duration: 5000,
            position: 'top-center',
          }
        );
      });
    }
  }, []);

  return (
    <>
      <PWAInstallPrompt />

      {pathname.includes('/event') ? (
        <Outlet />
      ) : (
        <Padding>
          <Header />
          <Outlet />
        </Padding>
      )}

      <TabBar />
    </>
  );
};

const Padding = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

const ToastContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToastSectionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToastSectionRight = styled.div`
  display: flex;
  align-items: center;
`;

const ToastImage = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin-right: 16px;
  border-radius: 8px;
`;

const ToastTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const ToastCloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: none;

  img {
    width: 16px;
    height: 16px;
    -webkit-tap-highlight-color: transparent;
  }
`;

const ToastBody = styled.div`
  font-size: 14px;
  color: #333333;

  // wrap content
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all; // 문단으로 끊어져서 줄바꿈 됨
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  background-color: ${(props) => props.$backgroundColor};
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 40%;
  }
`;

const StyledImage = styled.div`
  position: absolute;
  width: 32px;
  height: 32px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 32}px -${props.$yPos * 32}px`};
  background-size: calc(100% * 4);
`;

export default NavLayout;
