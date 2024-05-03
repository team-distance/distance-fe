import styled from 'styled-components';
import Marquee from 'react-fast-marquee';

const Banner = ({ text1, text2 }) => {
  return (
    <WrapBanner>
      <Marquee speed="90">
        <BannerText>
          <div className="text">
            {text1}
            <em>{text2}</em>
          </div>
          <div className="text-invisible">{text1}</div>
        </BannerText>
      </Marquee>
    </WrapBanner>
  );
};
export default Banner;

const WrapBanner = styled.div`
  display: flex;
  padding: 9px 10px;
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
