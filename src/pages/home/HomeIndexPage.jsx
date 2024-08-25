import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import Profile from '../../components/home/Profile';
import { useNavigate, Link } from 'react-router-dom';
import Banner from '../../components/common/Banner';
import ReloadButton from '../../components/home/ReloadButton';
import ProfileModal from '../../components/modal/ProfileModal';
import useModal from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';
import { useCheckAlarmActive } from '../../hooks/useCheckAlarmActive';
import { useCheckGpsActive } from '../../hooks/useCheckGpsActive';
import Loader from '../../components/common/Loader';

const HomeIndexPage = () => {
  const navigate = useNavigate();

  //알림, GPS 설정 관리
  const alarmActive = useCheckAlarmActive();
  const gpsActive = useCheckGpsActive();

  const [searchRange, setSearchRange] = useState(1000);
  const [isPermitOtherSchool, setIsPermitOtherSchool] = useState(false);

  const [memberState, setMemberState] = useState();
  const [loading, setLoading] = useState(false);

  const { openModal: openProfileModal, closeModal: closeProfileModal } =
    useModal((profile) => (
      <ProfileModal
        closeModal={closeProfileModal}
        onClick={() => {
          handleCreateChatRoom(profile.memberId);
        }}
        selectedProfile={profile}
      />
    ));

  // 토스트 메세지
  const { showToast: showFullMyChatroomToast } = useToast(
    () => (
      <span>
        이미 생성된 채팅방 5개입니다. 기존 채팅방을 지우고 다시 시도해주세요.
      </span>
    ),
    'too-many-my-chatroom'
  );
  const { showToast: showFullOppoChatroomToast } = useToast(
    () => (
      <span>
        상대방이 이미 생성된 채팅방 5개입니다. 상대방이 수락하면 알려드릴게요!
      </span>
    ),
    'too-many-oppo-chatroom'
  );
  const { showToast: showGpsErrorToast } = useToast(
    () => <span>상대방의 위치정보가 없어 채팅을 할 수 없어요!</span>,
    'too-many-oppo-chatroom'
  );
  const { showToast: showLoginErrorToast } = useToast(
    () => <span>로그인 후 이용해주세요.</span>,
    'too-many-oppo-chatroom'
  );

  const { showToast: showAlarmGPSErrorToast } = useToast(
    () => (
      <>
        <span style={{ textAlign: 'center' }}>
          알림과 위치 설정이 꺼져있어요!
          <br />
          <Link to="/mypage" style={{ color: '#0096FF' }}>
            해결하기
          </Link>
        </span>
      </>
    ),
    'alarm-gps-disabled',
    'bottom-center',
    'none'
  );

  const handleChangeSearchRange = (e) => {
    setSearchRange(e.target.value);
  };

  const handleChangeIsPermitOtherSchool = (e) => {
    setIsPermitOtherSchool(e.target.value);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await instance.post('/gps/matching', {
        isPermitOtherSchool,
        searchRange,
      });
      setMemberState(res.data.matchedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
            showFullMyChatroomToast();
            break;
          case 'TOO_MANY_OPPONENT_CHATROOM':
            showFullOppoChatroomToast();
            break;
          case 'NOT_AUTHENTICATION_STUDENT':
            window.confirm('학생 인증 후 이용해주세요.') &&
              navigate('/verify/univ');
            break;
          case 'NOT_EXIST_GPS':
            showGpsErrorToast();
            break;
          default:
            showLoginErrorToast();
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

  const checkAndShowToast = async () => {
    if (
      localStorage.getItem('isFirstLogin') === 'true' &&
      (!alarmActive || !gpsActive)
    ) {
      await showAlarmGPSErrorToast(); // 비동기 작업 예시
      localStorage.setItem('isFirstLogin', 'false');
    }
  };

  useEffect(() => {
    fetchMembers();
    checkAndShowToast();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [searchRange, isPermitOtherSchool]);

  return (
    <>
      <Banner alertText={alertTextList} />
      <div style={{ display: 'flex', gap: '1rem' }}>
        <select
          style={{ width: '100%' }}
          value={searchRange}
          onChange={handleChangeSearchRange}
        >
          <option value="1000">1km</option>
          <option value="5000">5km</option>
          <option value="10000">10km</option>
        </select>
        <select
          style={{ width: '100%' }}
          value={isPermitOtherSchool}
          onChange={handleChangeIsPermitOtherSchool}
        >
          <option value="false">같은 학교만</option>
          <option value="true">다른 학교 포함</option>
        </select>
      </div>
      <br />
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
            <Loader />
          ) : (
            memberState &&
            memberState.map((profile, index) => (
              <Profile
                key={index}
                profile={profile}
                onClick={() => openProfileModal(profile)}
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
