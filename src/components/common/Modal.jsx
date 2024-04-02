import styled from "styled-components";
import { useRef, forwardRef, useImperativeHandle } from "react";
import Button from "./Button";

const StyledDialog = styled.dialog`
  width: 60%;
  border: none;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 10px 10px #3333334d;
  position: relative;
`;

const CloseButton = styled.img`
  flex: 1;
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
`;

const Modal = forwardRef(
  ({ children, buttonLabel, buttonClickHandler, title = "" }, ref) => {
    const dialog = useRef();

    const handleCloseModal = () => {
      dialog.current.close();
    };

    useImperativeHandle(ref, () => {
      return {
        open() {
          dialog.current.showModal();
        },
        close() {
          dialog.current.close();
        },
      };
    });

    return (
      <>
        <StyledDialog ref={dialog}>
          <CloseButton
            onClick={handleCloseModal}
            src={"/assets/cancel-button.png"}
            alt="Close"
          />
          {children}
          <Button size={"medium"} onClick={buttonClickHandler}>
            {buttonLabel}
          </Button>
        </StyledDialog>
      </>
    );
  }
);

export default Modal;
