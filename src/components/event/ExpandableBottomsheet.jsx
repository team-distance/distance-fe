import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { bottomsheetState } from '../../store/bottomsheetState';
import styled from 'styled-components';
import { BOTTOMSHEET_CONFIG } from '../../constants/BOTTOMSHEET_CONFIG';

const ExpandableBottomsheet = ({ children }) => {
  const [yPos, setYPos] = useRecoilState(bottomsheetState);
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef(null);

  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = userAgent.includes('iphone');

  const [EXPANDED_HEIGHT, COLLAPSED_HEIGHT] = (() => {
    const { expandedHeight, collapsedHeight } = BOTTOMSHEET_CONFIG;

    const topPositionOnExpanded = window.innerHeight * (1 - expandedHeight);
    const topPositionOnCollapsed = window.innerHeight * (1 - collapsedHeight);

    return [topPositionOnExpanded, topPositionOnCollapsed];
  })();

  const handleTouchStart = () => {
    const rect = handleRef.current.getBoundingClientRect();
    setYPos(rect.top);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const y = e.touches[0].clientY;
    if (y >= EXPANDED_HEIGHT && y <= COLLAPSED_HEIGHT) setYPos(y);
  };

  const handleTouchEnd = () => {
    if (Math.abs(EXPANDED_HEIGHT - yPos) < Math.abs(COLLAPSED_HEIGHT - yPos)) {
      setYPos(EXPANDED_HEIGHT);
    } else {
      setYPos(COLLAPSED_HEIGHT);
    }
    setIsDragging(false);
  };

  return (
    <Wrapper onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
      <Sheet
        style={{
          top: `${yPos}px`,
        }}
        height={`${BOTTOMSHEET_CONFIG.expandedHeight * 100}%`}
        onTouchStart={yPos === EXPANDED_HEIGHT ? null : handleTouchStart}
        $isDragging={isDragging}
        $isIphone={isIphone}
      >
        <HandleArea ref={handleRef} onTouchStart={handleTouchStart}>
          <Handle />
        </HandleArea>
        <Contents>{children}</Contents>
      </Sheet>
    </Wrapper>
  );
};

export default ExpandableBottomsheet;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Sheet = styled.div`
  width: 100%;
  height: ${(props) => props.height};
  background-color: white;
  border-radius: 25px 25px 0 0;
  position: fixed;
  transition: ${(props) => !props.$isDragging && 'top 0.25s ease-out'};
  pointer-events: auto;
  display: flex;
  flex-direction: column;

  // 하단바 높이만큼 padding-bottom 추가
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
`;

const HandleArea = styled.div`
  width: 100%;
  padding-top: 8px;
  padding-bottom: 44px;
`;

const Handle = styled.div`
  width: 84px;
  height: 4px;
  background-color: #d3d3d3;
  border-radius: 9999px;
  margin: 0 auto;
`;

const Contents = styled.div`
  flex-grow: 1;
  overflow: auto;
`;
