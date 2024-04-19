import styled from 'styled-components';
import Button from '../common/Button';
import { useId, useState, useEffect } from 'react';

const Label = styled.label`
  font-weight: 700;
  color: #333333;

  .time-remaining {
    display: inline-block;
    padding-left: 0.5rem;
    font-size: 0.9rem;
    line-height: 0.9rem;
    font-weight: 400;
    color: #d3d3d3;
  }
`;

const Input = styled.input`
  width: 100%;
  padding-top: 1rem;
  flex-grow: 1;
  color: #333333;
  font-size: 1rem;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #d9d9d9;
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 0.3rem;

  &:focus-within {
    border-bottom: 2px solid #ff625d;
  }
`;

const TextInput = ({
  label,
  buttonLabel,
  disabled,
  buttonClickHandler,
  buttonDisabled,
  timerState,
  onTimerEnd,
  ...props
}) => {
  const [timer, setTimer] = useState(timerState);

  useEffect(() => {
    if (timer === 0) {
      onTimerEnd();
    } else {
      const countdown = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(countdown);
    }
  }, [timer, onTimerEnd]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const id = useId();

  return (
    <div>
      {label && (
        <Label htmlFor={id}>
          {label}
          {timerState && (
            <div className="time-remaining">
              {`${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`}
            </div>
          )}
        </Label>
      )}
      <InputWrapper>
        <Input id={id} {...props} />
        {buttonLabel && (
          <div>
            <Button
              size="small"
              disabled={buttonDisabled}
              onClick={buttonClickHandler}
            >
              {buttonLabel}
            </Button>
          </div>
        )}
      </InputWrapper>
    </div>
  );
};

export default TextInput;
