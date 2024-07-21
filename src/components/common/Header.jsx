import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { isLoggedInState } from '../../store/auth';
import { Link } from 'react-router-dom';
import { myDataState } from '../../store/myData';
import { CHARACTERS } from '../../constants/CHARACTERS';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { instance } from '../../api/instance';
import toast from 'react-hot-toast';
import AuthUnivState from './AuthUnivState';
import MyProfileModal from '../modal/MyProfileModal';
import useModal from '../../hooks/useModal';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [myData, setMyData] = useRecoilState(myDataState);
  const navigate = useNavigate();

  const { openModal: openMyProfileModal, closeModal: closeMyProfileModal } =
    useModal(() => (
      <MyProfileModal
        closeModal={closeMyProfileModal}
        onClick={navigateToEditProfilePage}
        myData={myData}
        handleLogout={handleLogout}
      />
    ));

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

  const navigateToEditProfilePage = () => {
    navigate('/mypage/profile', { state: myData });
  };

  const getMyData = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await instance.get('/member/profile');
      setMyData(res.data);
    } catch (error) {
      toast.error('프로필 정보를 가져오는데 실패했어요!', {
        id: 'my-data-error',
        position: 'bottom-center',
      });
    }
  };

  useEffect(() => {
    getMyData();
  }, []);

  return (
    <>
      <WrapHeader>
        <img src="/assets/logo-pink.png" alt="디스턴스 로고" />
        {isLoggedIn ? (
          <ProfileWrapper>
            <AuthUnivState />
            <ProfileRing onClick={openMyProfileModal}>
              <Character
                $xPos={CHARACTERS[myData.memberCharacter]?.position[0]}
                $yPos={CHARACTERS[myData.memberCharacter]?.position[1]}
              />
            </ProfileRing>
          </ProfileWrapper>
        ) : (
          <StyledLink to="/login">로그인</StyledLink>
        )}
      </WrapHeader>
    </>
  );
};

const WrapHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;

  img {
    width: 8rem;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledLink = styled(Link)`
  font-weight: 600;
  color: #ff625d;
`;

const ProfileRing = styled.div`
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

export default Header;
