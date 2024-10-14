import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { instance } from '../../api/instance';
import Profile from '../../components/home/Profile';
import Banner from '../../components/common/Banner';
import ReloadButton from '../../components/home/ReloadButton';
import ProfileModal from '../../components/modal/ProfileModal';
import useModal from '../../hooks/useModal';
import Loader from '../../components/common/Loader';
import MatchingConfigButton from '../../components/home/MatchingConfigButton';
import MatchingConfigBottomsheet from '../../components/modal/MatchingConfigBottomsheet';
import { useRecoilValue } from 'recoil';
import { matchingConfigState } from '../../store/matchingConfig';
import { useCreateChatRoom } from '../../hooks/useCreateChatRoom';

const HomeIndexPage = () => {
  const [memberState, setMemberState] = useState();
  const [loading, setLoading] = useState(false);
  const [isProfileButtonClicked, setIsProfileButtonClicked] = useState(false);

  const matchingConfig = useRecoilValue(matchingConfigState);
  const createChatRoom = useCreateChatRoom();

  const { openModal: openProfileModal, closeModal: closeProfileModal } =
    useModal((profile) => (
      <ProfileModal
        closeModal={closeProfileModal}
        isButtonClicked={isProfileButtonClicked}
        onClick={() => {
          createChatRoom(
            profile.memberId,
            closeProfileModal,
            setIsProfileButtonClicked
          );
        }}
        selectedProfile={profile}
      />
    ));

  const {
    openModal: openMatchingConfigModal,
    closeModal: closeMatchingConfigModal,
  } = useModal(
    () => <MatchingConfigBottomsheet closeModal={closeMatchingConfigModal} />,
    { backdrop: false }
  );

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await instance.post('/gps/matching', matchingConfig);
      setMemberState(res.data.matchedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [matchingConfig]);

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
            <Loader />
          ) : (
            memberState &&
            memberState.map((profile, index) => (
              <Profile
                key={index}
                school={profile.school}
                reportCount={profile.reportCount}
                profile={profile}
                onClick={() => openProfileModal(profile)}
              />
            ))
          )}
        </ProfileContainer>
      )}
      <MatchingConfigButton onClick={openMatchingConfigModal} />
      <ReloadButton onClick={fetchMembers} />
    </>
  );
};

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    2,
    minmax(150px, 1fr)
  ); /* 최소 200px, 최대 1fr */
  gap: 16px;
  width: 100%;
  margin: 0 auto;
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
