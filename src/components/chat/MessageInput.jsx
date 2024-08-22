import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MenuToggle } from './MenuToggle';
import Menu from './Menu';
import useMenuAnimation from '../../hooks/useMenuAnimation';

const MessageInput = ({
  value,
  uploadedImage,
  setUploadedImage,
  file,
  setFile,
  leaveButtonClickHandler,
  reportButtonClickHandler,
  changeHandler,
  submitHandler,
  isOpponentOut,
  isMenuOpen,
  setIsMenuOpen,
}) => {
  const containerRef = useRef(null);

  const scope = useMenuAnimation(isMenuOpen);

  const handleFocus = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('focused');
    }
  };

  const handleBlur = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove('focused');
    }
  };

  const onClickPlusButton = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler();
    setUploadedImage(null);
  };

  const deleteImage = () => {
    setUploadedImage(null);
    setFile(null);
  };

  useEffect(() => {
    if (uploadedImage) setIsMenuOpen(false);
  }, [uploadedImage]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    isFirstRender.current = false;
  }, [])

  return (
    <MeassageInputContainer ref={scope} className="이거니?">
      <Menu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        handleLeave={leaveButtonClickHandler}
        handleReport={reportButtonClickHandler}
        file={file}
        setFile={setFile}
        setUploadedImage={setUploadedImage}
        isFirstRender={isFirstRender.current}
      />
      <InputContainer ref={containerRef}>
        <MenuToggle toggle={onClickPlusButton} isOpen={isMenuOpen} />
        <WrapInputForm onSubmit={handleSubmit}>
          {isOpponentOut ? (
            <Input
              value={value}
              onChange={changeHandler}
              placeholder="상대방이 나갔습니다."
              disabled
            />
          ) : uploadedImage ? (
            <ImageInput>
              <WrapImage>
                <img className="x-button" src="/assets/chat/x-button.svg" alt="cancel" onClick={deleteImage} />
                <img className="image-preview" src={uploadedImage} alt="preview" />
              </WrapImage>
            </ImageInput>
            
          ) : (
            <Input
              value={value}
              onChange={changeHandler}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
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
  display: relative;
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

const ImageInput = styled.div`
  width: 100%;
`;

const WrapImage = styled.div`  
  position:relative;
  padding: 0.5rem 0;

  .x-button {
    position: absolute;
    top: 0.5rem;
    left: 4.7rem;
    z-index: 1;
  }
  .image-preview {
    max-width: 5.3125rem;
    object-fit: contain;
    // object-position: top;
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
