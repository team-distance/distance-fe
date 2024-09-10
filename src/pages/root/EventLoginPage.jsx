import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedInState, login } from '../../store/auth';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import { onGetToken } from '../../firebaseConfig';
import { registerDataState } from '../../store/registerDataState';

const EventLoginPage = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setRegisterData = useSetRecoilState(registerDataState);

  const [telNumTestFlag, setTelNumTestFlag] = useState(false);
  const [pwTestFlag, setPwTestFlag] = useState(false);
  const [loginResult, setLoginResult] = useState();
  const [showWarning, setShowWarning] = useState(false);

  const [loginValue, setLoginValue] = useState({
    telNum: '',
    password: '',
  });

  useEffect(() => {
    setIsLoggedIn(false);
    setRegisterData((prev) => ({
      ...prev,
      telNum: '',
      verifyNum: '',
      password: '',
      gender: '',
      college: '',
      department: '',
      mbti: '',
      memberCharacter: '',
      memberTagDto: [],
      memberHobbyDto: [],
      agreeTerms: false,
      agreePrivacy: false,
    }));
  }, []);

  const isDisabled = loginValue.telNum === '' || loginValue.password === '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowWarning(false);

    if (name === 'telNum') {
      setTelNumTestFlag(!(value.length === 11));
    }
    if (name === 'password') {
      setPwTestFlag(!(value.length >= 6));
    }

    setLoginValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telNumTestFlag || pwTestFlag) {
      setShowWarning(true);
      return;
    }

    if ('Notification' in window && Notification.permission !== 'granted') {
      alert('알림, 위치 권한을 허용해주세요!');
    }

    // clientToken 없어도 로그인 가능
    let clientToken = null;

    // clientToken 가져오기를 시도
    // 브라우저에서 최초로 앱을 실행할 때, clientToken이 없을 수 있음
    // 그래서 1회 시도 후 실패하면 다시 시도
    try {
      clientToken = await onGetToken();
      localStorage.setItem('clientToken', clientToken);
    } catch (err) {
      clientToken = await onGetToken().catch((error) => console.log(error));
      localStorage.setItem('clientToken', clientToken);
    }

    try {
      // 로그인 시도 (clientToken이 null일 수도 있음)
      await login({ ...loginValue, clientToken });

      // 로그인 성공 시
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      // 로그인 실패 시
      setShowWarning(true);
      setLoginResult(err.response?.status || 'Login failed');
    }
  };

  return (
    <WrapForm onSubmit={handleSubmit}>
      <WrapContent>
        <Heading>
          <img src="/assets/logo-pink.png" alt="logo" />
          <p>
            로그인하여 매칭된 상대와
            <br /> 대화를 시작해보세요!
          </p>
        </Heading>

        <div>
          <TextInput
            label="전화번호"
            name="telNum"
            type="text"
            onChange={handleChange}
            placeholder={"'-'없이 입력"}
          />
        </div>

        <div>
          <TextInput
            label="비밀번호"
            name="password"
            type="password"
            onChange={handleChange}
            placeholder={'6자리 이상'}
          />
          {showWarning && loginResult !== 200 && (
            <Tip>로그인 정보가 일치하지 않습니다!</Tip>
          )}
        </div>
      </WrapContent>

      <Button size="large" type="submit" disabled={isDisabled}>
        로그인하기
      </Button>
    </WrapForm>
  );
};

export default EventLoginPage;

const WrapForm = styled.form`
  margin-top: 8.4rem;
  padding: 2rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  padding-bottom: 5rem;
  width: 100%;
`;

const Heading = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    text-align: center;
    font-size: 1rem;
    font-weight: 400;
    line-height: normal;
  }

  img {
    width: 7.5rem;
    padding-bottom: 1.44rem;
  }
`;

const Tip = styled.small`
  font-size: 12px;
  color: #ff625d;
  font-weight: 700;
`;
