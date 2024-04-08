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
      login({ telNum, password })
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
              navigate("/verify/univ");
            }}>
            학생 인증하기
          </Button>
          <MoveToHome
            onClick={() => {
              navigate("/");
            }}>
            홈으로 이동
          </MoveToHome>
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

const MoveToHome = styled.div`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  margin-top: 1rem;
`;

export default DonePage;
