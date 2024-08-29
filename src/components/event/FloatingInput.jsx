import React from 'react';
import styled from 'styled-components';

const FloatingInput = ({ onSubmit, onChange }) => {
  return (
    <StyledForm onSubmit={onSubmit}>
      <Input placeholder="학교명을 입력해주세요" onChange={onChange} />
      <SearchButton type="submit">
        <img src="/assets/search-button.svg" alt="search" />
      </SearchButton>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  position: absolute;
  top: 16px;
  left: 50%;
  width: 75%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  z-index: 1;
  padding: 10px 16px;
  font-size: 14px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  border: none;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #d3d3d3;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  padding: 0;

  img {
    width: 20px;
    height: 20px;
  }
`;

export default FloatingInput;
