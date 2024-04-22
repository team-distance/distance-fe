import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';

import { CHARACTERS, COLORS } from '../../constants/character';
import Header from '../../components/common/Header';
import Profile from '../../components/home/Profile';
import Modal from '../../components/common/Modal';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Badge from '../../components/common/Badge';

const HomeIndexPage = () => {
  const profileModal = useRef();

  const [selectedProfile, setSelectedProfile] = useState();
  const navigate = useNavigate();

  const memberId = localStorage.getItem('memberId');
  const [memberState, setMemberState] = useState([]);

  const [isReloadButtonDisabled, setIsReloadButtonDisabled] = useState(false);
  const [remainingTimeToReload, setRemainingTimeToReload] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await instance.get('/gps/matching');
      setMemberState(res.data.matchedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadMembers = async () => {
    try {
      setLoading(true);
      setIsReloadButtonDisabled(true); // 버튼 비활성화
      setRemainingTimeToReload(3); // 초기 남은 시간 설정

      const res = await instance.get('/gps/matching');
      setMemberState(res.data.matchedUsers);

      // 매초마다 남은 시간 업데이트
      const intervalId = setInterval(() => {
        setRemainingTimeToReload((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId); // 남은 시간이 0이 되면 인터벌 정지
            setIsReloadButtonDisabled(false); // 버튼 활성화
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsReloadButtonDisabled(false); // 에러 발생 시 버튼 활성화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    if ('Notification' in window && Notification.permission !== 'granted') {
      toast.error((t) => (
        <>
          <span style={{ marginRight: '8px' }}>알림 설정이 꺼져있어요!</span>
          <Link to="/notification" style={{ color: '#0096FF' }}>
            해결하기
          </Link>
        </>
      ));
    }
  }, []);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    profileModal.current.open();
  };

  const handleCreateChatRoom = async (opponentMemberId) => {
    await instance
      .post('/chatroom/create', {
        memberId: opponentMemberId,
      })
      .then((res) => {
        const createdChatRoom = res.data;
        navigate(`/chat/${createdChatRoom}`, {
          state: {
            myId: memberId,
            opponentId: opponentMemberId,
            roomId: createdChatRoom,
          },
        });
      })
      .catch((error) => {
        switch (error.response.data.code) {
          case 'TOO_MANY_MY_CHATROOM':
            toast.error(
              '이미 생성된 채팅방 3개입니다. 기존 채팅방을 지우고 다시 시도해주세요.'
            );
            break;
          case 'TOO_MANY_OPPONENT_CHATROOM':
            toast.error(
              '상대방이 이미 생성된 채팅방 3개입니다. 상대방이 수락하면 알려드릴게요!'
            );
            break;
          case 'NOT_AUTHENTICATION_STUDENT':
            window.confirm('학생 인증 후 이용해주세요.') &&
              navigate('/verify/univ');
            break;
          case 'NOT_EXIST_GPS':
            toast.error('상대방의 위치정보가 없어 채팅을 할 수 없어요!');
            break;
          default:
            toast.error('로그인 후 이용해주세요.');
            break;
        }
      });
    profileModal.current.close();
  };

  return (
    <>
      <HomeContainer>
        <Header />

        {/* clientToken 임시적으로 홈화면에 표시 */}
        {/* {localStorage.getItem('clientToken') && (
          <div>
            <div
              style={{
                width: '100%',
                background: 'yellow',
                overflow: 'scroll',
              }}
            >
              토큰값: {localStorage.getItem('clientToken')}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  localStorage.getItem('clientToken')
                );
                toast.success('클립보드에 복사되었습니다.');
              }}
            >
              복사
            </button>
          </div>
        )} */}

        <ProfileContainer>
          {loading ? (
            <LoaderContainer>
              <ClipLoader color={'#FF625D'} loading={loading} size={50} />
            </LoaderContainer>
          ) : (
            memberState.map((profile, index) => (
              <Profile
                key={index}
                profile={profile}
                onClick={() => handleSelectProfile(profile)}
              />
            ))
          )}
        </ProfileContainer>
        <ReloadButton onClick={reloadMembers} disabled={isReloadButtonDisabled}>
          {isReloadButtonDisabled && (
            <div className="time-remaining">{remainingTimeToReload}</div>
          )}
          <img src="/assets/home/reload-button.png" alt="Reload button" />
        </ReloadButton>
      </HomeContainer>

      <Modal
        ref={profileModal}
        buttonLabel="메세지 보내기"
        buttonClickHandler={() => {
          handleCreateChatRoom(selectedProfile.memberId);
        }}
      >
        {selectedProfile && (
          <WrapContent>
            <CharacterBackground
              $character={selectedProfile.memberProfileDto.memberCharacter}
            >
              <StyledImage
                src={
                  CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]
                }
                alt={selectedProfile.memberProfileDto.memberCharacter}
              />
            </CharacterBackground>
            <TextDiv>
              <MBTI>{selectedProfile.memberProfileDto.mbti}</MBTI>
              <Major>{selectedProfile.memberProfileDto.department}</Major>
            </TextDiv>
            <TagContainer>
              {selectedProfile.memberProfileDto.memberHobbyDto.map(
                (hobby, index) => (
                  <Badge key={index}>#{hobby.hobby}</Badge>
                )
              )}
              {selectedProfile.memberProfileDto.memberTagDto.map(
                (tag, index) => (
                  <Badge key={index}>#{tag.tag}</Badge>
                )
              )}
            </TagContainer>
          </WrapContent>
        )}
      </Modal>
    </>
  );
};

const HomeContainer = styled.section`
  padding: 2rem 1.5rem;
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ReloadButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 7rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px 0px #0000001a;
  transition: 0.3s;

  > .time-remaining {
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: 700;
    color: #000000;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:disabled {
    filter: brightness(0.6);
  }
`;

const WrapContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 32px 0;
  gap: 12px;
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 60%;
  height: 0;
  padding-bottom: 60%;
  border-radius: 50%;
  background-color: ${(props) => COLORS[props.$character]};
`;

const StyledImage = styled.img`
  position: absolute;
  width: 60%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const TextDiv = styled.div`
  width: 100%;
  text-align: center;
  color: #333333;
`;

const Major = styled.div`
  font-size: 24px;
  font-weight: 700;
  white-space: nowrap;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
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

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export default HomeIndexPage;
