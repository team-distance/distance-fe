import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Tooltip from '../common/Tooltip';

const TopBar = ({
  distance,
  isCallActive,
  tooltipRef,
  isCallTooltipVisible,
  setIsCallTooltipVisible,
  handleClickCallButton,
}) => {
  const navigate = useNavigate();

  return (
    <TopBarWrapper>
      <BackButton
        onClick={() => {
          navigate('/chat');
        }}
      >
        <img src="/assets/arrow-pink-button.png" alt="뒤로가기" />
      </BackButton>
      <WrapTitle>
        <div className="title">상대방과의 거리</div>
        <div className="subtitle">
          {distance === -1 ? (
            <>
              <Tooltip message="두 명 모두 위치 정보를 공유해야 확인할 수 있어요!" />{' '}
              <span>위치를 표시할 수 없습니다.</span>
            </>
          ) : (
            `${distance}m`
          )}
        </div>
      </WrapTitle>
      <div>
        <CallButton>
          {isCallActive ? (
            <div onClick={handleClickCallButton}>
              <img src="/assets/callicon-active.svg" alt="전화버튼" />
            </div>
          ) : (
            <div
              ref={tooltipRef}
              onClick={() => setIsCallTooltipVisible(!isCallTooltipVisible)}
              style={{ position: 'relative' }}
            >
              <img src="/assets/callicon.svg" alt="전화버튼" />
              {isCallTooltipVisible && (
                <TooltipMessage>
                  <TooltipTail />
                  상대방과 더 대화해보세요!
                </TooltipMessage>
              )}
            </div>
          )}
        </CallButton>
      </div>
    </TopBarWrapper>
  );
};

const TopBarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  padding: 0.75rem 1rem;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 11;
`;

const BackButton = styled.button`
  background: none;
  border: none;

  img {
    width: 12px;
  }
`;

const CallButton = styled.button`
  background: none;
  border: none;
`;

const WrapTitle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  > .title {
    font-size: 1rem;
    line-height: 1.5;
  }

  > .subtitle {
    font-size: 0.8rem;
    color: #979797;
    line-height: 1.5;
  }
`;

const TooltipMessage = styled.div`
  position: absolute;
  font-weight: 700;
  font-size: 10px;
  top: calc(100% + 14px);
  right: -10px;
  text-align: center;
  padding: 10px;
  background-color: #333333;
  color: #ffffff;
  white-space: nowrap;
  border-radius: 12px;
`;

const TooltipTail = styled.div`
  position: absolute;
  top: -8px;
  right: 0;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #333333;
`;

export default TopBar;
