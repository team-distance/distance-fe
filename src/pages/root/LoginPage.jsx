import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedInState, login } from "../../store/auth";
import { useSetRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../../components/register/TextInput";
import Button from "../../components/common/Button";
import ClipLoader from "react-spinners/ClipLoader";
import { onGetToken } from "../../firebaseConfig";

const LoginPage = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const location = useLocation();

  const [telNumTestFlag, setTelNumTestFlag] = useState(false);
  const [pwTestFlag, setPwTestFlag] = useState(false);
  const [loginResult, setLoginResult] = useState();
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginValue, setLoginValue] = useState({
    telNum: "",
    password: "",
  });

  const isDisabled = loginValue.telNum === "" || loginValue.password === "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowWarning(false);

    if (name === "telNum") {
      setTelNumTestFlag(!(value.length===11));
    }
    if (name === "password") {
      setPwTestFlag(!(value.length>=6));
    }

    setLoginValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telNumTestFlag || pwTestFlag) {
      setShowWarning(true);
      return;
    }

    try {
      setLoading(true);
      await onGetToken();
      await login(loginValue);
      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      setShowWarning(true);
      setLoginResult(err.response?.status || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoaderContainer>
          <ClipLoader color={"#FF625D"} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <WrapForm onSubmit={handleSubmit}>
          <WrapContent>
            {location.state?.alert && alert("로그인이 필요합니다.")}
            <h2>전화번호로 로그인하기</h2>

            <div>
              <TextInput
                label="전화번호"
                name="telNum"
                type="text"
                onChange={handleChange}
                placeholder={"'-'없이 입력"}
              />
            </div>

            <div>
              <TextInput
                label="비밀번호"
                name="password"
                type="password"
                onChange={handleChange}
                placeholder={"6자리 이상"}
              />
              {showWarning && loginResult !== 200 && (
                <Tip>
                  비밀번호가 일치하지 않습니다!
                </Tip>
              )}
            </div>
          </WrapContent>
          

          <Button size="large" type="submit" disabled={isDisabled}>
            로그인하기
          </Button>
          <WrapText>
            아직 계정이 없으신가요?<span onClick={()=>navigate('/register/user')}>회원가입하기</span>
          </WrapText>
        </WrapForm>
      )}
    </>
  );
};

export default LoginPage;

const WrapForm = styled.form`
  padding: 2rem;
`;
const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  margin-bottom: 8rem;
`;
const WrapText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #979797;
  padding: 1rem 0 4rem 0;
  font-size: 0.8rem;

  span {
    color: #000000;
    font-weight: 800;
    font-size: 1rem;
    padding-left: 0.3rem;
  }
`;
const Tip = styled.small`
  font-size: 12px;
  color: #ff625d;
  font-weight: 700;
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
