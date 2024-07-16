import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import { useRecoilState } from 'recoil';
import { registerDataState } from '../../store/registerDataState';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import ProgressBar from '../../components/register/ProgressBar';
import toast, { Toaster } from 'react-hot-toast';
import Checkbox from '../../components/common/Checkbox';
import Modal from '../../components/common/Modal';
import TermsOfServiceArticle from '../../components/register/TermsOfServiceArticle';
import PrivacyArticle from '../../components/register/PrivacyArticle';
import { useForm } from 'react-hook-form';

const UserRegisterPage = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useRecoilState(registerDataState);

  const {
    register: registerTelNum,
    handleSubmit: submitTelNum,
    formState: { isValid: telNumValid },
    setError: setErrorTelNum,
  } = useForm({
    mode: 'onChange',
    shouldUseNativeValidation: true,
  });
  const {
    register: registerVerifyNum,
    handleSubmit: submitVerifyNum,
    formState: { isValid: verifyNumValid },
    setError: setErrorVerifyNum,
  } = useForm({
    mode: 'onChange',
    shouldUseNativeValidation: true,
  });
  const {
    register: registerPassword,
    handleSubmit: submitPassword,
    formState: { isValid: passwordValid, errors: verifyPassword },
    watch,
  } = useForm({
    mode: 'onChange',
    shouldUseNativeValidation: true,
  });
  const passwordValue = watch('password');

  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');
  const [showVerifyNum, setShowVerifyNum] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const termsModalRef = useRef();
  const privacyModalRef = useRef();

  const handleOpenModal = (ref) => {
    ref.current.open();
    ref.current.scrollToTop();
  };

  const handleSubmitTelNum = async (data) => {
    if (verifyButtonLabel === '재전송') {
      // setVerifyNumFlag(true);
      // setVerify(false);
      // setVerifyNum('');
    }
    const response = instance.post('/member/send/sms', {
      telNum: registerData.telNum,
      type: 'SIGNUP',
    });
    toast.promise(response, {
      loading: '전송 중...',
      success: () => {
        setVerifyButtonLabel('재전송');
        setErrorTelNum('telNum');
        setShowVerifyNum(true);

        setRegisterData((prevData) => ({
          ...prevData,
          telNum: data.telNum,
        }));

        return '인증번호가 전송되었습니다.';
      },
      error: (error) => {
        const ERROR_CODE = error?.response?.data?.code;
        if (ERROR_CODE === 'EXIST_TEL_NUM') {
          return '이미 등록된 전화번호입니다. 다른 번호를 입력해주세요.';
        } else if (ERROR_CODE === 'TOO_MANY_REQUEST') {
          return '일일 최대 요청 수를 넘어갔습니다!';
        } else {
          return '인증번호 전송에 실패했습니다. 다시 시도해주세요.';
        }
      },
    });
  };

  const handleSubmitVerifyNum = async (data) => {
    try {
      await instance.post('/member/authenticate', {
        authenticateNum: data.verifyNum,
      });
      setShowPassword(true);
      setErrorVerifyNum('verifyNum');
    } catch (error) {
      toast.error('인증번호가 틀렸습니다.');
    }
  };

  const handleSubmitPassword = (data) => {
    setRegisterData((prevData) => ({
      ...prevData,
      agreePrivacy: data.agreePrivacy,
      agreeTerms: data.agreeTerms,
    }));

    toast.dismiss();
    navigate('/register/univ');
  };

  return (
    <div>
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: 104,
        }}
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      />
      <WrapHeader>
        <ProgressBar progress={1} />
        <p>전화번호를 인증해주세요</p>
      </WrapHeader>

      <WrapForm $visible={true} onSubmit={submitTelNum(handleSubmitTelNum)}>
        <TextInput
          type="text"
          label="전화번호"
          placeholder="'-' 없이 입력"
          buttonDisabled={!telNumValid}
          buttonLabel={verifyButtonLabel}
          register={registerTelNum('telNum', {
            validate: (value) => value.length === 11 || '',
          })}
        />
      </WrapForm>

      <WrapForm
        $visible={showVerifyNum}
        onSubmit={submitVerifyNum(handleSubmitVerifyNum)}
      >
        <TextInput
          type="text"
          label="인증번호"
          // timerState={180}
          // onTimerEnd={() => setIsSendMessage(false)}
          placeholder="인증번호 입력"
          buttonLabel="인증하기"
          buttonDisabled={!verifyNumValid}
          register={registerVerifyNum('verifyNum', {
            validate: (value) => value.length === 6 || '',
          })}
        />
        {showPassword && <Tip>인증되었습니다!</Tip>}
      </WrapForm>

      <WrapForm
        className="last-form"
        $visible={showPassword}
        onSubmit={submitPassword(handleSubmitPassword)}
      >
        <TextInput
          label="비밀번호"
          type="password"
          placeholder="숫자로만 6자리 이상"
          register={registerPassword('password', {
            validate: (value) => value.length >= 6 || '',
          })}
        />
        {passwordValue === undefined || passwordValue.length === 0 ? (
          <Tip className="invalid">
            숫자로만 구성된 6자리 이상이어야 합니다.
          </Tip>
        ) : verifyPassword.password ? (
          <Tip className="invalid">
            숫자로만 구성된 6자리 이상이어야 합니다.
          </Tip>
        ) : (
          <Tip className="valid">사용가능합니다.</Tip>
        )}

        <WrapCheckbox className="first-checkbox">
          <Checkbox
            label="(필수) 서비스 이용약관 동의"
            register={registerPassword('agreeTerms', {
              validate: (value) => value === true || '',
            })}
          />
          <ShowDetail
            onClick={() => {
              handleOpenModal(termsModalRef);
            }}
          >
            더보기
          </ShowDetail>
        </WrapCheckbox>
        <WrapCheckbox>
          <Checkbox
            label="(필수) 개인정보 수집 및 이용 동의"
            register={registerPassword('agreePrivacy', {
              validate: (value) => value === true || '',
            })}
          />
          <ShowDetail
            onClick={() => {
              handleOpenModal(privacyModalRef);
            }}
          >
            더보기
          </ShowDetail>
        </WrapCheckbox>
        <WrapButton>
          <Button type="submit" size="large" disabled={!passwordValid}>
            학교 선택하기
          </Button>
        </WrapButton>
      </WrapForm>

      <Modal
        ref={termsModalRef}
        buttonLabel="동의하기"
        buttonClickHandler={() => {
          setRegisterData({ ...registerData, agreeTerms: true });
          termsModalRef.current.close();
        }}
      >
        <TermsOfServiceArticle />
      </Modal>
      <Modal
        ref={privacyModalRef}
        buttonLabel="동의하기"
        buttonClickHandler={() => {
          setRegisterData({ ...registerData, agreePrivacy: true });
          privacyModalRef.current.close();
        }}
      >
        <PrivacyArticle />
      </Modal>
    </div>
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

const WrapForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  gap: 0.5rem;
  padding: 1.5rem 2rem;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

const Tip = styled.small`
  font-size: 12px;
  color: #90949b;
  font-weight: 700;

  &.invalid {
    color: #ff625d;
  }
  &.valid {
    color: #1ebd18;
  }
`;

const WrapButton = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 2rem;
`;

const WrapCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &.first-checkbox {
    margin-top: 0.5rem;
  }
`;

const ShowDetail = styled.div`
  font-size: 12px;
  color: #90949b;
  font-weight: 200;
`;

export default UserRegisterPage;
