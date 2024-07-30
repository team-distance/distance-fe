import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev';
import TextInput from '../../components/register/TextInput';
// import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useToast} from '../../hooks/useToast';

const DropoutPage = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState(true);
  const [password, setPassword] = useState('');

  //토스트 메세지
  const {showToast: showVerifyPasswordToast} = useToast(
    () => <span>인증되었습니다.</span>, 'verify-password', 'bottom-center', 'success'
  )
  const {showToast: showVerifyPasswordErrorToast} = useToast(
    () => <span>비밀번호가 일치하지 않습니다.</span>, 'verify-password-error'
  )

  const verifyPassword = async () => {
    //비밀번호 확인
    await instance
      .post('/member/check/password', {
        password: password,
      })
      .then(() => {
        setIsDisabled(false);
        showVerifyPasswordToast();
      })
      .catch((error) => {
        console.log(error.response.data.code);
        showVerifyPasswordErrorToast();
      });
  };

  const handleDropout = async () => {
    try {
      if (window.confirm('정말 탈퇴하시겠습니까?')) {
        await instance.delete('/member');
        localStorage.clear();
        alert('탈퇴가 정상적으로 완료되었습니다');
        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'verifyPassword') {
      setVerifyPasswordFlag(value.length < 6);
      setPassword(value);
    }
  };

  return (
    <>
      {/* <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
      /> */}
      <WrapContent>
        <HeaderPrev
          title="회원 탈퇴"
          navigateTo={-1}
          text="탈퇴 시 계정은 삭제되며 복구되지 않습니다."
        />

        <div className="input">
          <TextInput
            label="비밀번호 입력"
            name="verifyPassword"
            type="password"
            placeholder="숫자로만 6자리 이상"
            buttonLabel={'인증하기'}
            buttonClickHandler={verifyPassword}
            buttonDisabled={verifyPasswordFlag}
            onChange={handleChange}
          />
        </div>

        <div>
          <Button size="large" disabled={isDisabled} onClick={handleDropout}>
            탈퇴하기
          </Button>
          <WrapText>
            <span className="sign-up">비밀번호를 잊어버리셨나요?</span>
            <span
              className="find-password"
              onClick={() => navigate('/password')}
            >
              비밀번호 재설정
            </span>
          </WrapText>
        </div>
      </WrapContent>
    </>
  );
};
export default DropoutPage;

const WrapContent = styled.div`
  display: grid;
  gap: 2rem;
  padding: 2rem;

  .input {
    padding: 0.5rem 0 6rem 0;
  }
`;

const WrapText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #979797;
  padding: 1rem 0 4rem 0;
  font-size: 0.8rem;

  .sign-up {
    color: #000000;
    font-weight: 800;
    font-size: 1rem;
  }
  .find-password {
    color: #d9d9d9;
    font-weight: 800;
    font-size: 1rem;
    height: 1.5rem;
    padding-left: 10px;
  }
`;
