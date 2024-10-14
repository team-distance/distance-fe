import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { isLoggedInState } from '../../store/auth';
import { Link } from 'react-router-dom';
import AuthUnivState from './AuthUnivState';
import ProfileRing from './ProfileRing';

const Header = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  return (
    <>
      <WrapHeader>
        <img src="/assets/logo-pink.png" alt="디스턴스 로고" />
        {isLoggedIn ? (
          <ProfileWrapper>
            <AuthUnivState />
            <ProfileRing />
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

export default Header;
