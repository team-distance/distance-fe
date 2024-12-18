import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { MenuToggle } from './MenuToggle';
import Menu from './Menu';
import { AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

const MessageInput = ({
  value,
  file,
  setFile,
  reportButtonClickHandler,
  changeHandler,
  submitHandler,
  isOpponentOut,
  isMenuOpen,
  setIsMenuOpen,
  setIsSend,
  setIsInputFocused,
}) => {
  const containerRef = useRef(null);
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);

  const handleFocus = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('focused');
      setIsInputFocused(true);
    }
  };

  const handleBlur = () => {
    if (containerRef.current) {
      containerRef.current.classList.remove('focused');
      setIsInputFocused(false);
    }
  };

  const onClickPlusButton = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFile(null);
    setIsSend(true);
    submitHandler();
  };

  const deleteImage = () => {
    setFile(null);
  };

  useEffect(() => {
    if (file || isConvertingHeic) setIsMenuOpen(false);
  }, [file, isConvertingHeic]);

  return (
    <MeassageInputContainer>
      <AnimatePresence>
        {isMenuOpen && (
          <Menu
            setIsOpen={setIsMenuOpen}
            handleReport={reportButtonClickHandler}
            file={file}
            setFile={setFile}
            setIsConvertingHeic={setIsConvertingHeic}
          />
        )}
      </AnimatePresence>

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
          ) : file || isConvertingHeic ? (
            <ImageInput>
              <WrapImage>
                {file && (
                  <>
                    <img
                      className="x-button"
                      src="/assets/chat/x-button.svg"
                      alt="cancel"
                      onClick={deleteImage}
                    />
                    <img
                      className="image-preview"
                      src={URL.createObjectURL(file)}
                      alt="preview"
                    />
                  </>
                )}
                {isConvertingHeic && <ClipLoader size={16} color="#ff625d" />}
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
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));

  @media (max-width: 500px) {
    &.focused {
      padding-bottom: 8px;
    }
  }
`;

const ImageInput = styled.div`
  width: 100%;
`;

const WrapImage = styled.div`
  position: relative;
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
