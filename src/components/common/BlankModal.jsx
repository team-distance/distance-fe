import styled from 'styled-components';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

const BlankModal = forwardRef(({ children }, ref) => {
  const modalRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        modalRef.current.showModal();
        document.body.style = `overflow: hidden`;
      },
      close() {
        modalRef.current.close();
        document.body.style = `overflow: auto`;
      },
    };
  });

  return createPortal(
    <>
      <StyledDialog ref={modalRef}>{children}</StyledDialog>
    </>,
    document.getElementById('modal')
  );
});

export default BlankModal;

const StyledDialog = styled.dialog`
  /* max-width: 80%;
  min-width: 80%; */
  border: none;
  padding: 0;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 10px #3333334d;
  position: relative;
  position: fixed;

  &[open]::backdrop {
    background: rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
`;
