import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import useDetectClose from '../../hooks/useDetectClose';

const Dropdown = ({ label, placeholder, types, value, setValue }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useDetectClose(dropdownRef, false);

  return (
    <div ref={dropdownRef}>
      <Label>{label}</Label>
      <DropdownButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        {value || placeholder}
        <img
          src={isOpen ? '/assets/drop-up.png' : '/assets/drop-down.png'}
          alt="드롭다운 아이콘"
        />
        {isOpen && (
          <DropdownContent>
            <WrapItems>
              {types.map((type) => (
                <DropdownItem
                  key={type}
                  onClick={() => {
                    setValue(type);
                    setIsOpen(false);
                  }}
                >
                  {type}
                </DropdownItem>
              ))}
            </WrapItems>
          </DropdownContent>
        )}
      </DropdownButton>
    </div>
  );
};

const DropdownButton = styled.div`
  position: relative;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  margin-bottom: 1rem;
  color: ${({ $isOpen }) => ($isOpen ? '#ff625d' : '#000000')};

  img {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.1rem;
  }
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
  width: 100%;
  max-height: 256px;
  color: #000000;
  position: absolute;
  top: 3.5rem;
  left: 0;
  overflow: auto;
  background-color: #ffffff;
  z-index: 1;
`;

const WrapItems = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1.25rem;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 700;
  color: #333333;
  margin-bottom: 0.5rem;
`;

export default Dropdown;
