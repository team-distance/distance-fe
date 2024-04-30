import React, { useState } from 'react';
import styled from 'styled-components';

const NotificationSolutionPage = () => {
  const [selectedTab, setSelectedTab] = useState('Safari');

  const handleClickTab = (e) => {
    setSelectedTab(e.target.id);
  };

  return (
    <WrapPage>
      <WrapHeader>
        <div className="title-big">알림을 허용해주세요!</div>
        <div className="title-small">
          알림을 허용해서 채팅을 실시간으로 확인해보세요.
        </div>
      </WrapHeader>
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
          <Box>
            <h3>STEP 1</h3>
            <img
              className="screenshot"
              src="/assets/kakaotalk-fallback/ios-step1.png"
              alt="이미지1"
            />
            <p>
              하단{' '}
              <img
                className="icon"
                src="/assets/kakaotalk-fallback/ios-share.png"
                alt="공유하기 버튼"
              />{' '}
              버튼을 터치합니다.
            </p>
          </Box>

          <Box>
            <h3>STEP 2</h3>
            <img
              className="screenshot"
              src="/assets/kakaotalk-fallback/ios-step2.png"
              alt="이미지2"
            />
            <p>
              <strong>'Safari로 열기'</strong>를 터치합니다.
            </p>
          </Box>
        </WrapBox>
      )}
    </WrapPage>
  );
};

export default NotificationSolutionPage;

const WrapHeader = styled.header`
  margin-bottom: 2rem;
  .title-big {
    font-size: 2rem;
    font-weight: 700;
  }
  .title-small {
    font-size: 0.8rem;
    font-weight: 700;
    color: #979797;
  }
`;

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

const Box = styled.div`
  background-color: #fff1f1;
  padding: 16px;
  text-align: center;
  border-radius: 24px;

  img.screenshot {
    width: 100%;
    filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.25));
  }

  p {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;

    img.icon {
      width: 24px;
    }
  }

  h3 {
    color: #ff625d;
  }
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
