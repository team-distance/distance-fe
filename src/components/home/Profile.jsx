import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';

const Profile = ({ profile, onClick }) => {
  const { memberCharacter, mbti, department, memberHobbyDto, memberTagDto } =
    profile.memberProfileDto;

  return (
    <WrapProfile onClick={onClick}>
      <Wrapper>
        <CharacterBackground
          $backgroundColor={CHARACTERS[memberCharacter]?.color}
        >
          <StyledImage
            $xPos={CHARACTERS[memberCharacter]?.position[0]}
            $yPos={CHARACTERS[memberCharacter]?.position[1]}
          />
        </CharacterBackground>
        <WrapText>
          <MBTI>{mbti}</MBTI>
          <Department>{department}</Department>
        </WrapText>
        <TagContainer>
          {memberHobbyDto.map((tag, index) => (
            <Badge key={index}>#{tag.hobby}</Badge>
          ))}
          {memberTagDto.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </Wrapper>
    </WrapProfile>
  );
};
export default Profile;

const WrapProfile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 33vh;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.05);
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  padding: 0 6px;
  gap: 12px;
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: ${(props) => props.$backgroundColor};
`;

const StyledImage = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 60}px -${props.$yPos * 60}px`};
  background-size: calc(100% * 4);
`;

const WrapText = styled.div`
  width: 90%;
`;

const Department = styled.div`
  font-weight: 700;
  color: #000000;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
