import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { isLoggedInState } from '../../store/auth';
import { Link } from 'react-router-dom';
import { myDataState } from '../../store/myData';
import { CHARACTERS, COLORS } from '../../constants/character';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useEffect, useRef } from 'react';
import Badge from './Badge';
import { instance } from '../../api/instance';
import toast from 'react-hot-toast';
import AuthUnivState from './AuthUnivState';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [myData, setMyData] = useRecoilState(myDataState);
  const modalRef = useRef();
  const navigate = useNavigate();

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
      modalRef.current.close();
      navigate('/');
    }
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
            <ProfileIcon
              $character={myData.memberCharacter}
              onClick={() => {
                modalRef.current.open();
              }}
            >
              <img
                src={CHARACTERS[myData.memberCharacter]}
                alt="프로필 이미지"
              />
            </ProfileIcon>
          </ProfileWrapper>
        ) : (
          <StyledLink to="/login">로그인</StyledLink>
        )}
      </WrapHeader>

      <Modal
        ref={modalRef}
        buttonLabel="프로필 수정하기"
        buttonColor="#FFAC0B"
        buttonClickHandler={() => {
          navigate('/mypage/profile', { state: myData });
        }}
      >
        <WrapContent>
          <CharacterBackground $character={myData.memberCharacter}>
            <StyledImage
              src={CHARACTERS[myData.memberCharacter]}
              alt={myData.memberCharacter}
            />
          </CharacterBackground>
          <TextDiv>
            <MBTI>{myData.mbti}</MBTI>
            <Major>{myData.department}</Major>
          </TextDiv>
          <TagContainer>
            {myData?.memberHobbyDto?.map((hobby, index) => (
              <Badge key={index}>#{hobby.hobby}</Badge>
            ))}
            {myData?.memberTagDto?.map((tag, index) => (
              <Badge key={index}>#{tag.tag}</Badge>
            ))}
          </TagContainer>
          <LogoutButton
            src="/assets/leave-button.svg"
            alt="나가기 버튼"
            onClick={handleLogout}
          />
        </WrapContent>
      </Modal>
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

const LogoutButton = styled.img`
  width: 28px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  left: 32px;
  padding: 4px;
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  position: relative;

  img {
    width: 32px;
    height: 32px;
  }

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

const WrapContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 32px 0;
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
  text-align: center;
  color: #333333;
  width: 100%;
  text-align: center;
`;

const Major = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export default Header;
