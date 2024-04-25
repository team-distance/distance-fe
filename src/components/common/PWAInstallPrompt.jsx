import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const PWAInstallPrompt = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [prompt, setPropmt] = useState(null);

  const handleClick = () => {
    setIsOpened(false);
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = prompt.userChoice;
    console.log('outcome', outcome);
    setPropmt(null);
  };

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isDeviceIos = userAgent.includes('iphone');
    setIsIos(isDeviceIos);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setPropmt(e);
      setIsOpened(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (isIos && !navigator.standalone) setIsOpened(true);
  }, [isIos]);

  return (
    isOpened &&
    (isIos ? (
      <Layout>
        <TitleRow>
          <div>
            <strong style={{ color: '#FF625D' }}>디스턴스</strong>를 설치하고
            <br />
            메시지 알림을 받아보세요!
          </div>
          <img
            onClick={() => setIsOpened(false)}
            src="/assets/cancel-button-gray.svg"
            alt="닫기"
          />
        </TitleRow>
        <IosNotification>
          <div className="left-section">
            <img
              src="/assets/PWAInstallPrompt/distance-icon.svg"
              alt="디스턴스 아이콘"
              className="ios-notification-icon"
            />
          </div>
          <div className="right-section">
            <div className="title-section">
              <div className="title">경영학과ENFJ#4</div>
              <div className="timestamp">1분 전</div>
            </div>
            <div className="content">새로운 메시지가 도착했습니다!</div>
          </div>
        </IosNotification>
        <div style={{ verticalAlign: 'middle' }}>
          하단{' '}
          <img
            style={{ verticalAlign: 'middle', margin: '0 4px' }}
            src="/assets/PWAInstallPrompt/ios-share-button.svg"
            alt="공유 버튼"
          />{' '}
          버튼에서 <strong>'홈 화면에 추가'</strong>를 선택하세요.
        </div>
      </Layout>
    ) : (
      <Layout>
        <TitleRow>
          <div>
            <strong style={{ color: '#FF625D' }}>디스턴스</strong>를 설치하고
            <br />
            메시지 알림을 받아보세요!
          </div>
          <img
            onClick={() => setIsOpened(false)}
            src="/assets/cancel-button-gray.svg"
            alt="닫기"
          />
        </TitleRow>
        <AndroidNotification>
          <div className="left-section">
            <img
              src="/assets/PWAInstallPrompt/distance-icon.svg"
              alt="디스턴스 아이콘"
              className="android-notification-icon"
            />
            <div className="message-content">
              <div className="title-section">
                <div className="title">경영학과ENFJ#4</div>
                <div className="dot">•</div>
                <div className="timestamp">1분</div>
              </div>
              <div className="content">새로운 메시지가 도착했습니다!</div>
            </div>
          </div>
          <div className="right-section">
            <img
              src="/assets/PWAInstallPrompt/android-expand-button.svg"
              alt="확장 버튼"
            />
          </div>
        </AndroidNotification>

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div style={{ width: '50%' }}>
            <Button size="medium" onClick={handleClick}>
              1초만에 설치하기
            </Button>
          </div>
        </div>
      </Layout>
    ))
  );
};

const Layout = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #ffffff;
  border-radius: 0px 0px 16px 16px;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const IosNotification = styled.div`
  display: flex;
  gap: 10px;
  padding: 14px;
  border-radius: 24px;
  background-color: #f1f1f1;

  .left-section {
    img {
      width: 38px;
      border-radius: 8.5px;
    }
  }

  .right-section {
    flex-grow: 1;

    .title-section {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        color: #000000;
        font-size: 15px;
        font-weight: 600;
        line-height: 20px; /* 133.333% */
        letter-spacing: -0.4px;
      }
      .timestamp {
        color: #939393;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 153.846% */
      }
    }
  }

  .content {
    color: #000000;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.4px;
  }
`;

const AndroidNotification = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background-color: #e6e9e7;

  .left-section {
    display: flex;
    gap: 14px;

    img {
      border-radius: 100%;
    }

    .message-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .title-section {
        display: flex;
        align-items: center;
        gap: 4px;

        .title {
          color: #191c1b;
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0.15px;
        }

        .dot,
        .timestamp {
          font-size: 12px;
          color: #3f4946;
          font-weight: 400;
          line-height: 16px;
          letter-spacing: 0.4px;
        }
      }

      .content {
        color: #3f4946;
        color: var(--AOSP-sys-light-on-surface-variant, #3f4946);
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0.25px;
      }
    }
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export default PWAInstallPrompt;
