import styled from 'styled-components'
import { useState } from 'react';
import { authInstance } from '../../api/instance';
import { useNavigate } from "react-router-dom";
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev'
import TextInput from '../../components/register/TextInput'

const AccountEditPage = () => {

  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(true);
  // const [isVerifyPassword, setIsVerifyPassword] = useState(false);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState(true);
  const [password, setPassword] = useState("");

  const verifyPassword = () => {
    //비밀번호 확인
    // setIsVerifyPassword(true);
    // alert("인증되었습니다");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "verifyPassword") {
      setVerifyPasswordFlag(value.length < 6);
    }

    if (name === "changePassword") {
      setIsDisabled(value.length < 6);
      setPassword(value);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    await authInstance.patch("/member/account/update", {
      password: password
    })
      .then(() => {
        alert("비밀번호 수정이 완료되었습니다");
        navigate("/mypage");
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
          buttonLabel={"인증하기"}
          buttonClickHandler={verifyPassword}
          buttonDisabled={verifyPasswordFlag}
          onChange={handleChange}
        />
      </div>

      <WrapForm onSubmit={handleSubmit}>
        <TextInput
          label="변경할 비밀번호"
          name="changePassword"
          type="text"
          placeholder="숫자로만 6자리 이상"
          onChange={handleChange}
        />
        <Button
        size="large"
        type="submit"
        disabled={isDisabled}>
        수정하기
      </Button>
      </WrapForm>
      
      <DropoutButton onClick={()=>navigate("/mypage/account/dropout")}>회원탈퇴</DropoutButton>
    </WrapContent>
  )
}
export default AccountEditPage


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
