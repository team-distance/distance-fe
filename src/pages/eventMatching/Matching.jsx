import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { instance } from '../../api/instance';
import { CHARACTERS } from '../../constants/CHARACTERS';
import MBTI from '../../components/home/MBTI';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const Matching = () => {
  const navigate = useNavigate();

  const [isMemberFetched, setIsMemberFetched] = useState(false);
  const [matchingOpponent, setMatchingOpponent] = useState({
    memberId: 0,
    nickName: '',
    telNum: null,
    reportCount: 0,
    memberProfileDto: {
      mbti: '',
      memberCharacter: '',
      department: '',
      memberTagDto: [],
      memberHobbyDto: [],
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance.post('/chatroom/create', {
        memberId: matchingOpponent.memberId,
      });
      navigate('/matching/success');
    } catch (error) {
      toast.error('채팅방 생성에 실패했습니다.');
    }
  };

  const getMatchingUser = async () => {
    const res = await instance.get('/event-matching/profile');
    setMatchingOpponent(res.data);
    setIsMemberFetched(true);
  };

  useEffect(() => {
    getMatchingUser();
  }, []);

  useEffect(() => {
    console.log('matchingOpponent', matchingOpponent);
  }, [matchingOpponent]);

  if (!isMemberFetched) {
    return (
      <WrapSpinner>
        <Loader />
      </WrapSpinner>
    );
  }

  return (
    <WrapForm onSubmit={handleSubmit}>
      <WrapContent>
        <Heading>
          <p>
            아래의 유저와 매칭되었어요!
            <br /> 대화를 시작해볼까요?
          </p>
        </Heading>
        {matchingOpponent ? (
          <WrapProfile>
            <Wrapper>
              <CharacterBackground
                $backgroundColor={
                  CHARACTERS[
                    matchingOpponent?.memberProfileDto?.memberCharacter
                  ]?.color
                }
              >
                <StyledImage
                  $xPos={
                    CHARACTERS[
                      matchingOpponent?.memberProfileDto?.memberCharacter
                    ]?.position[0]
                  }
                  $yPos={
                    CHARACTERS[
                      matchingOpponent?.memberProfileDto?.memberCharacter
                    ]?.position[1]
                  }
                />
                <MBTI
                  mbti={matchingOpponent?.memberProfileDto?.mbti}
                  color={
                    CHARACTERS[
                      matchingOpponent?.memberProfileDto?.memberCharacter
                    ]?.txt_color
                  }
                />
              </CharacterBackground>
              <WrapText>
                <School>{matchingOpponent?.school}</School>
                <Department>
                  {matchingOpponent?.memberProfileDto?.department}
                </Department>
              </WrapText>
              <TagContainer>
                {matchingOpponent?.memberProfileDto?.memberHobbyDto?.map(
                  (tag, index) => (
                    <Badge key={index}>#{tag.hobby}</Badge>
                  )
                )}
                {matchingOpponent?.memberProfileDto?.memberTagDto?.map(
                  (tag, index) => (
                    <Badge key={index}>#{tag.tag}</Badge>
                  )
                )}
              </TagContainer>
            </Wrapper>
          </WrapProfile>
        ) : null}
      </WrapContent>

      <Button
        size="large"
        type="submit"
        disabled={!isMemberFetched || !matchingOpponent}
      >
        대화 시작하기
      </Button>
    </WrapForm>
  );
};

export default Matching;

const WrapSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
  width: 50%;
  height: 33vh;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  padding: 0 6px;
  gap: 12px;
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: ${(props) => props.$backgroundColor};
`;

const StyledImage = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 60}px -${props.$yPos * 60}px`};
  background-size: calc(100% * 4);
`;

const WrapText = styled.div`
  width: 90%;
`;

const School = styled.div`
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Department = styled.div`
  font-weight: 700;
  color: #000000;
  text-align: center;
  font-size: 1.125rem;
  font-style: normal;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;
