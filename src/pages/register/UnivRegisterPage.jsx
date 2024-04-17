import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Dropdown from "../../components/register/Dropdown";
import { useRecoilState } from "recoil";
import { registerDataState } from "../../store/registerDataState";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/register/ProgressBar";

const UnivRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setRegisterData((prev) => ({ ...prev, college, department }));
  }, [college, department]);

  // 새로고침하여 데이터가 사라졌을 때, 다시 회원가입 페이지로 이동
  useEffect(() => {
    if (
      registerData.telNum === "" ||
      registerData.verifyNum === "" ||
      registerData.password === ""
    ) {
      navigate("/register/user");
    }
  }, []);

  const isDisabled = !registerData.college || !registerData.department;

  const COLLEGE_PLACEHOLDER = "단과대학을 선택해주세요.";
  const DEPARTMENT_PLACEHOLDER = "학과를 선택해주세요.";
  const COLLEGE_STATE = [
    { college: "의과대학", department: ["의예과", "의학과", "간호학과"] },
    {
      college: "자연과학대학",
      department: [
        "수학과",
        "전자물리학과",
        "화학과",
        "식품영양학과",
        "환경보건학과",
        "생명과학과",
        "스포츠과학과",
        "사회체육학과",
        "스포츠의학과",
      ],
    },
    {
      college: "인문사회과학대학",
      department: [
        "국어국문학과",
        "영어영문학과",
        "중어중문학과",
        "국제문화학과",
        "유아교육과",
        "특수교육과",
        "청소년교육상담학과",
        "연극무용학과",
        "영화애니메이션학과",
        "미디어콘텐츠학과",
        "법학과",
        "행정학과",
        "경찰행정학과",
        "신문방송학과",
        "사회복지학과",
      ],
    },
    {
      college: "글로벌경영대학",
      department: [
        "GBS",
        "경영학과",
        "국제통상학과",
        "관광경영학과",
        "경제금융학과",
        "IT금융경영학과",
        "글로벌문화산업학과",
        "회계학과",
      ],
    },
    {
      college: "공과대학",
      department: [
        "컴퓨터공학과",
        "정보통신공학과",
        "전자공학과",
        "전기공학과",
        "전자정보공학과",
        "나노화학공학과",
        "에너지환경공학과",
        "디스플레이신소재공학과",
        "기계공학과",
      ],
    },
    {
      college: "SW융합대학",
      department: [
        "컴퓨터소프트웨어공학과",
        "정보보호학과",
        "의료IT공학과",
        "AI빅데이터학과",
        "사물인터넷학과",
        "메타버스&게임학과",
      ],
    },
    {
      college: "의료과학대학",
      department: [
        "보건행정경영학과",
        "의료생명공학과",
        "임상병리학과",
        "작업치료학과",
        "의약공학과",
        "의공학과",
      ],
    },
    {
      college: "SCH미디어랩스",
      department: [
        "한국문화콘텐츠학과",
        "영미학과",
        "중국학과",
        "미디어커뮤니케이션학과",
        "건축학과",
        "디지털애니메이션학과",
        "스마트자동차학과",
        "에너지공학과",
        "공연영상학과",
        "SCH미디어랩스",
      ],
    },
    {
      college: "창의라이프대학",
      department: [
        "스마트팩토리공학과",
        "스마트모빌리티공학과",
        "융합바이오화학공학과",
        "산업경영공학과",
        "세무회계학과",
        "자동차산업공학과",
        "융합기계학과",
        "신뢰성품질공학과",
        "화학공학과",
        "메카트로닉스공학과",
        "창의라이프대학",
      ],
    },
    {
      college: "엔터프라이즈스쿨",
      department: [
        "융합창업학부",
        "학생기업학부",
        "컨버전스디자인학과",
        "DSC모빌리티학부",
      ],
    },
  ];

  return (
    <>
      <WrapHeader>
        <ProgressBar progress={2} />
        <p>학과를 선택해주세요</p>
      </WrapHeader>

      <WrapContent>
        <Dropdown
          label="단과대학"
          name="college"
          placeholder={COLLEGE_PLACEHOLDER}
          types={COLLEGE_STATE.map((item) => item.college)}
          setState={setCollege}
        />
        <Dropdown
          label="학과"
          college={college}
          name="department"
          placeholder={DEPARTMENT_PLACEHOLDER}
          types={
            COLLEGE_STATE.find((c) => c.college === college)?.department || []
          }
          setState={setDepartment}
        />
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
  gap: 2rem;
  padding: 2rem;
`;

export default UnivRegisterPage;
