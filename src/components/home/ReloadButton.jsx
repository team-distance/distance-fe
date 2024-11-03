import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  CLICK_THRESHOLD_DURATION,
  DISABLE_DURATION,
  MAX_CLICKS_ALLOWED,
} from '../../constants/clickControlConfig';

const ReloadButton = ({ onClick }) => {
  const [clickCount, setClickCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [remainingTimeToReload, setRemainingTimeToReload] = useState(0);
  const intervalRef = useRef(null);

  const resetClickCount = () => {
    setClickCount(0);
    clearTimeout(intervalRef.current);
  };

  useEffect(() => {
    if (clickCount > 0 && clickCount < MAX_CLICKS_ALLOWED) {
      intervalRef.current = setTimeout(() => {
        resetClickCount();
      }, CLICK_THRESHOLD_DURATION);
    } else if (clickCount >= MAX_CLICKS_ALLOWED) {
      setIsDisabled(true);
      setRemainingTimeToReload(DISABLE_DURATION / 1000);

      const intervalId = setInterval(() => {
        setRemainingTimeToReload((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            setIsDisabled(false);
            resetClickCount();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearTimeout(intervalRef.current);
  }, [clickCount]);

  const handleClick = () => {
    if (!isDisabled) {
      setClickCount((prevCount) => prevCount + 1);
      onClick();
    }
  };

  return (
    <StyledButton onClick={handleClick} disabled={isDisabled}>
      {isDisabled && (
        <div className="time-remaining">{remainingTimeToReload}</div>
      )}
      <img src="/assets/home/reload-button.png" alt="Reload button" />
    </StyledButton>
  );
};

export default ReloadButton;

const StyledButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: calc(74px + 10px + env(safe-area-inset-bottom));
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px 0px #0000001a;
  transition: 0.3s;

  > .time-remaining {
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: 700;
    color: #000000;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:disabled {
    filter: brightness(0.6);
  }
`;
