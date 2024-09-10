import React from 'react';
import styled from 'styled-components';

const Backdrop = () => {
  return <StyledBackdrop />;
};

export default Backdrop;

const StyledBackdrop = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
`;
