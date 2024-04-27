import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [telNum, setTelNum] = useState('');
  const [password, setPassword] = useState('');
  const [telNumFlag, setTelNumTestFlag] = useState(true);
  const [passwordFlag, setPasswordFlag] = useState(true);

  const [isSendMessage, setIsSendMessage] = useState(false);
  const [isSendVerifyNum, setIsSendVerifyNum] = useState(false);
  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');
  const [verifyNum, setVerifyNum] = useState('');
  const [verifyNumFlag, setVerifyNumFlag] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telNum') {
      setTelNumTestFlag(!(value.length === 11));
      setTelNum(value);
    }

    if (name === 'verifyNum') {
      setVerifyNum(e.target.value);
      if (value.length !== 0) {
        setVerifyNumFlag(false);
      } else {
        setVerifyNumFlag(true);
      }
    }

    if (name === 'password') {
      setPassword(value);
      setPasswordFlag(value.length < 6);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post('member/change/password', {
        password: password,
        telNum: telNum,
      });
      alert('비밀번호가 변경되었습니다.');
      navigate('/login');
    } catch (err) {
      console.log(err);
      alert('등록되지 않은 번호입니다. 다시 확인해주세요.');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const response = instance.post('/member/send/sms', {
      telNum: telNum,
      type: 'FIND',
    });

    toast.promise(response, {
      loading: '전송 중...',
      success: () => {
        setIsSendMessage(true);
        setVerifyButtonLabel('재전송');
        return '인증번호가 전송되었습니다.';
      },
      error: (error) => {
        const ERROR_CODE = error?.response?.data?.code;
        if (ERROR_CODE === 'NOT_EXIST_MEMBER') {
          return '등록되지 않은 전화번호입니다.';
        } else {
          return '인증번호 전송에 실패했습니다. 다시 시도해주세요.';
        }
      },
    });

    setTelNumTestFlag(true);
  };

  const verifyTelNum = async (e) => {
    e.preventDefault();

    try {
      await instance.post('/member/authenticate', {
        authenticateNum: verifyNum,
      });
      setVerifyNumFlag(true);
      setTelNumTestFlag(false);
      setIsSendVerifyNum(true);
    } catch (error) {
      toast.error('인증번호가 틀렸습니다.');
      console.log();
    }
  };

  const setInvisible = () => {
    setIsSendMessage(false);
    setIsSendVerifyNum(false);
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <WrapForm onSubmit={handleSubmit}>
        <WrapContent>
          <h2>비밀번호 재설정하기</h2>
          <div>
            <TextInput
              label="전화번호"
              name="telNum"
              type="text"
              onChange={handleChange}
              placeholder={"'-'없이 입력"}
              buttonLabel={verifyButtonLabel}
              buttonDisabled={telNumFlag}
              buttonClickHandler={sendMessage}
            />
          </div>
          <HiddenDiv $visible={isSendMessage}>
            <TextInput
              label="인증번호"
              name="verifyNum"
              type="text"
              onChange={handleChange}
              timerState={180}
              onTimerEnd={setInvisible}
              placeholder="인증번호 입력"
              buttonLabel={'인증하기'}
              buttonDisabled={verifyNumFlag}
              buttonClickHandler={verifyTelNum}
            />
          </HiddenDiv>
          <HiddenDiv $visible={isSendVerifyNum}>
            <TextInput
              label="새 비밀번호"
              name="password"
              type="text"
              onChange={handleChange}
              placeholder={'숫자로만 6자리 이상'}
            />
          </HiddenDiv>
        </WrapContent>
        <HiddenDiv $visible={isSendVerifyNum}>
          <Button size="large" type="submit" disabled={passwordFlag}>
            재설정하기
          </Button>
        </HiddenDiv>
      </WrapForm>
    </>
  );
};

export default ResetPassword;

const WrapForm = styled.form`
  padding: 2rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  margin-bottom: 8rem;
`;

const HiddenDiv = styled.div`
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;
