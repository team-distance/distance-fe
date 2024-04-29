import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TabBar from '../components/common/TabBar';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isLoggedInState } from '../store/auth';
import { instance } from '../api/instance';
import toast, { Toaster } from 'react-hot-toast';
import { myDataState } from '../store/myData';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../firebaseConfig';
import PWAInstallPrompt from '../components/common/PWAInstallPrompt';

const NavLayout = () => {
  const setMyData = useSetRecoilState(myDataState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const navigate = useNavigate();
  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = userAgent.includes('iphone');

  const getMemberId = async () => {
    await instance
      .get('/member/id')
      .then((res) => {
        localStorage.setItem('memberId', res.data);
      })
      .catch((err) => {
        toast.error('회원 정보를 가져오는데 실패했어요!', {
          id: 'member-id-error',
          position: 'bottom-center',
        });
        console.log(err);
      });
  };

  const getMyData = async () => {
    await instance
      .get('/member/profile')
      .then((res) => {
        setMyData(res.data);
      })
      .catch((err) => {
        toast.error('프로필 정보를 가져오는데 실패했어요!', {
          id: 'my-data-error',
          position: 'bottom-center',
        });
        console.log(err);
      });
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('kakao')) {
      navigate('/kakaotalk-fallback');
    }
  }, []);

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('FOREGROUND MESSAGE RECEIVED', payload);
        const notificationTitle = payload.notification.title;
        const notificationBody = payload.notification.body;
        const notificationImage = payload.notification.image;

        toast(
          (t) => (
            <ToastContainer
              onClick={() => {
                navigate('/chat');
                toast.dismiss(t.id);
              }}
            >
              <ToastSectionLeft>
                <ToastIcon src={notificationImage} alt="디스턴스 아이콘" />
                <div>
                  <ToastTitle>{notificationTitle}</ToastTitle>
                  <ToastBody>{notificationBody}</ToastBody>
                </div>
              </ToastSectionLeft>
              <ToastSectionRight>
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

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMemberIdAndMyData = async () => {
      await getMemberId();
      await getMyData();
    };

    fetchMemberIdAndMyData();
  }, [isLoggedIn]);

  return (
    <>
      <PWAInstallPrompt />
      <Padding $isIphone={isIphone}>
        <Outlet />
      </Padding>
      <TabBar />
      <Toaster
        containerStyle={{
          bottom: isIphone ? '116px' : '96px',
        }}
      />
    </>
  );
};

const Padding = styled.div`
  padding-bottom: ${(props) => (props.$isIphone ? '96px' : '74px')};
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
`;

const ToastSectionRight = styled.div`
  display: flex;
  align-items: center;
`;

const ToastIcon = styled.img`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-right: 16px;
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

export default NavLayout;
