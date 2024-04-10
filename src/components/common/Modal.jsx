import styled from "styled-components";
import { useRef, forwardRef, useImperativeHandle } from "react";
import Button from "./Button";

const StyledDialog = styled.dialog`
  width: 60%;
  padding: 32px;
  position: relative;
  border: none;
  border-radius: 30px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.08);
`;

const CloseButton = styled.img`
  flex: 1;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Modal = forwardRef(
  (
    { children, buttonLabel, buttonClickHandler, buttonColor = "#FF625D" },
    ref
  ) => {
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
            src={"/assets/cancel-button-gray.svg"}
            alt="Close"
          />
          {children}
          <Button
            size={"medium"}
            onClick={buttonClickHandler}
            backgroundColor={buttonColor}>
            {buttonLabel}
          </Button>
        </StyledDialog>
      </>
    );
  }
);

export default Modal;
