import React from 'react';
import styled from 'styled-components';

const Badge = ({ children }) => {
  return (
    <Background>
      <Contents>{children}</Contents>
    </Background>
  );
};

const Background = styled.span`
  border-radius: 12px;
  background: #f0f0f0;
  padding: 3px 8px;
`;

const Contents = styled.div`
  color: #000000;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export default Badge;
