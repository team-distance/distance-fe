import React from 'react';
import styled from 'styled-components';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isLoggedInState } from '../../store/auth';

const HomeIndexPage = () => {
  const queryClient = useQueryClient();
  const matchingConfig = useRecoilValue(matchingConfigState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  // const {
  //   openModal: openServiceClosingModal,
  //   closeModal: closeServiceClosingModal,
  // } = useModal(() => (
  //   <ServiceClosingModal closeModal={closeServiceClosingModal} />
  // ));

  // useEffect(() => {
  //   const dismissedList =
  //     JSON.parse(localStorage.getItem('dismissForever')) || [];

  //   const isDismissed = dismissedList.some(
  //     (item) => item.name === 'serviceClosing' && item.type === 'modal'
  //   );

  //   if (!isDismissed) {
  //     openServiceClosingModal();
  //   }
  // }, []);

  const { data: matchingList, isLoading: isLoadingMatchingList } = useQuery({
    queryKey: ['matching', matchingConfig],
    queryFn: () =>
      instance
        .get('/gps/matching', {
          params: matchingConfig,
        })
        .then((res) => res.data.matchedUsers),
    staleTime: Infinity,
  });

  const { openModal: openProfileModal, closeModal: closeProfileModal } =
    useModal((profile) => (
      <ProfileModal closeModal={closeProfileModal} selectedProfile={profile} />
    ));

  const {
    openModal: openMatchingConfigModal,
    closeModal: closeMatchingConfigModal,
  } = useModal(
    () => <MatchingConfigBottomsheet closeModal={closeMatchingConfigModal} />,
    { backdrop: false }
  );

  const alertTextList = [
    {
      index: 1,
      text1: '📢 ',
      em: '일주일 이내',
      text2: ' 로그인한 유저만 홈화면에 표시됩니다.',
    },
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

      {isLoadingMatchingList ? (
        <Loader />
      ) : matchingList.length ? (
        <ProfileContainer>
          {matchingList.map((profile, index) => (
            <Profile
              key={index}
              school={profile.school}
              reportCount={profile.reportCount}
              profile={profile}
              onClick={() => openProfileModal(profile)}
            />
          ))}
        </ProfileContainer>
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src="/assets/empty-home.svg" alt="empty icon" />
            <div>현재 근처에 있는 사람이 없어요!</div>
          </div>
        </EmptyContainer>
      )}

      {isLoggedIn && <MatchingConfigButton onClick={openMatchingConfigModal} />}

      <ReloadButton
        onClick={() =>
          queryClient.invalidateQueries({
            queryKey: ['matching', matchingConfig],
          })
        }
      />
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
