import React from 'react';
import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';

const Loader = () => {
  return (
    <LoaderContainer>
      <ClipLoader color="#FF625D" size={50} />
    </LoaderContainer>
  );
};

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export default Loader;
