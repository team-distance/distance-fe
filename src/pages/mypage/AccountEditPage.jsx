import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev';
import TextInput from '../../components/register/TextInput';

const AccountEditPage = () => {
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(true);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerifyPassword, setIsVerifyPassword] = useState(false);

  const verifyPassword = async () => {
    //비밀번호 확인
    await instance
      .post('/member/check/password', {
        password: oldPassword,
      })
      .then(() => {
        setIsVerifyPassword(true);
        alert('인증되었습니다');
      })
      .catch((error) => {
        console.log(error.response.data.code);
        alert('비밀번호가 일치하지 않습니다.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'verifyPassword') {
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
    <WrapContent>
      <HeaderPrev title="계정 관리" navigateTo={-1} />

      <div>
        <TextInput
          label="현재 비밀번호"
          name="verifyPassword"
          type="text"
          placeholder="숫자로만 6자리 이상"
          buttonLabel={'인증하기'}
          buttonClickHandler={verifyPassword}
          buttonDisabled={verifyPasswordFlag}
          onChange={handleChange}
        />
      </div>

      {isVerifyPassword && (
        <WrapForm onSubmit={handleSubmit}>
          <TextInput
            label="변경할 비밀번호"
            name="changePassword"
            type="text"
            placeholder="숫자로만 6자리 이상"
            onChange={handleChange}
          />
          <Button size="large" type="submit" disabled={isDisabled}>
            수정하기
          </Button>
        </WrapForm>
      )}

      <DropoutButton onClick={() => navigate('/mypage/account/dropout')}>
        회원탈퇴
      </DropoutButton>
    </WrapContent>
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

  div {
    padding-top: 0.5rem;
  }
`;

const DropoutButton = styled.div`
  position: absolute;
  left: 50%;
  bottom: 3rem;
  transform: translateX(-50%);
  color: #767676;
  font-size: 12px;
  font-weight: 500;
`;
