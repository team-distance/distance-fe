import { useRef, useState } from 'react';
import styled from 'styled-components';
import { MenuToggle } from './MenuToggle';
import Menu from './Menu';
import useMenuAnimation from '../../hooks/useMenuAnimation';

const MessageInput = ({
  value,
  buttonClickHandler,
  changeHandler,
  submitHandler,
  isOpponentOut,
}) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scope = useMenuAnimation(isMenuOpen);
  const containerRef = useRef(null);

  const handleFocus = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('focused');
    }
  }

  const handleBlur = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove('focused');
    }
  }

  const onClickPlusButton = () => {
    setIsMenuOpen(prev => !prev);
    // buttonClickHandler() //신고하기 버튼 이벤트
  }

  return (
    <MeassageInputContainer ref={scope}>
      <Menu isOpen={isMenuOpen}/>
      <InputContainer ref={containerRef}>
        <MenuToggle toggle={onClickPlusButton} isOpen={isMenuOpen} />
        <WrapInputForm onSubmit={submitHandler}>
          {isOpponentOut ? (
            <Input
              value={value}
              onChange={changeHandler}
              placeholder="상대방이 나갔습니다."
              disabled
            />
          ) : (
            <Input value={value} onChange={changeHandler} onFocus={handleFocus} onBlur={handleBlur} />
          )}
          <WrapButton type="submit" disabled={isOpponentOut}>
            <img src={'/assets/send-button.png'} alt="보내기" />
          </WrapButton>
        </WrapInputForm>
      </InputContainer>
    </MeassageInputContainer>

  );
};

const MeassageInputContainer = styled.div`

`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  background: #ffffff;
  width: auto;
  padding: 0.5rem 1rem 3rem 1rem;

  @media (max-width: 500px) {
    &.focused {
      padding: 0.5rem 1rem 1rem 1rem;
    }
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 0.2rem 0.4rem;
`;

const WrapInputForm = styled.form`
  display: flex;
  flex: 1;
  align-items: center;
  background: #f8f8f8;
  border: 1px solid #dedede;
  width: auto;
  border-radius: 1rem;
  padding: 0.2rem 0.4rem;
`;

const WrapButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  background-color: transparent;

  &:disabled {
    visibility: hidden;
  }

  img {
    width: 1.5rem;
  }
`;

export default MessageInput;
