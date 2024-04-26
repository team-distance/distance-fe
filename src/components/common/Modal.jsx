import styled from 'styled-components';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import Button from './Button';
import { createPortal } from 'react-dom';

const StyledDialog = styled.dialog`
  width: 60%;
  max-height: 80%;
  padding: 32px;
  position: relative;
  border: none;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.08);
  z-index: 999;

  &[open]::backdrop {
    background: rgba(0, 0, 0, 0.5);
    overflow-y: hidden;
  }
`;

const CloseButton = styled.img`
  flex: 1;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Modal = forwardRef(
  (
    { children, buttonLabel, buttonClickHandler, buttonColor = '#FF625D' },
    ref
  ) => {
    const dialog = useRef();

    useImperativeHandle(ref, () => {
      return {
        open() {
          dialog.current.showModal();
          document.body.style = `overflow: hidden`;
        },
        close() {
          dialog.current.close();
        },
        scrollToTop() {
          dialog.current.scrollTo(0, 0);
        },
      };
    });

    const handleCloseModal = () => {
      dialog.current.close();
      document.body.style = `overflow: auto`;
    };

    return createPortal(
      <>
        <StyledDialog ref={dialog}>
          <CloseButton
            onClick={handleCloseModal}
            src={'/assets/cancel-button-gray.svg'}
            alt="Close"
          />
          {children}
          <Button
            size={'medium'}
            onClick={buttonClickHandler}
            backgroundColor={buttonColor}
          >
            {buttonLabel}
          </Button>
        </StyledDialog>
      </>,
      document.getElementById('modal')
    );
  }
);

export default Modal;
