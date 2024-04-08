import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "../../components/register/TextInput";
import { useRecoilState } from "recoil";
import { registerDataState } from "../../store/registerDataState";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { defaultInstance } from "../../api/instance";
import ProgressBar from "../../components/register/ProgressBar";
import toast, { Toaster } from "react-hot-toast";

const UserRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [checkPhoneFlag, setCheckPhoneFlag] = useState(true);
  const [verifyNumFlag, setVerifyNumFlag] = useState(true);
  const [pwFlag, setPwFlag] = useState(true);

  const [isSendMessage, setIsSendMessage] = useState(false);
  const [verifyButtonLabel, setVerifyButtonLabel] = useState("인증번호 전송");
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
        setVerifyNumFlag(false);
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
      console.log(typeof registerData.telNum, registerData.telNum);
      await defaultInstance
        .post("/member/send/sms", {
          telNum: registerData.telNum,
        })
        .then(() => {
          toast.success("인증번호가 전송되었습니다.");
        });
      setIsSendMessage(true);
      // setRegisterData(prevState => ({ ...prevState, tellNum: "" }));
      setVerifyButtonLabel("재전송");
    } catch (error) {
      const ERROR_CODE = error.response.data.code;
      if (ERROR_CODE === "EXIST_TEL_NUM") {
        toast.error("이미 등록된 전화번호입니다. 다른 번호를 입력해주세요.");
      } else {
        toast.error("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const verifyTelNum = async () => {
    try {
      await defaultInstance.post("/member/authenticate", {
        authenticateNum: verifyNum,
      });
      setVerify(true);
      setVerifyNumFlag(true);
    } catch (error) {
      toast.error("인증번호가 틀렸습니다.");

      console.log();
    }
  };

  return (
    <>
      <Toaster position="bottom-center" />
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
            value={registerData.telNum}
            onChange={handleChange}
          />
        </div>

        <WrapVerifyPhone $visible={isSendMessage}>
          <TextInput
            label="인증번호"
            name="verifyNum"
            type="text"
            timerState={180}
            onTimerEnd={() => setIsSendMessage(false)}
            placeholder="인증번호 입력"
            buttonLabel={"인증하기"}
            buttonClickHandler={verifyTelNum}
            buttonDisabled={verifyNumFlag}
            value={verifyNum}
            onChange={handleChange}
          />
          {verify && <Tip>인증되었습니다!</Tip>}
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
  padding: 2rem 2rem 3rem 2rem;

  p {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0;
    margin: 0;
  }
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2.5rem;
  padding: 2rem;
`;

const WrapVerifyPhone = styled.div`
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
`;
const WrapPassword = styled.div`
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
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
