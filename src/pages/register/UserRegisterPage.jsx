import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import { useRecoilState } from 'recoil';
import { registerDataState } from '../../store/registerDataState';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import ProgressBar from '../../components/register/ProgressBar';
import Checkbox from '../../components/common/Checkbox';
import { useForm } from 'react-hook-form';
import useModal from '../../hooks/useModal';
import TermsModal from '../../components/modal/TermsModal';
import PrivacyModal from '../../components/modal/PrivacyModal';
import { useToast, usePromiseToast } from '../../hooks/useToast';

const UserRegisterPage = () => {
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [isTelNumChanged, setIsTelNumChanged] = useState(true);
  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');
  const [showVerifyNum, setShowVerifyNum] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSmsButtonDisabled, setIsSmsButtonDisabled] = useState(true);

  const { openModal: openTermsModal, closeModal: closeTermsModal } = useModal(
    () => (
      <TermsModal
        closeModal={closeTermsModal}
        onClick={() => {
          setRegisterData({ ...registerData, agreeTerms: true });
          setPasswordValue('agreeTerms', true);
        }}
      />
    )
  );

  const { openModal: openPrivacyModal, closeModal: closePrivacyModal } =
    useModal(() => (
      <PrivacyModal
        closeModal={closePrivacyModal}
        onClick={() => {
          setRegisterData({ ...registerData, agreePrivacy: true });
          setPasswordValue('agreePrivacy', true);
        }}
      />
    ));

  //토스트 메세지
  const { showToast: showVerifyNumErrorToast } = useToast(
    () => <span>인증번호가 틀렸습니다.</span>,
    'verifynum-error'
  );

  const { showToast: showSameTelNumAndReferredTel } = useToast(
    () => <span>추천인 전화번호에 내 번호를 입력할 수 없어요!</span>,
    'same-telnum-and-referredtel'
  );

  const { showPromiseToast: showSendMessageToast } = usePromiseToast();

  const {
    register: registerTelNum,
    handleSubmit: submitTelNum,
    formState: { isValid: telNumValid },
    setError: setErrorTelNum,
    watch: watchTelNum,
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
    setValue: setPasswordValue,
    watch: watchPassword,
  } = useForm({
    mode: 'onChange',
    shouldUseNativeValidation: true,
    defaultValues: {
      referredTel: registerData.referredTel,
    },
  });

  const telNumValue = watchTelNum('telNum');
  const passwordValue = watchPassword('password');

  useEffect(() => {
    if (telNumValue !== registerData.telNum) {
      setIsTelNumChanged(true);
      setShowVerifyNum(false);
      setShowPassword(false);
    }
  }, [telNumValue]);

  useEffect(() => {
    if (telNumValid) {
      setIsSmsButtonDisabled(false);
    } else {
      setIsSmsButtonDisabled(true);
    }
  }, [telNumValid]);

  const handleSubmitTelNum = async (data) => {
    const response = instance.post('/member/send/sms', {
      telNum: data.telNum,
      type: 'SIGNUP',
    });

    showSendMessageToast(
      response,
      () => {
        setVerifyButtonLabel('재전송');
        setErrorTelNum('telNum');
        setShowVerifyNum(true);
        setIsTelNumChanged(false);
        setIsSmsButtonDisabled(true);

        setRegisterData((prevData) => ({
          ...prevData,
          telNum: data.telNum,
        }));

        return '인증번호가 전송되었습니다.';
      },
      (error) => {
        const ERROR_CODE = error?.response?.data?.code;
        if (ERROR_CODE === 'EXIST_TEL_NUM') {
          return '이미 등록된 전화번호입니다. 다른 번호를 입력해주세요.';
        } else if (ERROR_CODE === 'TOO_MANY_REQUEST') {
          return '일일 최대 요청 수를 넘어갔습니다!';
        } else {
          return '인증번호 전송에 실패했습니다. 다시 시도해주세요.';
        }
      }
    );
  };

  const handleSubmitVerifyNum = async (data) => {
    try {
      await instance.post('/member/authenticate', {
        telNum: registerData.telNum,
        authenticateNum: data.verifyNum,
      });
      setShowPassword(true);
      setErrorVerifyNum('verifyNum');

      setRegisterData((prevData) => ({
        ...prevData,
        verifyNum: data.verifyNum,
      }));
      setIsSmsButtonDisabled(true);
    } catch (error) {
      showVerifyNumErrorToast();
      setIsSmsButtonDisabled(false);
    }
  };

  const handleSubmitPassword = (data) => {
    if (data.referredTel === registerData.telNum) {
      showSameTelNumAndReferredTel();
      return;
    }

    setRegisterData((prevData) => ({
      ...prevData,
      password: data.password,
      referredTel: data.referredTel,
      agreePrivacy: data.agreePrivacy,
      agreeTerms: data.agreeTerms,
    }));

    navigate('/register/univ');
  };

  return (
    <div>
      <WrapHeader>
        <ProgressBar progress={1} />
        <p>전화번호를 인증해주세요</p>
      </WrapHeader>

      <WrapForm $visible={true} onSubmit={submitTelNum(handleSubmitTelNum)}>
        <TextInput
          type="text"
          label="전화번호"
          placeholder="'-' 없이 입력"
          buttonDisabled={isSmsButtonDisabled}
          buttonLabel={verifyButtonLabel}
          register={registerTelNum('telNum', {
            validate: (value) => value.length === 11 || '',
          })}
        />
      </WrapForm>

      <WrapForm
        $visible={showVerifyNum && !isTelNumChanged}
        onSubmit={submitVerifyNum(handleSubmitVerifyNum)}
      >
        <div>
          <TextInput
            type="text"
            label="인증번호"
            timerState={180}
            // onTimerEnd={() => setIsSendMessage(false)}
            placeholder="인증번호 입력"
            buttonLabel="인증하기"
            buttonDisabled={!verifyNumValid}
            register={registerVerifyNum('verifyNum', {
              validate: (value) => value.length === 6 || '',
            })}
          />
          {showPassword && <Tip>인증되었습니다!</Tip>}
        </div>
      </WrapForm>

      <WrapForm
        className="last-form"
        $visible={showPassword && !isTelNumChanged}
        onSubmit={submitPassword(handleSubmitPassword)}
      >
        <div>
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
        </div>

        <TextInput
          label="추천인 전화번호(생략 가능)"
          type="text"
          placeholder="'-' 없이 입력"
          register={registerPassword('referredTel')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <WrapCheckbox className="first-checkbox">
            <Checkbox
              label="(필수) 서비스 이용약관 동의"
              register={registerPassword('agreeTerms', {
                validate: (value) => value === true || '',
              })}
            />
            <ShowDetail onClick={openTermsModal}>더보기</ShowDetail>
          </WrapCheckbox>

          <WrapCheckbox>
            <Checkbox
              label="(필수) 개인정보 수집 및 이용 동의"
              register={registerPassword('agreePrivacy', {
                validate: (value) => value === true || '',
              })}
            />
            <ShowDetail onClick={openPrivacyModal}>더보기</ShowDetail>
          </WrapCheckbox>

          <Button type="submit" size="large" disabled={!passwordValid}>
            학교 선택하기
          </Button>
        </div>
      </WrapForm>
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
  gap: 48px;
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
