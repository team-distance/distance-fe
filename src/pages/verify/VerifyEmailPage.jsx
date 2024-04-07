import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { authInstance } from '../../api/instance';
import Button from '../../components/common/Button';
import TextInput from '../../components/register/TextInput';

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
  }

  const handleChangeVerifyNum = (e) => {
    setVerifyNum(e.target.value);
    if (e.target.value !== "") {
      setVerifyDisabled(false);
    } else {
      setVerifyDisabled(true);
    }
  }

  const sendEmail = async () => {
    try { 
      setIsSendEmail(true);
      const res = await authInstance.post("/univ/send/email", {
        schoolEmail: schoolEmail,
      });
      if (res.data) {
        alert("이메일로 인증 번호를 보냈습니다.");
      }
    } catch (error) {
      alert("인증을 다시 시도해주세요.");
      console.log(error);
    }
  };

  const verifyEmail = async() => {
    try {
      await authInstance.post("/univ/certificate/email", {
        number: verifyNum,
      });
      alert("인증에 성공했습니다.");
      setVerifiedFlag(false);
    } catch (error) {
      alert("인증에 실패했습니다. 다시 시도해주세요.");
      console.log(error);
    }
  }

  return (
    <WrapContent>
      <div>
        <h2>'학생 메일'로 인증하기</h2>
        <p><strong>학교 도메인</strong>의 메일만 사용 가능해요</p>
      </div>

      <div>
        <TextInput
          label="학생메일 인증하기"
          name="schoolEmail"
          type="email"
          value={schoolEmail}
          buttonLabel="메일 보내기"
          buttonDisabled={emailDisabled}
          onChange={handleChangeEmail}
          buttonClickHandler={sendEmail}
        />
        <WrapButton>
          <p>'학생 메일'로 인증하는 방법</p>
          <img src="/assets/arrow-pink-button.png" alt="way to verify email"/>
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
  )
}
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
    color: #FF625D;
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
`