import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import Button from '../../components/common/Button';
import TextInput from '../../components/register/TextInput';
import { useEffect } from 'react';
import { UNIV_STATE } from '../../constants/collegeState';
import Checkbox from '../../components/common/Checkbox';
import { useToast, usePromiseToast } from '../../hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [schoolEmail, setSchoolEmail] = useState([]);
  const [domain, setDomain] = useState([]);
  const [domainIndex, setDomainIndex] = useState(0);
  const [school, setSchool] = useState('');
  const [webMailLink, setWebMailLink] = useState('');
  const [verifyNum, setVerifyNum] = useState('');
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const [isSendEmail, setIsSendEmail] = useState(false);

  //토스트 메세지
  const { showToast: showVerifyNumErrorToast } = useToast(
    () => <span>인증번호가 틀렸습니다.</span>,
    'verifynum-error'
  );
  const { showPromiseToast: showSendMessageToast } = usePromiseToast();

  const queryClient = useQueryClient();

  const handleChangeEmail = (e) => {
    setSchoolEmail(e.target.value);
    if (e.target.value !== '') {
      setEmailDisabled(false);
    } else {
      setEmailDisabled(true);
    }
  };

  const handleChangeVerifyNum = (e) => {
    setVerifyNum(e.target.value);
    if (e.target.value !== '') {
      setVerifyDisabled(false);
    } else {
      setVerifyDisabled(true);
    }
  };

  const sendEmail = async () => {
    //입력 된 값에서 @뒤로 다 지우기
    let baseEmail = schoolEmail.replace(/@.*/, '');
    setSchoolEmail(baseEmail);

    const fullEmail = schoolEmail.endsWith(domain[domainIndex])
      ? schoolEmail
      : schoolEmail + domain[domainIndex];

    console.log(fullEmail);

    const response = instance.post('/univ/send/email', {
      schoolEmail: fullEmail,
    });

    //테스트 필요 ------------------------------------------------

    showSendMessageToast(
      response,
      () => {
        setIsSendEmail(true);
        return '인증메일이 전송되었습니다.';
      },
      (error) => {
        if (error.response.data.code === 'INVALID_EMAIL_FORMAT') {
          return '이메일 형식이 올바르지 않습니다.';
        } else if (error.response.data.code === 'EXIST_EMAIL') {
          return '이미 존재하는 이메일 입니다.';
        } else {
          return '인증을 다시 시도해주세요.';
        }
      }
    );
  };

  const verifyEmail = async () => {
    try {
      await instance.post('/univ/certificate/email', {
        number: verifyNum.trim(),
        schoolEmail: schoolEmail.endsWith(domain[domainIndex])
          ? schoolEmail
          : schoolEmail + domain[domainIndex],
      });
      queryClient.invalidateQueries({ queryKey: ['authUniv'] });
      alert('인증되었습니다.');
      navigate('/');
    } catch (error) {
      showVerifyNumErrorToast();
    }
  };

  const handleCheckbox = (e) => {
    let isCheck = e.target.checked;
    if (isCheck) setDomainIndex(1);
    else setDomainIndex(0);
  };

  useEffect(() => {
    const getDomain = async () => {
      try {
        const res = await instance.get('/univ/check/univ-domain');
        if (res.data[0].includes('edu'))
          res.data[0] = res.data[0].replace('.ac.kr', '');
        setDomain(res.data);
        let subLink = res.data[0].replace('@', '');

        const filteredUniv = UNIV_STATE.filter((item) =>
          item.webMail.includes(subLink)
        );
        const webMailLinks = filteredUniv
          .map((item) => item.webMail)
          .toString();
        setWebMailLink(webMailLinks);

        const schoolNames = filteredUniv.map((item) => item.name).toString();
        setSchool(schoolNames);
      } catch (error) {
        console.log(error);
      }
    };
    getDomain();
  }, []);

  useEffect(() => {
    console.log(domain);
  }, [domain]);

  return (
    <WrapContent>
      <div>
        <Heading2>'학생 메일'로 인증하기</Heading2>
        <p>
          <strong>학교 도메인</strong>의 메일만 사용 가능해요
        </p>
      </div>
      {domain.length > 1 && (
        <Checkbox
          label="@jnu.ac.kr로 인증하기"
          onChange={handleCheckbox}
        ></Checkbox>
      )}
      <div>
        <Label>학생메일 인증하기</Label>
        <InputWrapper>
          <Input
            type="email"
            name="schoolEmail"
            value={schoolEmail}
            onChange={handleChangeEmail}
            placeholder="@ 앞 글자"
          />
          <SchoolDomain>{domain[domainIndex]}</SchoolDomain>
          <div>
            <Button size="small" disabled={emailDisabled} onClick={sendEmail}>
              메일 보내기
            </Button>
          </div>
        </InputWrapper>
        <WrapButton onClick={() => window.open(webMailLink)}>
          <p>{school.replace(/\(.*/, '')} 웹메일 바로 가기</p>
          <img src="/assets/arrow-pink-button.png" alt="way to verify email" />
        </WrapButton>
      </div>

      {isSendEmail && (
        <div>
          <TextInput
            label="인증번호"
            name="emailVerify"
            type="text"
            onChange={handleChangeVerifyNum}
            timerState={180}
            onTimerEnd={() => setIsSendEmail(false)}
          />
        </div>
      )}

      <Button size="large" disabled={verifyDisabled} onClick={verifyEmail}>
        인증완료
      </Button>
    </WrapContent>
  );
};
export default VerifyEmailPage;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  padding: 4rem 2rem 4rem 2rem;

  p {
    margin: 0;
    padding: 0;
    font-weight: 200;
  }

  strong {
    color: #ff625d;
    font-weight: 700;
  }
`;

const Heading2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;

  p {
    font-size: 0.8rem;
    font-weight: 500;
  }
  img {
    transform: rotate(180deg);
    width: 4%;
  }
`;

const Input = styled.input`
  width: 100%;
  flex-grow: 1;
  color: #333333;
  font-size: 1rem;
  border: none;
  background-color: transparent;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #d9d9d9;
    opacity: 1;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  padding-bottom: 0.3rem;
  margin-top: 0.5rem;

  &:focus-within {
    border-bottom: 2px solid #ff625d;
  }
`;

const SchoolDomain = styled.div`
  margin-right: 1rem;
  font-weight: 600;
  color: #777;
`;

const Label = styled.label`
  font-weight: 700;
  color: #333333;
`;
