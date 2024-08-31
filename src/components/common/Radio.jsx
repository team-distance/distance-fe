import React from 'react';
import styled from 'styled-components';

const Radio = ({ children, ...props }) => {
  return (
    <Label>
      <Input type="radio" {...props} />
      {children}
    </Label>
  );
};

const Label = styled.label`
  font-size: 10px;
  font-weight: 300;
  display: inline-flex;
  align-items: center;
`;

const Input = styled.input`
  appearance: none;
  border: 1px solid #d3d3d3;
  border-radius: 50%;
  width: 14px;
  height: 14px;

  &:checked {
    border-color: #ff625d;
  }

  &:checked::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ff625d;
    margin: 2px;
  }
`;

export default Radio;
