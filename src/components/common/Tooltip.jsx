import React, { useRef } from 'react';
import styled from 'styled-components';
import useDetectClose from '../../hooks/useDetectClose';

const Tooltip = ({ message }) => {
  const tooltipRef = useRef();
  const [isVisible, setIsVisible] = useDetectClose(tooltipRef, false);

  return (
    <TooltipIcon ref={tooltipRef} onClick={() => setIsVisible(!isVisible)}>
      {isVisible && message && (
        <Message $isOpen>
          <Tail />
          {message}
        </Message>
      )}
    </TooltipIcon>
  );
};

const TooltipIcon = styled.div`
  position: relative;
  font-weight: 700;
  color: #979797;
  border: 1.5px solid #979797;
  border-radius: 100%;
  display: inline-block;
  text-align: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  box-sizing: border-box;
  cursor: pointer;

  &::before {
    content: '!';
  }
`;

const Message = styled.div`
  position: absolute;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px;
  background-color: #333333;
  color: #ffffff;
  white-space: nowrap;
  border-radius: 12px;
`;

const Tail = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #333333;
`;

export default Tooltip;
