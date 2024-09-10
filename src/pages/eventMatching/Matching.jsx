import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/common/Button';
// import { instance } from '../../api/instance';
import Profile from '../../components/home/Profile';
import { useCreateChatRoom } from '../../hooks/useCreateChatRoom';

const Matching = () => {
  const navigate = useNavigate();

  const [matchingOpponent, setMatchingOpponent] = useState({});
  const [isMemberFetched, setIsMemberFetched] = useState(false);

  const createChatRoom = useCreateChatRoom();

  const handleSubmit = async (e) => {
    e.preventDefault();
    createChatRoom();
    navigate('/matching/success');
  };

  useEffect(() => {
    // 매칭 상대 정보 불러오기
    // ******api테스트+로그인 안 되어있을 때 처리 필요
    const getMatchingUser = async () => {
      // const res = await instance.get('/event-matching/profile');
      // setMatchingOpponent(res.data);

      //더미데이터
      setMatchingOpponent({
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
      setIsMemberFetched(true);
    };
    getMatchingUser();
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
        <WrapProfile>
          {isMemberFetched && <Profile profile={matchingOpponent} />}
        </WrapProfile>
      </WrapContent>

      <Button size="large" type="submit" disabled={!isMemberFetched}>
        대화 시작하기
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

const WrapProfile = styled.div`
  width: 50%;
  margin: 0 auto;
`;
