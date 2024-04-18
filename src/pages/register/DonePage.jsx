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
      // 로딩 상태 설정
      setLoading(true);

      let clientToken = null;

      try {
        // 토큰을 시도하여 가져옵니다.
        clientToken = await onGetToken();
        localStorage.setItem("clientToken", clientToken);
      } catch (err) {
        // 토큰 가져오기 실패, clientToken은 null로 유지
        console.error("Token fetch failed", err);
      }

      try {
        // 로그인 시도 (clientToken이 null일 수도 있음)
        await login({ telNum, password, clientToken });

        // 로그인 성공 시
        // setIsLoggedIn(true);
        // navigate("/");
      } catch (err) {
        // 로그인 실패 시
        toast.error("홈화면으로 이동해서 다시 로그인해주세요!");
      } finally {
        // 로딩 상태 해제
        setLoading(false);
      }
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
