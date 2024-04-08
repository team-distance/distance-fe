import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { isLoggedInState } from "../../store/auth";
import { Link } from "react-router-dom";
import { myDataState } from "../../store/myData";
import { CHARACTERS, COLORS } from "../../constants/character";

const Header = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const myData = useRecoilValue(myDataState);

  return (
    <WrapHeader>
      <img src="/assets/logo-pink.png" alt="디스턴스 로고" />

      {isLoggedIn ? (
        <ProfileIcon $character={myData.memberCharacter}>
          <img src={CHARACTERS[myData.memberCharacter]} alt="프로필 이미지" />
        </ProfileIcon>
      ) : (
        <StyledLink to="/login">로그인</StyledLink>
      )}
    </WrapHeader>
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

const StyledLink = styled(Link)`
  font-weight: 600;
  color: #ff625d;
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => COLORS[props.$character]};

  img {
    width: 32px;
    height: 32px;
  }
`;

export default Header;
