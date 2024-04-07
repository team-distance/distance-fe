import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../../components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedInState, login } from "../../store/auth";
import { useSetRecoilState } from "recoil";
import { onGetToken } from "../../firebaseConfig";

const DonePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const telNum = location.state.telNum;
  const password = location.state.password;
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    const instantLogin = async () => {
      login({ id: telNum, password })
        .then(() => {
          setIsLoggedIn(true);
          onGetToken();
        })
        .catch((err) => console.error(err));
    };

    instantLogin();
  }, []);

  return (
    <Background>
      <WrapContent>
        <WrapMessage>
          <div style={{ fontSize: "60px" }}>🎊</div>
          <h2>가입이 완료되었습니다!</h2>
        </WrapMessage>
        <WrapButton>
          <Button
            size="large"
            onClick={() => {
              navigate("/home");
            }}>
            시작하기
          </Button>
        </WrapButton>
      </WrapContent>
    </Background>
  );
};

const Background = styled.div`
  width: 100dvw;
  height: 100dvh;
`;

const WrapContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const WrapMessage = styled.div`
  text-align: center;
`;

const WrapButton = styled.div`
  position: absolute;
  bottom: 2rem;
`;

export default DonePage;
