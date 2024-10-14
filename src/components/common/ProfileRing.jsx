import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import { useQuery } from '@tanstack/react-query';
import { instance } from '../../api/instance';
import useModal from '../../hooks/useModal';
import MyProfileModal from '../modal/MyProfileModal';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { useSetRecoilState } from 'recoil';
import { isLoggedInState } from '../../store/auth';

const ProfileRing = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const { data: myData, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => instance.get('/member/profile'),
    staleTime: Infinity,
  });

  const { openModal: openMyProfileModal, closeModal: closeMyProfileModal } =
    useModal(() => (
      <MyProfileModal
        closeModal={closeMyProfileModal}
        onClick={navigateToEditProfilePage}
        myData={myData.data}
        handleLogout={handleLogout}
      />
    ));

  const { showToast: showMyDataErrorToast } = useToast(
    () => <span>프로필 정보를 가져오는데 실패했어요!</span>,
    'my-data-error',
    'bottom-center'
  );

  const navigateToEditProfilePage = () => {
    closeMyProfileModal();
    navigate('/mypage/profile');
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    if (!confirmLogout) return;

    try {
      await instance.get('/member/logout');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      closeMyProfileModal();
      navigate('/');
    }
  };

  useEffect(() => {
    if (isError) showMyDataErrorToast();
  }, [isError]);

  return (
    myData?.data && (
      <Ring onClick={openMyProfileModal}>
        <Character
          $xPos={CHARACTERS[myData.data.memberCharacter]?.position[0]}
          $yPos={CHARACTERS[myData.data.memberCharacter]?.position[1]}
        />
      </Ring>
    )
  );
};

const Ring = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, #ff625d, #ffac0b);
    z-index: -1;
  }
`;

const Character = styled.div`
  width: 32px;
  height: 32px;
  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 32}px -${props.$yPos * 32}px`};
  background-size: calc(100% * 4);
`;

export default ProfileRing;
