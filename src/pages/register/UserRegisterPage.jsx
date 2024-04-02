import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/register/TextInput";
import { useRecoilState } from "recoil";
import { registerDataState } from "../../store/registerDataState";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/register/ProgressBar";

const UserRegisterPage = () => {

  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [checkPhoneFlag, setCheckPhoneFlag] = useState(true);
  const [verifyNumFlag, setVerifyNumFlag] = useState(true);
  const [pwFlag, setPwFlag] = useState(true);

  const [isSendMessage, setIsSendMessage] = useState(false);
  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');
  const [verifyNum, setVerifyNum] = useState("");
  const [verify, setVerify] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });

    if (name === "telNum") {
      if (value.length === 11) {
        setCheckPhoneFlag(false);
      } else {
        setCheckPhoneFlag(true);
      }
    }

    if (name === "verifyNum") {
      setVerifyNum(e.target.value);
      if (value.length !== 0) {
        setVerifyNumFlag(false)
      } else {
        setVerifyNumFlag(true);
      }
    }

    if (name === "password") {
      if (value.length >= 6) {
        setPwFlag(false);
      } else {
        setPwFlag(true);
      }
    }

  };

  const sendMessage = async () => {

    if (verifyButtonLabel === "재전송") {
      setVerifyNumFlag(false);
      setVerify(false);
      setVerifyNum("");
    }

    try {
      // const res = await defaultInstance.post("/member/check/id", {
      //   loginId: registerData.loginId,
      // })
      setIsSendMessage(true);
      // setRegisterData(prevState => ({ ...prevState, tellNum: "" }));
      setVerifyButtonLabel("재전송");
    } catch (error) {
      alert("인증을 재시도해주세요");
      console.log(error);

      //테스트용
      setIsSendMessage(true);
    }
  };

  const verifyTellNum = async () => {
    try {
      // const res = await defaultInstance.post("/member/check/id", {
      //   loginId: registerData.loginId,
      // })
      setVerify(true);
      setVerifyNumFlag(true);
    } catch (error) {
      alert("인증을 재시도해주세요");
      console.log(error);

      //테스트용
      setVerify(true);
      setVerifyNumFlag(true);
    }
  };

  return (
    <>
      <WrapHeader>
        <ProgressBar progress={1} />
        <p>전화번호를 인증해주세요</p>
      </WrapHeader>

      <WrapContent>
        <div>
          <TextInput
            label="전화번호"
            name="telNum"
            type="text"
            placeholder="'-' 없이 입력"
            buttonLabel={verifyButtonLabel}
            buttonClickHandler={sendMessage}
            buttonDisabled={checkPhoneFlag}
            value={registerData.tellNum}
            onChange={handleChange}
          />
        </div>

        <WrapVerifyPhone $visible={isSendMessage}>
          <TextInput
            label="인증번호"
            name="verifyNum"
            type="text"
            timerState={180}
            placeholder="인증번호 입력"
            buttonLabel={"인증하기"}
            buttonClickHandler={verifyTellNum}
            buttonDisabled={verifyNumFlag}
            value={verifyNum}
            onChange={handleChange}
          />
          {verify && (
            <Tip>인증되었습니다!</Tip>
          )}
        </WrapVerifyPhone>

        <WrapPassword $visible={verify}>
          <TextInput
            label="비밀번호"
            name="password"
            type="number"
            placeholder="6자리 이상"
            value={registerData.password}
            onChange={handleChange}
          />
        </WrapPassword>

        <WrapButton>
          <Button
            size="large"
            disabled={pwFlag}
            onClick={() => {
              navigate("/register/univ");
            }}>
            학교 선택하기
          </Button>
        </WrapButton>

      </WrapContent>
    </>
  );
};

const WrapHeader = styled.div`
  display: grid;
  padding: 4rem 2rem 0 2rem;
  
  p {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2.5rem;
  padding: 2rem;
`;

const WrapVerifyPhone = styled.div`
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
`;
const WrapPassword = styled.div`
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
`;

const WrapButton = styled.div`
  margin-top: 5rem;
`;
const Tip = styled.small`
  font-size: 12px;
  color: #90949b;
  font-weight: 700;
`;

export default UserRegisterPage;
