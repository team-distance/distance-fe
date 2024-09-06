import React, { useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { bottomsheetState } from '../../store/bottomsheetState';
import styled from 'styled-components';

const ExpandableBottomsheet = ({ children }) => {
  const [yPosition, setYPosition] = useRecoilState(bottomsheetState);
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef(null);

  const handleTouchStart = () => {
    const rect = handleRef.current.getBoundingClientRect();
    setYPosition(rect.top);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const y = e.touches[0].clientY;
    if (y >= 100 && y <= window.innerHeight / 2) setYPosition(y);
  };

  const handleTouchEnd = () => {
    if (
      Math.abs(100 - yPosition) < Math.abs(window.innerHeight / 2 - yPosition)
    ) {
      setYPosition(100);
    } else {
      setYPosition(window.innerHeight / 2);
    }
    setIsDragging(false);
  };

  return (
    <Wrapper onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
      <Sheet
        style={{
          top: `${yPosition}px`,
        }}
        $isDragging={isDragging}
        onTouchStart={yPosition === 100 ? null : handleTouchStart}
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
  height: 744px;
  background-color: white;
  border-radius: 25px 25px 0 0;
  position: fixed;
  transition: ${(props) => !props.$isDragging && 'top 0.25s ease-out'};
  pointer-events: auto;
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
  overflow-y: auto;
  height: 590px;
`;
