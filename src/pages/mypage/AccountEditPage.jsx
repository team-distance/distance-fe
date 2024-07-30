import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev';
import TextInput from '../../components/register/TextInput';
// import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import {useToast} from '../../hooks/useToast';

const AccountEditPage = () => {
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(true);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerifyPassword, setIsVerifyPassword] = useState(false);

  //토스트 메세지
  const {showToast: showVerifyPasswordToast} = useToast(
    () => <span>인증되었습니다.</span>, 'verify-password', 'bottom-center', 'success'
  )
  const {showToast: showVerifyPasswordErrorToast} = useToast(
    () => <span>비밀번호가 일치하지 않습니다.</span>, 'verify-password-error'
  )

  const verifyPassword = async (e) => {
    e.preventDefault();

    try {
      //비밀번호 확인
      await instance.post('/member/check/password', {
        password: oldPassword,
      });
      setIsVerifyPassword(true);
      showVerifyPasswordToast();
    } catch (error) {
      console.log(error.response.data.code);
      showVerifyPasswordErrorToast();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'password') {
      setVerifyPasswordFlag(value.length < 6);
      setOldPassword(value);
    }

    if (name === 'changePassword') {
      setIsDisabled(value.length < 6);
      setNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await instance
      .patch('/member/account/update', {
        password: newPassword,
      })
      .then(() => {
        alert('비밀번호 수정이 완료되었습니다');
        navigate('/mypage');
      })
      .catch((error) => {
        console.error(error);
      });
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
        <HeaderPrev title="계정 관리" navigateTo={-1} />

        <form>
          <TextInput
            label="현재 비밀번호"
            name="password"
            type="password"
            placeholder="숫자로만 6자리 이상"
            buttonLabel="인증하기"
            buttonClickHandler={verifyPassword}
            buttonDisabled={verifyPasswordFlag}
            onChange={handleChange}
          />
        </form>

        {isVerifyPassword && (
          <WrapForm onSubmit={handleSubmit}>
            <TextInput
              label="변경할 비밀번호"
              name="changePassword"
              type="password"
              placeholder="숫자로만 6자리 이상"
              onChange={handleChange}
            />
            <Button size="large" type="submit" disabled={isDisabled}>
              수정하기
            </Button>
          </WrapForm>
        )}

        <DropoutButton onClick={() => navigate('/mypage/account/dropout')}>
          <img src="/assets/dropout-icon.svg" alt="로그아웃" />
          <div>회원탈퇴</div>
        </DropoutButton>
      </WrapContent>
    </>
  );
};
export default AccountEditPage;

const WrapForm = styled.form`
  margin-top: 1rem;
  display: grid;
  gap: 8rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2rem;
  padding: 2rem;
`;

const DropoutButton = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  bottom: 3rem;
  align-items: center;
  gap: 4px;
  border-radius: 4px;
  padding: 4px;
  color: #ffffff;
  background-color: #aaaaaa;
  font-size: 14px;
  font-weight: 500;

  img {
    width: 14px;
  }
`;
