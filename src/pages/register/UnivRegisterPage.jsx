import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Dropdown from "../../components/register/Dropdown";
import Checkbox from "../../components/common/Checkbox";
import { useRecoilState } from "recoil";
import { registerDataState } from "../../store/registerDataState";
import TextInput from "../../components/register/TextInput";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { defaultInstance } from "../../api/instance";
import HeaderPrev from "../../components/common/HeaderPrev";
import ProgressBar from "../../components/register/ProgressBar";

const UnivRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [school, setSchool] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [emailButtonLabel, setEmailButtonLabel] = useState("메일 중복 확인");
  const [emailCertify, setEmailCertify] = useState(false);
  const [certificationValue, setCertificationValue] = useState("");
  const [registerComplete, setRegisterComplete] = useState(false);
  // const [emailDomain, setEmailDomain] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "schoolEmail") {
      setEmailButtonLabel("메일 중복 확인");
    }
    setEmailCertify(false);
    setRegisterData({ ...registerData, [name]: value });
  };
  const handleChangeCertification = (e) => {
    setCertificationValue(e.target.value);
    //이메일 인증 번호 보내는 api 함수 호출
  };

  const handleChecked = (e) => {
    const { name, checked } = e.target;
    setRegisterData({ ...registerData, [name]: checked });
  };

  useEffect(() => {
    setRegisterData((prev) => ({ ...prev, school, college, department }));
  }, [school, college, department]);

  const isDisabled =
    !registerData.agreeTerms || !registerData.agreePrivacy || !registerComplete;

  const emailIsDisabled =
    !registerData.school ||
    !registerData.college ||
    !registerData.department ||
    !registerData.schoolEmail ||
    emailCertify;

  const UNIV_PLACEHOLDER = "학교를 선택해주세요.";
  const UNIV_TYPES = ["구름대학교"];

  const COLLEGE_PLACEHOLDER = "단과대학을 선택해주세요.";
  const COLLEGE_TYPES = ["구름톤2기"];

  const DEPARTMENT_PLACEHOLDER = "학과를 선택해주세요.";
  const DEPARTMENT_TYPES = ["기획과", "디자인과", "프론트과", "백엔드과"];

  const checkEmail = async () => {
    console.log(registerData.schoolEmail);
    try {
      const res = await defaultInstance.post("/univ/check/email", {
        schoolEmail: registerData.schoolEmail,
      });
      if (res.data) {
        alert("사용 가능한 이메일 입니다.");
        setEmailButtonLabel("메일 보내기");
      }
    } catch (error) {
      alert("사용 불가능한 이메일 입니다.");
      console.log(error);
    }
  };
  const sendEmail = async () => {
    console.log(registerData.schoolEmail);
    try {
      const res = await defaultInstance.post("/univ/send/email", {
        schoolEmail: registerData.schoolEmail,
      });
      if (res.data) {
        alert("인증 번호를 보냈습니다.");
      }
    } catch (error) {
      alert("인증에 실패했습니다.");
      console.log(error);
    }
  };

  const getButtonClickHandler = () => {
    if (emailButtonLabel === "메일 중복 확인") {
      checkEmail();
    } else if (emailButtonLabel === "메일 보내기") {
      sendEmail();
      setEmailCertify(true);
    } else {
      console.log("else");
    }
  };

  const getCertificationHandler = async () => {
    try {
      const res = await defaultInstance.post("/univ/certificate/email", {
        number: certificationValue,
      });
      if (res.data) {
        console.log(res.data);
        alert("인증되었습니다.");
        setRegisterComplete(true);
      } else {
        alert("인증에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("인증에 실패했습니다. 다시 시도해주세요.");
      console.log(error);
    }
  };

  // const handleGetEmailDomain = async () => {
  //   console.log(registerData.school);
  //   try {
  //     const res = await authInstance.post("/univ/check/univ-domain", {
  //       schoolName: registerData.school,
  //     });
  //     console.log(res);
  //     alert('인증되었습니다.');
  //     setRegisterComplete(true);
  //     // setEmailDomain(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <>
      <WrapHeader>
        <ProgressBar progress={2} />
        <p>전화번호를 인증해주세요</p>
      </WrapHeader>

      <WrapContent>
        <Dropdown
          label="학교"
          placeholder={UNIV_PLACEHOLDER}
          types={UNIV_TYPES}
          setState={setSchool}
        // onClick={handleGetEmailDomain}
        />

        <Dropdown
          label="단과대학"
          placeholder={COLLEGE_PLACEHOLDER}
          types={COLLEGE_TYPES}
          setState={setCollege}
        />

        <Dropdown
          label="학과"
          placeholder={DEPARTMENT_PLACEHOLDER}
          types={DEPARTMENT_TYPES}
          setState={setDepartment}
        />

        <TextInput
          label="학생메일 인증하기"
          name="schoolEmail"
          type="email"
          buttonLabel={emailButtonLabel}
          buttonDisabled={emailIsDisabled}
          value={registerData.schoolEmail}
          onChange={handleChange}
          buttonClickHandler={getButtonClickHandler}
        />
        {emailCertify && (
          <TextInput
            label="인증번호"
            name="emailCertification"
            type="text"
            buttonLabel="인증하기"
            onChange={handleChangeCertification}
            buttonClickHandler={getCertificationHandler}
            timerState={300}
            onTimerEnd={() => setEmailCertify(false)}
          />
        )}

        <WrapCheckbox>
          <Checkbox
            label="(필수) 이용약관 동의"
            name="agreeTerms"
            onChange={handleChecked}
            checked={registerData.agreeTerms}
          />
          <Checkbox
            label="(필수) 개인정보 수집 및 활용 동의"
            name="agreePrivacy"
            onChange={handleChecked}
            checked={registerData.agreePrivacy}
          />
        </WrapCheckbox>

        <Button
          size="large"
          disabled={isDisabled}
          onClick={() => {
            navigate("/register/profile");
          }}>
          프로필 등록하기
        </Button>
      </WrapContent>
    </>
  );
};

const WrapHeader = styled.div`
  display: grid;
  padding: 4rem 2rem 0 2rem;
  
  p {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2rem;
  padding: 2rem;
`;

const WrapCheckbox = styled.div`
  display: flex;
  flex-direction: column;
`;

export default UnivRegisterPage;
