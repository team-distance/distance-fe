import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    telNum: '',
    verifyNum: '',
    newPassword: '',
  });
  const [formFlags, setFormFlags] = useState({
    telNumValid: false,
    verifyNumValid: false,
    newPasswordValid: false,
  });
  const [formActive, setFormActive] = useState({
    isSendMessage: false,
    isSendVerifyNum: false,
  });

  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'telNum') {
      setFormFlags((prev) => ({ ...prev, telNumValid: value.length === 11 }));
    }

    if (name === 'verifyNum') {
      setFormFlags((prev) => ({ ...prev, verifyNumValid: value.length > 0 }));
    }

    if (name === 'newPassword') {
      console.log(value.length);
      setFormFlags((prev) => ({
        ...prev,
        newPasswordValid: value.length >= 6,
      }));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setFormFlags((prev) => ({ ...prev, telNumValid: false }));
    const toastId = toast.loading('전송 중...');
    try {
      await instance.post('/member/send/sms', {
        telNum: formData.telNum,
        type: 'FIND',
      });
      setFormActive((prev) => ({ ...prev, isSendMessage: true }));
      setVerifyButtonLabel('재전송');
      toast.success('인증번호가 전송되었습니다.', {
        id: toastId,
      });
    } catch (error) {
      const ERROR_CODE = error?.response?.data?.code;
      let errorMessage = '인증번호 전송에 실패했습니다. 다시 시도해주세요.';
      if (ERROR_CODE === 'NOT_EXIST_MEMBER') {
        errorMessage = '등록되지 않은 전화번호입니다.';
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  const verifyTelNum = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('인증 중...');
    try {
      await instance.post('/member/authenticate', {
        authenticateNum: formData.verifyNum,
      });
      setFormActive((prev) => ({ ...prev, isSendVerifyNum: true }));
      setFormFlags((prev) => ({
        ...prev,
        verifyNumValid: false,
        verifyTelNum: true,
      }));
      toast.success('인증되었습니다.', { id: toastId });
    } catch (error) {
      toast.error('인증번호가 틀렸습니다.', { id: toastId });
      setFormActive((prev) => ({ ...prev, isSendVerifyNum: false }));
      setFormFlags((prev) => ({ ...prev, telNumValid: true }));
      console.log(error);
    }
  };

  const handleHideForms = () => {
    setFormActive((prev) => ({
      ...prev,
      isSendMessage: false,
      isSendVerifyNum: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post('member/change/password', {
        password: formData.newPassword,
        telNum: formData.telNum,
      });
      alert('비밀번호가 변경되었습니다.');
      navigate('/login');
    } catch (err) {
      console.log(err);
      alert('등록되지 않은 번호입니다. 다시 확인해주세요.');
    }
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
              buttonDisabled={!formFlags.telNumValid}
              buttonClickHandler={sendMessage}
            />
          </div>
          {formActive.isSendMessage && (
            <TextInput
              label="인증번호"
              name="verifyNum"
              type="text"
              onChange={handleChange}
              timerState={180}
              onTimerEnd={handleHideForms}
              placeholder="인증번호 입력"
              buttonLabel={'인증하기'}
              buttonDisabled={!formFlags.verifyNumValid}
              buttonClickHandler={verifyTelNum}
            />
          )}
          {formActive.isSendVerifyNum && (
            <>
              <TextInput
                label="새 비밀번호"
                name="newPassword"
                type="text"
                onChange={handleChange}
                placeholder={'숫자로만 6자리 이상'}
              />
              <Button
                size="large"
                type="submit"
                disabled={!formFlags.newPasswordValid}
              >
                재설정하기
              </Button>
            </>
          )}
        </WrapContent>
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
