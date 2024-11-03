import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const KakaotalkFallback = () => {
  const [selectedTab, setSelectedTab] = useState('iOS');
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickTab = (e) => {
    setSelectedTab(e.target.id);
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (!userAgent.includes('kakao')) {
      navigate(location.search ? `/?${location.search}` : '/');
    }
  }, []);

  return (
    <Wrapper>
      <img src="/assets/logo-pink.png" alt="디스턴스 로고" width={100} />
      <Heading>
        아래의 방법으로
        <br />
        디스턴스에 접속해주세요!
      </Heading>
      <Small>
        브라우저 호환성 이슈 때문에
        <br />
        카카오톡 인앱 브라우저에서는 사용할 수 없어요.
      </Small>

      <br />
      <br />

      <TabMenu>
        <Tab
          id="iOS"
          $isSelected={selectedTab === 'iOS'}
          onClick={handleClickTab}
        >
          iOS
        </Tab>
        <Tab
          id="Android"
          $isSelected={selectedTab === 'Android'}
          onClick={handleClickTab}
        >
          Android
        </Tab>
      </TabMenu>

      {selectedTab === 'iOS' ? (
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
            <p>'Safari로 열기' 를 터치합니다.</p>
          </Box>
        </WrapBox>
      ) : (
        <WrapBox>
          <Box>
            <h3>STEP 1</h3>
            <img
              className="screenshot"
              src="/assets/kakaotalk-fallback/android-step1.png"
              alt="이미지1"
            />
            <p>
              하단{' '}
              <img
                className="icon"
                src="/assets/kakaotalk-fallback/android-share.png"
                alt="공유하기 버튼"
              />{' '}
              버튼을 터치합니다.
            </p>
          </Box>

          <Box>
            <h3>STEP 2</h3>
            <img
              className="screenshot"
              src="/assets/kakaotalk-fallback/android-step2.png"
              alt="이미지2"
            />
            <p>'다른 브라우저로 열기' 를 터치합니다.</p>
          </Box>
        </WrapBox>
      )}
    </Wrapper>
  );
};

export default KakaotalkFallback;

const Wrapper = styled.div`
  padding: 2rem 1rem;
`;

const Heading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const Small = styled.small`
  font-size: 12px;
  color: #777;
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
    margin-top: 0.5rem;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;

    img.icon {
      width: 24px;
    }
  }

  h3 {
    font-weight: 600;
    color: #ff625d;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
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
