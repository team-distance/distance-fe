import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import useDetectClose from '../../hooks/useDetectClose';

const DropdownMBTI = ({ state = '', setState }) => {
  const [selected, setSelected] = useState('');
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useDetectClose(dropdownRef, false);

  useEffect(() => {
    if (state) {
      setSelected(state);
    }
  }, [state]);

  useEffect(() => {
    setState(selected);
  }, [setState, selected]);

  return (
    <div ref={dropdownRef}>
      <DropdownButton $selected={selected} onClick={() => setIsOpen(!isOpen)}>
        {selected || 'MBTI를 선택해주세요.'}
        {isOpen && (
          <DropdownContent>
            <Placeholder>MBTI를 선택해주세요.</Placeholder>
            {mbtiTypes.map((type) => (
              <DropdownItem
                key={type}
                onClick={() => {
                  setSelected(type);
                  setIsOpen(false);
                }}
              >
                {type}
              </DropdownItem>
            ))}
          </DropdownContent>
        )}
      </DropdownButton>
    </div>
  );
};

const DropdownButton = styled.div`
  position: relative;
  padding: 0.75rem 1.25rem;
  background-color: #ffffff;
  border: 2px solid #d9d9d9;
  border-radius: 20px;
  color: ${({ $selected }) => ($selected ? '#000' : '#D3D3D3')};
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 256px;
  overflow: auto;
  box-sizing: border-box;
  border-radius: 20px;
  background-color: #ffffff;
  color: black;
  border: 1px solid #ddd;
  z-index: 1;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Placeholder = styled.div`
  background-color: #ff625d;
  color: #fff;
  padding: 0.75rem 1.25rem;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1.25rem;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const mbtiTypes = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

export default DropdownMBTI;
