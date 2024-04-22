import styled from 'styled-components';
import { CHARACTERS } from '../../constants/character';
import { COLORS } from '../../constants/character';
import Badge from '../common/Badge';

const Profile = ({ profile, onClick }) => {
  return (
    <WrapProfile onClick={onClick}>
      <Wrapper>
        <CharacterBackground
          $character={profile.memberProfileDto.memberCharacter}
        >
          <StyledImage
            src={CHARACTERS[profile.memberProfileDto.memberCharacter]}
            alt={profile.memberProfileDto.memberCharacter}
          />
        </CharacterBackground>
        <div>
          <MBTI>{profile.memberProfileDto.mbti}</MBTI>
          <Department>{profile.memberProfileDto.department}</Department>
        </div>
        <TagContainer>
          {profile.memberProfileDto.memberHobbyDto.map((tag, index) => (
            <Badge key={index}>#{tag.hobby}</Badge>
          ))}
          {profile.memberProfileDto.memberTagDto.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </Wrapper>
    </WrapProfile>
  );
};
export default Profile;

const WrapProfile = styled.article`
  display: flex;
  justify-content: center;
  /* align-items: flex-start; */
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
  width: 60%;
  height: 0;
  /* margin-top: 5%; */
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

const Department = styled.div`
  white-space: nowrap;
  font-weight: 700;
  color: #000000;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  line-height: normal;
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
  overflow: scroll;
`;
