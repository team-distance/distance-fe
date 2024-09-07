import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { UNIVERSITY_LIST } from '../../constants/UNIVERSITY_LIST';

const FloatingInput = ({ onSubmit, onChange, value, onClickRelatedSearch }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // input 밖을 클릭하면 focus를 해제
  useEffect(() => {
    const clickHandler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsFocused(false);
        inputRef.current.blur();
      }
    };

    window.addEventListener('click', clickHandler);

    return () => {
      window.removeEventListener('click', clickHandler);
    };
  }, []);

  return (
    <StyledForm onSubmit={onSubmit}>
      <Input
        ref={inputRef}
        placeholder="학교명을 입력해주세요"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        $isFocused={isFocused}
      />
      {isFocused && (
        <RelatedSearchList>
          {UNIVERSITY_LIST.filter((university) =>
            university.includes(value)
          ).map((university) => (
            <li
              onClick={() => {
                onClickRelatedSearch(university);
              }}
              key={university}
            >
              {university}
            </li>
          ))}
        </RelatedSearchList>
      )}
      <SearchButton type="submit" disabled={value.length}>
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
  border-radius: ${(props) => (props.$isFocused ? '20px 20px 0 0' : '20px')};
  border: none;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #d3d3d3;
  }
`;

// 연관 검색어 목록
const RelatedSearchList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 140px;
  overflow-y: auto;
  background-color: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0 0 20px 20px;
  z-index: 1;
  font-size: 14px;
  background-color: #eeeeee;

  li {
    padding: 10px 16px;
    border-bottom: 1px solid #d0d0d0;
    cursor: pointer;
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
