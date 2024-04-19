import styled from "styled-components";
import { useState } from "react";
import { instance } from "../../api/instance";
import Button from "../../components/common/Button";
import HeaderPrev from "../../components/common/HeaderPrev";
import TextInput from "../../components/register/TextInput";

const DropoutPage = () => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [verifyPasswordFlag, setVerifyPasswordFlag] = useState(true);
  const [password, setPassword] = useState("");

  const verifyPassword = async() => {
    //비밀번호 확인
    await instance.post("/member/check/password", {
      password: password
    })
    .then(() => {
      setIsDisabled(false);
      alert("인증되었습니다");
    })
    .catch((error) => {
      console.log(error.response.data.code);
      alert("비밀번호가 일치하지 않습니다.");
    });
  };

  const handleDropout = async () => {
    try {
      await instance.delete("/member");
      localStorage.clear();
      window.confirm("정말 탈퇴하시겠습니까?") &&
        alert("탈퇴가 정상적으로 완료되었습니다");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "verifyPassword") {
      setVerifyPasswordFlag(value.length < 6);
      setPassword(value);
    }
  };

  return (
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
          type="text"
          placeholder="숫자로만 6자리 이상"
          buttonLabel={"인증하기"}
          buttonClickHandler={verifyPassword}
          buttonDisabled={verifyPasswordFlag}
          onChange={handleChange}
        />
      </div>

      <Button size="large" disabled={isDisabled} onClick={handleDropout}>
        탈퇴하기
      </Button>
    </WrapContent>
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
