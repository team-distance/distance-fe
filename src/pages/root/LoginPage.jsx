import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedInState, login } from '../../store/auth';
import { useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import ClipLoader from 'react-spinners/ClipLoader';
import { onGetToken } from '../../firebaseConfig';
import { registerDataState } from '../../store/registerDataState';

const LoginPage = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setRegisterData = useSetRecoilState(registerDataState);
  const location = useLocation();
  const isExpired = location.search === '?expired=true';

  const [telNumTestFlag, setTelNumTestFlag] = useState(false);
  const [pwTestFlag, setPwTestFlag] = useState(false);
  const [loginResult, setLoginResult] = useState();
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

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
    // 로딩 상태 설정
    setLoading(true);

    let clientToken = null;

    try {
      // 토큰을 시도하여 가져옵니다.
      clientToken = await onGetToken();
      localStorage.setItem('clientToken', clientToken);
    } catch (err) {
      // 토큰 가져오기 실패, clientToken은 null로 유지
      console.error('Token fetch failed', err);
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
    } finally {
      // 로딩 상태 해제
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoaderContainer>
          <ClipLoader color={'#FF625D'} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <WrapForm onSubmit={handleSubmit}>
          <WrapContent>
            {location.state?.alert && alert('로그인이 필요합니다.')}
            <h2>전화번호로 로그인하기</h2>

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
                <Tip>비밀번호가 일치하지 않습니다!</Tip>
              )}
            </div>
          </WrapContent>
          {isExpired && (
            <LoginExpiredMessage>
              로그인 유지가 만료되었습니다. 다시 로그인해주세요!
            </LoginExpiredMessage>
          )}

          <Button size="large" type="submit" disabled={isDisabled}>
            로그인하기
          </Button>
          <WrapText>
            아직 계정이 없으신가요?
            <span onClick={() => navigate('/register/user')}>회원가입하기</span>
          </WrapText>
        </WrapForm>
      )}
    </>
  );
};

export default LoginPage;

const WrapForm = styled.form`
  padding: 2rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 4rem;
  margin-bottom: 8rem;
`;

const WrapText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #979797;
  padding: 1rem 0 4rem 0;
  font-size: 0.8rem;

  span {
    color: #000000;
    font-weight: 800;
    font-size: 1rem;
    padding-left: 0.3rem;
  }
`;

const Tip = styled.small`
  font-size: 12px;
  color: #ff625d;
  font-weight: 700;
`;

const LoginExpiredMessage = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  color: #ff625d;
  margin-bottom: 1rem;
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
