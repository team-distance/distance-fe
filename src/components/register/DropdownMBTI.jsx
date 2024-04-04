import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import useDetectClose from "../../hooks/useDetectClose";

const DropdownMBTI = ({ setState }) => {
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useDetectClose(dropdownRef, false);

  useEffect(() => {
    setState(selected);
  }, [setState, selected]);

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton $selected={selected} onClick={() => setIsOpen(!isOpen)}>
        {selected || "MBTI를 선택해주세요."}
      </DropdownButton>
      {isOpen && (
        <DropdownContent>
          <Placeholder>MBTI를 선택해주세요.</Placeholder>
          {mbtiTypes.map((type) => (
            <DropdownItem
              key={type}
              onClick={() => {
                setSelected(type);
                setIsOpen(false);
              }}>
              {type}
            </DropdownItem>
          ))}
        </DropdownContent>
      )}
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.div`
  padding: 0.75rem 1.25rem;
  background-color: #ffffff;
  border: 2px solid #d9d9d9;
  border-radius: 20px;
  color: ${({$selected}) => $selected ? '#000' : '#D3D3D3'};

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
  width: 100%;
  height: 256px;
  overflow: auto;
  border-radius: 8px;
  background-color: #ffffff;
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
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
];

export default DropdownMBTI;
