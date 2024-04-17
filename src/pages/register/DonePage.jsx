import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../../components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { isLoggedInState, login } from "../../store/auth";
import { useSetRecoilState } from "recoil";
import { onGetToken } from "../../firebaseConfig";
import toast, { Toaster } from "react-hot-toast";

const DonePage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const telNum = location.state.telNum;
  const password = location.state.password;
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  useEffect(() => {
    const instantLogin = async () => {
      if ("Notification" in window && Notification.permission !== "granted") {
        alert("알림 권한 창이 표시되면 허용을 눌러주세요!");
      }

      // clientToken 없어도 로그인 가능
      setLoading(true);
      await onGetToken()
        .then(async (clientToken) => {
          await login({ telNum, password, clientToken }).catch((error) => {
            toast.error("홈화면으로 이동해서 다시 로그인해주세요!");
          });
          setIsLoggedIn(true);
          setLoading(false);
        })
        .catch(async (error) => {
          await login({ telNum, password }).catch((error) => {
            toast.error("홈화면으로 이동해서 다시 로그인해주세요!");
          });
          setIsLoggedIn(true);
          setLoading(false);
        });
    };

    instantLogin();
  }, []);

  return (
    <Background>
      <Toaster position="bottom-center" />
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
            }}
            disabled={loading}>
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
