import styled from 'styled-components';
import Marquee from 'react-fast-marquee';
import React from 'react';

const Banner = ({ alertText }) => {
  return (
    <WrapBanner>
      <Marquee speed="90">
        <BannerText>
          {alertText.map((alert) => (
            <React.Fragment key={alert.index}>
              <div className="text">
                {alert.text1}
                <em>{alert.em}</em>
                {alert.text2}
              </div>
              <div className="text-invisible">
                {/* 여백용 텍스트 */}
                📢 distance는 이성만 매칭됩니다! 👥 현재 순천향대 학생 가입
              </div>
            </React.Fragment>
          ))}
        </BannerText>
      </Marquee>
    </WrapBanner>
  );
};
export default Banner;

const WrapBanner = styled.div`
  display: flex;
  padding: 9px 0;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;

  border-radius: 8px;
  background: var(--white, #fff);
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const BannerText = styled.div`
  display: flex;
  text-align: center;
  font-size: 0.6rem;
  font-weight: 600;
  white-space: nowrap;
  align-items: center;
  color: black;

  em {
    font-style: normal;
    padding-left: 0.1rem;
    animation: blink 1s steps(1, end) infinite;
  }

  .text-invisible {
    visibility: hidden;
  }

  @keyframes blink {
    0% {
      color: black;
    }
    50% {
      color: #ff625d;
    }
  }
`;
