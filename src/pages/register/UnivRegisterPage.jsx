import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dropdown from '../../components/register/Dropdown';
import { useRecoilState } from 'recoil';
import { registerDataState } from '../../store/registerDataState';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/register/ProgressBar';
import { UNIV_STATE } from '../../constants/collegeState';

const UnivRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [school, setSchool] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setRegisterData((prev) => ({ ...prev, school, college, department }));
  }, [school, college, department]);

  // 새로고침하여 데이터가 사라졌을 때, 다시 회원가입 페이지로 이동
  useEffect(() => {
    if (
      !registerData.agreeTerms ||
      !registerData.agreePrivacy ||
      registerData.telNum === '' ||
      registerData.verifyNum === '' ||
      registerData.password === ''
    ) {
      navigate('/register/user');
    }
  }, []);

  useEffect(() => {
    setCollege('');
  }, [school]);

  useEffect(() => {
    setDepartment('');
  }, [college]);

  const isDisabled =
    !registerData.school || !registerData.college || !registerData.department;

  const UNIVERSITY_PLACEHOLDER = '대학을 선택해주세요.';
  const COLLEGE_PLACEHOLDER = '단과대학을 선택해주세요.';
  const DEPARTMENT_PLACEHOLDER = '학과를 선택해주세요.';

  return (
    <>
      <WrapHeader>
        <ProgressBar progress={2} />
        <p>학과를 선택해주세요</p>
      </WrapHeader>

      <WrapContent>
        <Dropdown
          label="대학교"
          name="school"
          placeholder={UNIVERSITY_PLACEHOLDER}
          types={UNIV_STATE.map((item) => item.name)}
          value={school}
          setValue={setSchool}
        />
        <Dropdown
          label="단과대학"
          name="college"
          placeholder={COLLEGE_PLACEHOLDER}
          types={UNIV_STATE.filter(({ name }) => name === school).flatMap(
            ({ state }) => state.map(({ college }) => college)
          )}
          value={college}
          setValue={setCollege}
        />
        <Dropdown
          label="학과"
          name="department"
          placeholder={DEPARTMENT_PLACEHOLDER}
          types={UNIV_STATE.flatMap(({ state }) => state)
            .filter(({ college: c }) => c === college)
            .flatMap(({ department }) => department)}
          value={department}
          setValue={setDepartment}
        />
      </WrapContent>
      <WrapButton>
        <Button
          size="large"
          disabled={isDisabled}
          onClick={() => {
            navigate('/register/profile');
          }}
        >
          프로필 등록하기
        </Button>
      </WrapButton>
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

const WrapButton = styled.div`
  display: grid;
  gap: 2rem;
  padding: 2rem;
  margin-top: 1rem;
`;

export default UnivRegisterPage;
