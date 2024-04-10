import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { isLoggedInState } from "../../store/auth";
import { Link } from "react-router-dom";
import { myDataState } from "../../store/myData";
import { CHARACTERS, COLORS } from "../../constants/character";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useRef } from "react";
import Badge from "./Badge";

const Header = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const myData = useRecoilValue(myDataState);
  const modalRef = useRef();
  const navigate = useNavigate();

  return (
    <>
      <WrapHeader>
        <img src="/assets/logo-pink.png" alt="디스턴스 로고" />
        {isLoggedIn ? (
          <ProfileIcon
            $character={myData.memberCharacter}
            onClick={() => {
              console.log("clicked!");
              modalRef.current.open();
            }}>
            <img src={CHARACTERS[myData.memberCharacter]} alt="프로필 이미지" />
          </ProfileIcon>
        ) : (
          <StyledLink to="/login">로그인</StyledLink>
        )}
      </WrapHeader>
      <Modal
        ref={modalRef}
        buttonLabel="프로필 수정하기"
        buttonColor="#FFAC0B"
        buttonClickHandler={() => {
          navigate("/mypage/profile", { state: myData });
        }}>
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
            {myData.memberHobbyDto.map((hobby, index) => (
              <Badge key={index}>#{hobby.hobby}</Badge>
            ))}
            {myData.memberTagDto.map((tag, index) => (
              <Badge key={index}>#{tag.tag}</Badge>
            ))}
          </TagContainer>
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
  white-space: nowrap;
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
