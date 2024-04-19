import styled from 'styled-components';

const ButtonStyle = styled.button`
  width: 100%;
  white-space: nowrap;
  font-weight: 600;

  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  color: #fbfbfb;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: none;
  border-radius: ${({ $size }) => ($size === 'large' ? '1rem' : '0.5rem')};
  height: ${({ $size }) =>
    $size === 'large'
      ? '4rem'
      : $size === 'medium'
      ? '2.7rem'
      : $size === 'small'
      ? '2rem'
      : '1rem'};
  font-size: ${({ $size }) =>
    $size === 'large'
      ? '1.2rem'
      : $size === 'medium'
      ? '1rem'
      : $size === 'small'
      ? '0.8rem'
      : '1rem'};
  &:disabled {
    background-color: #d9d9d9;
    color: #333333;
  }
`;

const Button = ({ children, size, backgroundColor = '#FF625D', ...props }) => {
  return (
    <ButtonStyle $size={size} $backgroundColor={backgroundColor} {...props}>
      {children}
    </ButtonStyle>
  );
};

export default Button;
