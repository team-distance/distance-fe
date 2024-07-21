import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';
import Profile from '../../components/home/Profile';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Banner from '../../components/common/Banner';
import ReloadButton from '../../components/home/ReloadButton';
import ProfileModal from '../../components/modal/ProfileModal';
import useModal from '../../hooks/useModal';

const HomeIndexPage = () => {
  const [selectedProfile, setSelectedProfile] = useState();
  const navigate = useNavigate();
  const [memberState, setMemberState] = useState();
  const [loading, setLoading] = useState(false);

  const { openModal: openProfileModal, closeModal: closeProfileModal } =
    useModal(() => (
      <ProfileModal
        closeModal={closeProfileModal}
        onClick={() => {
          handleCreateChatRoom(selectedProfile.memberId);
        }}
        selectedProfile={selectedProfile}
      />
    ));

  useEffect(() => {
    fetchMembers();
  }, []);

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

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    openProfileModal();
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
    closeProfileModal();
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

  const profile = [
    {
      memberProfileDto: {
        memberCharacter: 'KOALA',
        mbti: 'ENFP',
        department: '컴퓨터공학과',
        memberHobbyDto: [
          {
            hobby: '운동',
          },
          {
            hobby: '독서',
          },
        ],
        memberTagDto: [
          {
            tag: '밝음',
          },
          {
            tag: '친절함',
          },
        ],
      },
    },
    {
      memberProfileDto: {
        memberCharacter: 'CAT',
        mbti: 'INTJ',
        department: '컴퓨터공학과',
        memberHobbyDto: [
          {
            hobby: '운동',
          },
          {
            hobby: '독서',
          },
        ],
        memberTagDto: [
          {
            tag: '밝음',
          },
          {
            tag: '친절함',
          },
        ],
      },
    },
    {
      memberProfileDto: {
        memberCharacter: 'PENGUIN',
        mbti: 'INTP',
        department: '컴퓨터공학과',
        memberHobbyDto: [
          {
            hobby: '운동',
          },
          {
            hobby: '독서',
          },
        ],
        memberTagDto: [
          {
            tag: '밝음',
          },
          {
            tag: '친절함',
          },
        ],
      },
    },
    {
      memberProfileDto: {
        memberCharacter: 'PANDA',
        mbti: 'ISTJ',
        department: '컴퓨터공학과',
        memberHobbyDto: [
          {
            hobby: '운동',
          },
          {
            hobby: '독서',
          },
        ],
        memberTagDto: [
          {
            tag: '밝음',
          },
          {
            tag: '친절함',
          },
        ],
      },
    },
  ];

  useEffect(() => {
    setMemberState(profile);
  }, []);

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
    </>
  );
};

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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
