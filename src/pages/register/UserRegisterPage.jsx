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

const UserRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [checkPhoneFlag, setCheckPhoneFlag] = useState(true);
  const [verifyNumFlag, setVerifyNumFlag] = useState(true);
  const [pwFlag, setPwFlag] = useState(true);

  const [isSendMessage, setIsSendMessage] = useState(false);
  const [verifyButtonLabel, setVerifyButtonLabel] = useState('인증번호 전송');
  const [verifyNum, setVerifyNum] = useState('');
  const [verify, setVerify] = useState(false);

  const navigate = useNavigate();

  const termsModalRef = useRef();
  const privacyModalRef = useRef();

  const handleOpenModal = (ref) => {
    ref.current.open();
    ref.current.scrollToTop();
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setRegisterData({ ...registerData, [name]: checked });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });

    if (name === 'telNum') {
      if (value.length === 11) {
        setCheckPhoneFlag(false);
      } else {
        setCheckPhoneFlag(true);
      }
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
      const isNumeric = /^[0-9]+$/.test(value);
      if (value.length >= 6 && isNumeric) {
        setPwFlag(false);
      } else {
        setPwFlag(true);
      }
    }
  };

  const sendMessage = () => {
    if (verifyButtonLabel === '재전송') {
      setVerifyNumFlag(true);
      setVerify(false);
      setVerifyNum('');
    }

    const response = instance.post('/member/send/sms', {
      telNum: registerData.telNum,
      type: 'SIGNUP',
    });

    toast.promise(response, {
      loading: '전송 중...',
      success: () => {
        setIsSendMessage(true);
        setVerify(false);
        setVerifyButtonLabel('재전송');
        setCheckPhoneFlag(true);
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

  const verifyTelNum = async () => {
    try {
      await instance.post('/member/authenticate', {
        authenticateNum: verifyNum.trim(),
      });
      setVerify(true);
      setVerifyNumFlag(true);
      setCheckPhoneFlag(true);
    } catch (error) {
      toast.error('인증번호가 틀렸습니다.');
      setVerifyNumFlag(false);
      setCheckPhoneFlag(false);
      console.log();
    }
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
            onChange={handleChangeInput}
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
            buttonLabel="인증하기"
            buttonClickHandler={verifyTelNum}
            buttonDisabled={verifyNumFlag}
            value={verifyNum}
            onChange={handleChangeInput}
          />
          {verify && <Tip>인증되었습니다!</Tip>}
        </WrapVerifyPhone>

        <WrapPassword $visible={verify}>
          <TextInput
            label="비밀번호"
            name="password"
            type="password"
            placeholder="숫자로만 6자리 이상"
            value={registerData.password}
            onChange={handleChangeInput}
          />
          {pwFlag && <Tip>숫자로만 구성된 6자리 이상이어야 합니다.</Tip>}
        </WrapPassword>

        <WrapButton>
          <WrapCheckbox>
            <Checkbox
              label="(필수) 서비스 이용약관 동의"
              name="agreeTerms"
              checked={registerData.agreeTerms}
              onChange={handleChangeCheckbox}
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
              name="agreePrivacy"
              checked={registerData.agreePrivacy}
              onChange={handleChangeCheckbox}
            />
            <ShowDetail
              onClick={() => {
                handleOpenModal(privacyModalRef);
              }}
            >
              더보기
            </ShowDetail>
          </WrapCheckbox>
          <Button
            size="large"
            disabled={
              pwFlag || !registerData.agreeTerms || !registerData.agreePrivacy
            }
            onClick={() => {
              toast.dismiss();
              navigate('/register/univ');
            }}
          >
            학교 선택하기
          </Button>
        </WrapButton>
      </WrapContent>
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

const WrapContent = styled.div`
  display: grid;
  gap: 2.5rem;
  padding: 2rem;
`;

const WrapVerifyPhone = styled.div`
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

const WrapPassword = styled.div`
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
`;

const WrapCheckbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ShowDetail = styled.div`
  font-size: 12px;
  color: #90949b;
  font-weight: 200;
`;

const WrapButton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5rem;
`;

const Tip = styled.small`
  font-size: 12px;
  color: #90949b;
  font-weight: 700;
`;

export default UserRegisterPage;
