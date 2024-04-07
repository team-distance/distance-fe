import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ToggleContainer = styled.div`
  display: flex;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
`;

const ToggleOption = styled.div`
  flex: 1;
  padding: 10px 20px;
  text-align: center;
  background-color: ${({ $isActive }) => ($isActive ? "#FF625D" : "#FBFBFB")};
  color: ${({ $isActive }) => ($isActive ? "white" : "black")};
  transition: background-color 0.3s, color 0.3s;
  border-radius: ${({$option}) => $option === "남" ? "20px 0 0 20px" : "0 20px 20px 0"};
`;

const ToggleSwitch = ({ options = ["남", "여"], setState }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setState(activeIndex === 1 ? "F" : "M");
  }, [setState, activeIndex]);

  return (
    <div>
      <ToggleContainer>
        {options.map((option, index) => (
          <ToggleOption
            key={index}
            $isActive={index === activeIndex}
            $option={option}
            onClick={() => setActiveIndex(index)}>
            {option}
          </ToggleOption>
        ))}
      </ToggleContainer>
    </div>
  );
};

export default ToggleSwitch;
