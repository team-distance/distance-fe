import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Tooltip from '../common/Tooltip';

const TopBar = ({
  distance,
  // isCallActive,
  // openCallDistanceModal,
  // handleClickCallButton,
  roomId,
  opponentProfile,
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
          <div
            onClick={() =>
              navigate(`/chat/${roomId}/christmas-event`, {
                state: {
                  opponentProfile,
                },
              })
            }
          >
            <img src="/assets/tree-icon.svg" alt="트리버튼" />
          </div>
          {/* {isCallActive ? (
            <div onClick={handleClickCallButton}>
              <img src="/assets/callicon-active.svg" alt="전화버튼" />
            </div>
          ) : (
            <div
              onClick={openCallDistanceModal}
              style={{ position: 'relative' }}
            >
              <img src="/assets/callicon.svg" alt="전화버튼" />
            </div>
          )} */}
        </CallButton>
      </div>
    </TopBarWrapper>
  );
};

const TopBarWrapper = styled.div`
  position: relative;
  padding: 12px 16px;
  height: 48px;
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

export default TopBar;
