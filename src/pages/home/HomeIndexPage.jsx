import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useRef, useState } from 'react';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';

import { CHARACTERS, COLORS } from '../../constants/character';
import Profile from '../../components/home/Profile';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Badge from '../../components/common/Badge';
import Banner from '../../components/common/Banner';
import ReloadButton from '../../components/home/ReloadButton';

const HomeIndexPage = () => {
  const profileModal = useRef();
  const [selectedProfile, setSelectedProfile] = useState();
  const navigate = useNavigate();
  const [memberState, setMemberState] = useState();
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

  useEffect(() => {
    fetchMembers();
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
        navigate(`/chat/${createdChatRoom}`);
      })
      .catch((error) => {
        switch (error.response.data.code) {
          case 'TOO_MANY_MY_CHATROOM':
            toast.error(
              '이미 생성된 채팅방 5개입니다. 기존 채팅방을 지우고 다시 시도해주세요.',
              {
                position: 'bottom-center',
              }
            );
            break;
          case 'TOO_MANY_OPPONENT_CHATROOM':
            toast.error(
              '상대방이 이미 생성된 채팅방 5개입니다. 상대방이 수락하면 알려드릴게요!',
              {
                position: 'bottom-center',
              }
            );
            break;
          case 'NOT_AUTHENTICATION_STUDENT':
            window.confirm('학생 인증 후 이용해주세요.') &&
              navigate('/verify/univ');
            break;
          case 'NOT_EXIST_GPS':
            toast.error('상대방의 위치정보가 없어 채팅을 할 수 없어요!', {
              position: 'bottom-center',
            });
            break;
          default:
            toast.error('로그인 후 이용해주세요.', {
              position: 'bottom-center',
            });
            break;
        }
      });
    profileModal.current.close();
  };

  const alertTextList = [
    // {
    //   text1: '📢 distance는 이성만 매칭됩니다! 👥 현재 순천향대 학생 가입',
    //   em: '400건 돌파',
    //   text2: '',
    // },
    {
      index: 2,
      text1: '📢 ',
      em: '알림/GPS 활성화 방법',
      text2: '은 마이페이지에서 확인하실 수 있습니다.',
    },
  ];

  return (
    <>
      <Banner alertText={alertTextList} />
      {memberState && memberState.length === 0 ? (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/empty-home.svg'} alt="empty icon" />
            <div>현재 근처에 있는 사람이 없어요!</div>
          </div>
        </EmptyContainer>
      ) : (
        <ProfileContainer>
          {loading ? (
            <LoaderContainer>
              <ClipLoader color={'#FF625D'} loading={loading} size={50} />
            </LoaderContainer>
          ) : (
            memberState &&
            memberState.map((profile, index) => (
              <Profile
                key={index}
                profile={profile}
                onClick={() => handleSelectProfile(profile)}
              />
            ))
          )}
        </ProfileContainer>
      )}
      <ReloadButton onClick={fetchMembers} />

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

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64vh;

  > .wrap {
    text-align: center; // 텍스트를 중앙 정렬합니다.

    > img {
      margin-bottom: 1rem; // 아이콘과 텍스트 사이의 간격을 조정합니다.
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

export default HomeIndexPage;
