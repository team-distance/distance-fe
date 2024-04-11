import styled from 'styled-components';

const ToastPopup = ({message, onClick}) => {

  return (
    <ToastContainer>
      <img src="/assets/warning.png" alt="warning"/>
      {message}
      <div onClick={onClick}>해결하기</div>
    </ToastContainer>
  )
}
export default ToastPopup;

const ToastContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: white;
  padding: 0.7rem 1rem;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
  z-index: 99999999;
  color: #2d2d2d;
  white-space: nowrap;
  
  img {
    width: 1.3rem;
    margin-right: 0.5rem;
  }
  
  div {
    margin-left: 1.3rem;
    display: inline-flex;
    color: #006aff;
  }
`;

