import React from 'react';
import styled from 'styled-components';

const TopBar = () => {
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
  position: relative;
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

export default TopBar;
