import React from 'react';
import styled from 'styled-components';

const MatchingConfigButton = ({ onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <img
        src="/assets/home/matching-config.png"
        alt="matching config button"
      />
    </StyledButton>
  );
};

export default MatchingConfigButton;

const StyledButton = styled.button`
  position: fixed;
  left: 1.5rem;
  bottom: calc(74px + 10px + env(safe-area-inset-bottom));
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px 0px #0000001a;

  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    filter: brightness(0.6);
  }

  img {
    width: 25px;
  }
`;
