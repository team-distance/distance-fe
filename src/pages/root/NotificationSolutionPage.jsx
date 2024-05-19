import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderPrev from '../../components/common/HeaderPrev';

const NotificationSolutionPage = () => {
  const [selectedTab, setSelectedTab] = useState('Safari');

  const handleClickTab = (e) => {
    setSelectedTab(e.target.id);
  };

  return (
    <WrapPage>
      <HeaderPrev
        title="PUSH 알림 문제 해결"
        navigateTo={-1}
        text="알림을 허용해서 채팅을 실시간으로 확인해보세요."
      />
      <br />
      <TabMenu>
        <Tab
          id="Safari"
          $isSelected={selectedTab === 'Safari'}
          onClick={handleClickTab}
        >
          Safari
        </Tab>
        <Tab
          id="Chrome"
          $isSelected={selectedTab === 'Chrome'}
          onClick={handleClickTab}
        >
          Chrome
        </Tab>
        <Tab
          id="Samsung Internet"
          $isSelected={selectedTab === 'Samsung Internet'}
          onClick={handleClickTab}
        >
          삼성 인터넷
        </Tab>
      </TabMenu>

      {selectedTab === 'Safari' && (
        <WrapBox>
          <div>
            1. 설정 접속 후 <strong>distance</strong>를 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/safari-1.png"
              alt="사파리1"
              width={48}
            />
            <img
              src="/assets/notification-troubleshooting/safari-2.png"
              alt="사파리2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. 알림을 <strong>허용</strong>해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/safari-3.png"
              alt="사파리3"
              width={250}
            />
          </ImageAlign>
          <div>
            3. distance 앱을 <strong>종료 후 재로그인</strong>해주세요.
          </div>
        </WrapBox>
      )}

      {selectedTab === 'Chrome' && (
        <WrapBox>
          <div>
            1. Chrome에 접속해 상단의 <strong>... 버튼</strong>을 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/chrome-1.png"
              alt="크롬1"
              width={48}
            />
            <img
              src="/assets/notification-troubleshooting/chrome-2.png"
              alt="크롬2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. 설정에 들어가 <strong>알림 메뉴</strong>를 클릭해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/chrome-3.png"
              alt="크롬3"
              width={112}
            />
            <img
              src="/assets/notification-troubleshooting/chrome-4.png"
              alt="크롬4"
              width={180}
            />
          </ImageAlign>
          <div>
            3. <strong>앱 알림 상세 설정</strong>을 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/chrome-5.png"
              alt="크롬5"
              width={250}
            />
          </ImageAlign>
          <div>
            4. <strong>dis-tance.com</strong>에 들어가 알림을 허용해주세요.
          </div>

          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/chrome-6.png"
              alt="크롬6"
              width={144}
            />
            <img
              src="/assets/notification-troubleshooting/chrome-7.png"
              alt="크롬7"
              width={144}
            />
          </ImageAlign>

          <div>
            5. distance 앱을 <strong>종료 후 재로그인</strong>해주세요.
          </div>
        </WrapBox>
      )}

      {selectedTab === 'Samsung Internet' && (
        <WrapBox>
          <div>
            1. 삼성 인터넷에 들어가 하단의 <strong>메뉴</strong>를 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/samsung-1.png"
              alt="삼성1"
              width={48}
            />
            <img
              src="/assets/notification-troubleshooting/samsung-2.png"
              alt="삼성2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. 설정에 들어가 <strong>인터넷 사용 기록</strong>을 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/samsung-3.png"
              alt="삼성3"
              width={144}
            />
            <img
              src="/assets/notification-troubleshooting/samsung-4.png"
              alt="삼성4"
              width={144}
            />
          </ImageAlign>
          <div>
            3. <strong>인터넷 사용 기록 삭제</strong>를 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/samsung-5.png"
              alt="삼성5"
              width={250}
            />
          </ImageAlign>
          <div>
            4. 데이터를 <strong>삭제</strong>해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/notification-troubleshooting/samsung-6.png"
              alt="삼성6"
              width={250}
            />
          </ImageAlign>
          <div>
            5. distance 앱을 <strong>종료 후 재로그인</strong>해주세요.
          </div>
        </WrapBox>
      )}
    </WrapPage>
  );
};

export default NotificationSolutionPage;

const WrapPage = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const WrapBox = styled.div`
  margin: 1rem 0;
  display: grid;
  gap: 1rem;
`;

const ImageAlign = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
`;

const Tab = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  border-bottom: ${(props) =>
    props.$isSelected ? '3px solid #FF625D' : '3px solid transparent'};
  transition: all 200ms;
`;

const TabMenu = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;
