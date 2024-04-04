import styled from "styled-components";
import { CHARACTERS } from "../../constants/character";
import { COLORS } from "../../constants/character";
import { useEffect } from "react";
import Badge from "../common/Badge";

const Profile = ({ id, profile, onClick }) => {
  // 글씨 크기 동적으로 조절
  useEffect(() => {
    const textMajorElement = document.querySelector(`.text-major-${id}`);

    const aLetter = 24;
    const innerTextLength = textMajorElement.innerText.length;
    const parentWidth = textMajorElement.closest("article").offsetWidth;

    if (textMajorElement) {
      if (aLetter * innerTextLength > parentWidth) {
        let adjustedALetter = parentWidth / innerTextLength;
        adjustedALetter = Math.floor(adjustedALetter);
        textMajorElement.style.fontSize = `${adjustedALetter}px`;
      }
    }
  }, [id]);

  return (
    <WrapPofile onClick={onClick}>
      <Wrapper>
        <CharacterBackground $character={profile.memberInfoDto.memberCharacter}>
          <StyledImage
            src={CHARACTERS[profile.memberInfoDto.memberCharacter]}
          />
        </CharacterBackground>
        <TextDiv>
          <MBTI>{profile.memberInfoDto.mbti}</MBTI>
          <div className={`text-major text-major-${id}`}>
            {profile.department}
          </div>
        </TextDiv>
        <TagContainer>
          {profile.memberInfoDto.memberHobbyDto.map((tag, index) => (
            <Badge key={index}>#{tag.hobby}</Badge>
          ))}
          {profile.memberInfoDto.memberTagDto.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </Wrapper>
    </WrapPofile>
  );
};
export default Profile;

const WrapPofile = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 33vh;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);

  &:active {
    filter: brightness(0.6);
    transition: 0.1s;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  .text-major {
    white-space: nowrap;
    font-weight: 700;
    color: #000000;
    text-align: center;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;
const MBTI = styled.div`
  color: #000000;
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;
