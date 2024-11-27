import React, { useRef } from 'react';
import styled from 'styled-components';

const TextArea = ({ onChange, maxRows = 4, ...props }) => {
  const textAreaRef = useRef(null);

  const handleResizeHeight = () => {
    textAreaRef.current.style.height = 'auto';
    const lineHeight = parseInt(
      getComputedStyle(textAreaRef.current).lineHeight
    );
    const maxHeight = lineHeight * maxRows;
    const newHeight = Math.min(textAreaRef.current.scrollHeight, maxHeight);
    textAreaRef.current.style.height = newHeight + 'px';
  };

  return (
    <StyledTextArea
      ref={textAreaRef}
      onChange={(e) => {
        handleResizeHeight();
        onChange && onChange(e);
      }}
      {...props}
    />
  );
};

export default TextArea;

const StyledTextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid #d9d9d9;
  outline: none;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  overflow-y: auto;

  &:focus {
    outline: none;
    border-bottom: 2px solid #ff625d;
  }

  &::placeholder {
    color: #d9d9d9;
  }
`;
