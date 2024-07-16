import React from 'react';
import styled from 'styled-components';

const Checkbox = ({ label, register, ...props }) => {
  return (
    <Label>
      <Input type="checkbox" {...props} {...register} />
      {label}
    </Label>
  );
};

const Label = styled.label`
  font-weight: 200;
`;

const Input = styled.input`
  appearance: none;
  -webkit-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  border-radius: 0.2rem;
  border: 2px solid #000;

  &:checked {
    border: none;
    background-color: #ff625d;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23fff'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/%3E%3C/svg%3E");
  }
`;

export default Checkbox;
