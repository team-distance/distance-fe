import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedInState, login } from '../../store/auth';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import TextInput from '../../components/register/TextInput';
import Button from '../../components/common/Button';
import { onGetToken } from '../../firebaseConfig';
import { instance } from '../../api/instance';
import Profile from '../../components/home/Profile';
import useModal from '../../hooks/useModal';
import ProfileModal from '../../components/modal/ProfileModal';

const Matching = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const [telNumTestFlag, setTelNumTestFlag] = useState(false);
  const [pwTestFlag, setPwTestFlag] = useState(false);
  const [loginResult, setLoginResult] = useState();
  const [showWarning, setShowWarning] = useState(false);

  const [matchingOpponent, setMatchingOpponent] = useState({
    memberId: 4,
    nickName: '불교학부INFJ#4',
    telNum: null,
    reportCount: 0,
    memberProfileDto: {
      mbti: 'INFJ',
      memberCharacter: 'CHICK',
      department: '불교학부',
      memberTagDto: [
        {
          tag: '수줍은',
        },
        {
          tag: '애교',
        },
      ],
      memberHobbyDto: [
        {
          hobby: '볼링',
        },
        {
          hobby: '축구',
        },
        {
          hobby: '클라이밍',
        },
      ],
    },
  });

  const [loginValue, setLoginValue] = useState({
    telNum: '',
    password: '',
  });

  // const { openModal: openProfileModal, closeModal: closeProfileModal } =
  //   useModal((profile) => (
  //     <ProfileModal
  //       closeModal={closeProfileModal}
  //       onClick={() => {
  //         handleCreateChatRoom(profile.memberId);
  //       }}
  //       selectedProfile={profile}
  //     />
  //   ));

  const isDisabled = loginValue.telNum === '' || loginValue.password.length < 6;

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
      navigate('/matching');
    } catch (err) {
      // 로그인 실패 시
      setShowWarning(true);
      setLoginResult(err.response?.status || 'Login failed');
    }
  };

  useEffect(() => {
    // 매칭 상대 정보 불러오기
    // const getMatchingUser = async () => {
    //   const res = await instance.get('/event-matching/profile');
    //   setMatchingOpponent(res.data);
    // };
    // getMatchingUser();
  }, []);

  return (
    <WrapForm onSubmit={handleSubmit}>
      <WrapContent>
        <Heading>
          <p>
            아래의 유저와 매칭되었어요!
            <br /> 대화를 시작해볼까요?
          </p>
        </Heading>
        {/* <Profile
          key={index}
          profile={matchingOpponent}
          onClick={() => openProfileModal(profile)}
        /> */}
      </WrapContent>

      <Button size="large" type="submit" disabled={isDisabled}>
        로그인하기
      </Button>
    </WrapForm>
  );
};

export default Matching;

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
