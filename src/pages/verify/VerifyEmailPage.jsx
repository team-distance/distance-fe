import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import Button from '../../components/common/Button';
import TextInput from '../../components/register/TextInput';
import toast, { Toaster } from 'react-hot-toast';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [schoolEmail, setSchoolEmail] = useState('');
  const [verifyNum, setVerifyNum] = useState('');
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const [isSendEmail, setIsSendEmail] = useState(false);

  // 서비스 개시 전까지는 사용하지 않음
  // const regex = /^[a-zA-Z0-9-_]{4,20}$/;

  const handleChangeEmail = (e) => {
    setSchoolEmail(e.target.value);
    if (e.target.value !== '') {
      setEmailDisabled(false);
    } else {
      setEmailDisabled(true);
    }
  };

  const handleChangeVerifyNum = (e) => {
    setVerifyNum(e.target.value);
    if (e.target.value !== '') {
      setVerifyDisabled(false);
    } else {
      setVerifyDisabled(true);
    }
  };

  const sendEmail = async () => {
    const email = schoolEmail.includes('@')
      ? schoolEmail
      : schoolEmail + '@sch.ac.kr';

    const response = instance.post('/univ/send/email', {
      schoolEmail: email,
    });

    toast.promise(response, {
      loading: '전송 중...',
      success: () => {
        setIsSendEmail(true);
        return '인증메일이 전송되었습니다.';
      },
      error: '인증을 다시 시도해주세요.',
    });
  };

  const verifyEmail = async () => {
    try {
      await instance.post('/univ/certificate/email', {
        number: verifyNum,
        schoolEmail: schoolEmail.includes('@')
          ? schoolEmail
          : schoolEmail + '@sch.ac.kr',
      });
      window.confirm('인증되었습니다.') && navigate('/');
    } catch (error) {
      toast.error('인증번호가 일치하지 않습니다.');
    }
  };

  return (
    <WrapContent>
      <Toaster position="bottom-center" />
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
            onChange={handleChangeVerifyNum}
            timerState={180}
            onTimerEnd={() => setIsSendEmail(false)}
          />
        </div>
      )}

      <Button size="large" disabled={verifyDisabled} onClick={verifyEmail}>
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
