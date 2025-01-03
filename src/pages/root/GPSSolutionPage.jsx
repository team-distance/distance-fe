import React, { useState } from 'react';
import HeaderPrev from '../../components/common/HeaderPrev';
import styled from 'styled-components';

const GPSSolutionPage = () => {
  const [selectedTab, setSelectedTab] = useState('Safari');

  const handleClickTab = (e) => {
    setSelectedTab(e.target.id);
  };

  return (
    <WrapPage>
      <HeaderPrev
        title="GPS 문제 해결"
        navigateTo={-1}
        text="위치 접근을 허용해서 주변 이성과 채팅해보세요."
      />
      <div style={{ color: 'red', fontWeight: '600', fontSize: '12px' }}>
        위치 정보가 없으면 다른 이성에게 내 프로필이 보이지 않아요!
      </div>
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
            1. 설정 접속 후 <strong>개인정보 보호 및 보안</strong>을 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-1.png"
              alt="iOS1"
              width={48}
            />
            <img
              src="/assets/gps-troubleshooting/ios-2.png"
              alt="iOS2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. <strong>위치 서비스</strong>를 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-3.png"
              alt="iOS3"
              width={250}
            />
          </ImageAlign>
          <div>
            3. <strong>위치 서비스</strong>를 켜 주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-4.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            4. 아래로 스크롤해 <strong>Safari 웹 사이트</strong>를 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-5.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            5. 위치 접근 허용을 <strong>앱을 사용하는 동안</strong>으로
            바꿔주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-6.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            6. 설정 홈으로 나가 <strong>Safari</strong>를 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-7.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            7. 아래로 스크롤해 <strong>위치</strong>를 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-8.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            8. 위치 접근을 <strong>허용</strong>해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/ios-9.png"
              alt="iOS4"
              width={250}
            />
          </ImageAlign>
          <div>
            9. distance 앱을 <strong>종료 후 재로그인</strong>해주세요.
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
              src="/assets/gps-troubleshooting/chrome-1.png"
              alt="크롬1"
              width={48}
            />
            <img
              src="/assets/gps-troubleshooting/chrome-2.png"
              alt="크롬2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. 설정에 들어가 <strong>사이트 설정 메뉴</strong>를 클릭해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/chrome-3.png"
              alt="크롬3"
              width={112}
            />
            <img
              src="/assets/gps-troubleshooting/chrome-4.png"
              alt="크롬4"
              width={180}
            />
          </ImageAlign>
          <div>
            3. <strong>위치</strong>를 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/chrome-5.png"
              alt="크롬5"
              width={250}
            />
          </ImageAlign>
          <div>
            4. <strong>dis-tance.com</strong>에 들어가 위치 접근을 허용해주세요.
          </div>

          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/chrome-6.png"
              alt="크롬6"
              width={250}
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
              src="/assets/gps-troubleshooting/samsung-1.png"
              alt="삼성1"
              width={48}
            />
            <img
              src="/assets/gps-troubleshooting/samsung-2.png"
              alt="삼성2"
              width={200}
            />
          </ImageAlign>
          <div>
            2. 설정에 들어가 <strong>인터넷 사용 기록</strong>을 찾아주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/samsung-3.png"
              alt="삼성3"
              width={144}
            />
            <img
              src="/assets/gps-troubleshooting/samsung-4.png"
              alt="삼성4"
              width={144}
            />
          </ImageAlign>
          <div>
            3. <strong>인터넷 사용 기록 삭제</strong>를 눌러주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/samsung-5.png"
              alt="삼성5"
              width={250}
            />
          </ImageAlign>
          <div>
            4. 데이터를 <strong>삭제</strong>해주세요.
          </div>
          <ImageAlign>
            <img
              src="/assets/gps-troubleshooting/samsung-6.png"
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

export default GPSSolutionPage;

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
