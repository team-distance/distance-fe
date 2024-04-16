import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { instance } from "../../api/instance";
import Button from "../../components/common/Button";
import TextInput from "../../components/register/TextInput";

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [schoolEmail, setSchoolEmail] = useState("");
  const [verifyNum, setVerifyNum] = useState("");
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const [verifiedFlag, setVerifiedFlag] = useState(true);
  const [isSendEmail, setIsSendEmail] = useState(false);

  const handleChangeEmail = (e) => {
    setSchoolEmail(e.target.value);
    if (e.target.value !== "") {
      setEmailDisabled(false);
    } else {
      setEmailDisabled(true);
    }
  };

  const handleChangeVerifyNum = (e) => {
    setVerifyNum(e.target.value);
    if (e.target.value !== "") {
      setVerifyDisabled(false);
    } else {
      setVerifyDisabled(true);
    }
  };

  const sendEmail = async () => {
    try {
      setIsSendEmail(true);

      // 테스트용도로 @sch.ac.kr이 없어도 인증번호를 받을 수 있게 함
      const payload = schoolEmail.includes("@")
        ? schoolEmail
        : schoolEmail + "@sch.ac.kr";

      const res = await instance.post("/univ/send/email", {
        schoolEmail: payload,
      });
      if (res.data) {
        alert("이메일로 인증 번호를 보냈습니다.");
      }
    } catch (error) {
      alert("인증을 다시 시도해주세요.");
      console.log(error);
    }
  };

  const verifyEmail = async () => {
    try {
      await instance.post("/univ/certificate/email", {
        number: verifyNum,
      });
      alert("인증에 성공했습니다.");
      setVerifiedFlag(false);
    } catch (error) {
      alert("인증에 실패했습니다. 다시 시도해주세요.");
      console.log(error);
    }
  };

  return (
    <WrapContent>
      <div>
        <h2>'학생 메일'로 인증하기</h2>
        <p>
          <strong>학교 도메인</strong>의 메일만 사용 가능해요
        </p>
      </div>

      <div>
        <Label>학생메일 인증하기</Label>
        <InputWrapper>
          <Input
            type="email"
            name="schoolEmail"
            value={schoolEmail}
            onChange={handleChangeEmail}
          />
          <SCHDomain>@sch.ac.kr</SCHDomain>
          <div>
            <Button size="small" disabled={emailDisabled} onClick={sendEmail}>
              메일 보내기
            </Button>
          </div>
        </InputWrapper>
        <WrapButton>
          <p>'학생 메일'로 인증하는 방법</p>
          <img src="/assets/arrow-pink-button.png" alt="way to verify email" />
        </WrapButton>
      </div>

      {isSendEmail && (
        <div>
          <TextInput
            label="인증번호"
            name="emailVerify"
            type="text"
            buttonLabel="인증하기"
            buttonDisabled={verifyDisabled}
            onChange={handleChangeVerifyNum}
            buttonClickHandler={verifyEmail}
            timerState={180}
            onTimerEnd={() => setIsSendEmail(false)}
          />
        </div>
      )}

      <Button
        size="large"
        disabled={verifiedFlag}
        onClick={() => {
          navigate("/");
        }}>
        인증완료
      </Button>
    </WrapContent>
  );
};
export default VerifyEmailPage;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  padding: 4rem 2rem 4rem 2rem;

  h2 {
    margin: 0;
    padding: 0;
  }
  p {
    margin: 0;
    padding: 0;
    font-weight: 200;
  }
  strong {
    color: #ff625d;
  }
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;

  p {
    font-size: 0.8rem;
    font-weight: 500;
  }
  img {
    transform: rotate(180deg);
    width: 4%;
  }
`;

const Input = styled.input`
  width: 100%;
  flex-grow: 1;
  color: #333333;
  font-size: 1rem;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #d9d9d9;
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 0.3rem;
  margin-top: 0.5rem;

  &:focus-within {
    border-bottom: 2px solid #ff625d;
  }
`;

const SCHDomain = styled.div`
  margin-right: 1rem;
  font-weight: 600;
  color: #777;
`;

const Label = styled.label`
  font-weight: 700;
  color: #333333;
`;
