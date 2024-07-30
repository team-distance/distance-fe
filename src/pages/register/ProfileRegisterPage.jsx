import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DropdownMBTI from '../../components/register/DropdownMBTI';
import Toggle from '../../components/register/Toggle';
import Button from '../../components/common/Button';
import { CHARACTERS } from '../../constants/CHARACTERS';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { registerDataState } from '../../store/registerDataState';
import ProgressBar from '../../components/register/ProgressBar';
import CharacterModal from '../../components/modal/CharacterModal';
import AttractivenessModal from '../../components/modal/AttractivenessModal';
import HobbyModal from '../../components/modal/HobbyModal';
import useModal from '../../hooks/useModal';

/**
 * @todo 코드 간소화를 위해 지역 상태를 제거하고 전역 상태를 직접 변이할지?
 * @returns
 */
const ProfileRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [attractiveness, setAttractiveness] = useState([]);
  const [hobby, setHobby] = useState([]);
  const [hashtagCount, setHashtagCount] = useState(0);
  const [toggleState, setToggleState] = useState('');

  const { openModal: openCharacterModal, closeModal: closeCharacterModal } =
    useModal(() => (
      <CharacterModal
        onClick={setSelectedAnimal}
        closeModal={closeCharacterModal}
      />
    ));

  const {
    openModal: openAttractivenessModal,
    closeModal: closeAttractivenessModal,
  } = useModal(() => (
    <AttractivenessModal
      closeModal={closeAttractivenessModal}
      selectedList={attractiveness}
      hashtagCount={hashtagCount}
      onClick={setAttractiveness}
    />
  ));

  const { openModal: openHobbyModal, closeModal: closeHobbyModal } = useModal(
    () => (
      <HobbyModal
        closeModal={closeHobbyModal}
        selectedList={hobby}
        hashtagCount={hashtagCount}
        onClick={setHobby}
      />
    )
  );

  const navigate = useNavigate();

  useEffect(() => {
    setRegisterData((prev) => ({
      ...prev,
      memberCharacter: selectedAnimal,
      mbti: selectedMBTI,
      gender: toggleState,
      memberHobbyDto: hobby.map((value) => ({ hobby: value })),
      memberTagDto: attractiveness.map((value) => ({ tag: value })),
    }));
  }, [selectedAnimal, selectedMBTI, toggleState, attractiveness, hobby]);

  // 새로고침하여 데이터가 사라졌을 때, 다시 회원가입 페이지로 이동
  useEffect(() => {
    if (
      !registerData.agreeTerms ||
      !registerData.agreePrivacy ||
      registerData.telNum === '' ||
      registerData.verifyNum === '' ||
      registerData.password === '' ||
      registerData.college === '' ||
      registerData.department === ''
    ) {
      navigate('/register/user');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await instance
      .post('/member/signup', {
        telNum: registerData.telNum,
        password: registerData.password,
        school: registerData.school,
        college: registerData.college,
        department: registerData.department,
        gender: registerData.gender,
        mbti: selectedMBTI,
        memberCharacter: selectedAnimal,
        memberHobbyDto: registerData.memberHobbyDto,
        memberTagDto: registerData.memberTagDto,
      })
      .then(() => {
        window.scrollTo(0, 0);
        navigate('/register/done', {
          state: {
            telNum: registerData.telNum,
            password: registerData.password,
          },
        });

        setRegisterData((prev) => ({
          ...prev,
          telNum: '',
          verifyNum: '',
          password: '',
          gender: '',
          college: '',
          department: '',
          mbti: '',
          memberCharacter: '',
          memberTagDto: [],
          memberHobbyDto: [],
        }));
      })
      .catch((error) => {
        alert('회원정보 등록에 실패했습니다.');
      });
  };

  const filterSelectedAttractiveness = (target) => {
    setAttractiveness((prev) => prev.filter((value) => value !== target));
  };

  const filterSelectedHobby = (target) => {
    setHobby((prev) => prev.filter((value) => value !== target));
  };

  const isDisabled =
    !selectedAnimal ||
    !selectedMBTI ||
    hashtagCount < 3 ||
    !toggleState ||
    hashtagCount > 5;

  useEffect(() => {
    setHashtagCount(attractiveness.length + hobby.length);
  }, [attractiveness, hobby]);

  return (
    <>
      <WrapHeader>
        <ProgressBar progress={4} />
        <p>프로필을 등록해주세요</p>
      </WrapHeader>

      <WrapContent>
        <div>
          <Label>캐릭터 선택하기</Label>
          <ProfileContainer onClick={openCharacterModal}>
            <img
              className="side-image-left"
              src="/assets/profile-register-leftimg.png"
              alt="profile register button"
            />
            {selectedAnimal === '' ? (
              <img
                src="/assets/profile-register-plusbutton.png"
                alt="profile register button"
              />
            ) : (
              <SelectedCharacter
                $xPos={CHARACTERS[selectedAnimal]?.position[0]}
                $yPos={CHARACTERS[selectedAnimal]?.position[1]}
              />
            )}
            <img
              className="side-image-right"
              src="/assets/profile-register-rightimg.png"
              alt="profile register button"
            />
          </ProfileContainer>
        </div>

        <div>
          <Label>MBTI 선택하기</Label>
          <DropdownMBTI state={selectedMBTI} setState={setSelectedMBTI} />
        </div>

        <div>
          <Label>성별 선택하기</Label>
          <Toggle univ={registerData.school} setState={setToggleState} />
        </div>

        <div>
          <Label>해시태그 선택하기</Label>
          <Tip>최소 3개, 최대 5개까지 고를 수 있어요!</Tip>

          <br />
          <WrapSmallTitle>
            <div className="small-label">저는 이런 매력이 있어요!</div>
            <AddButton onClick={openAttractivenessModal}>+ 추가하기</AddButton>
          </WrapSmallTitle>
          <BadgeContainer>
            {attractiveness.map((value, index) => (
              <Badge
                key={index}
                onClick={() => filterSelectedAttractiveness(value)}
              >
                {value}
                <img src="/assets/cancel-button.png" alt="cancel" />
              </Badge>
            ))}
          </BadgeContainer>

          <WrapSmallTitle>
            <div className="small-label">저는 이런 취미가 있어요!</div>
            <AddButton onClick={openHobbyModal}>+ 추가하기</AddButton>
          </WrapSmallTitle>
          <BadgeContainer>
            {hobby.map((value, index) => (
              <Badge key={index} onClick={() => filterSelectedHobby(value)}>
                {value}
                <img src="/assets/cancel-button.png" alt="cancel" />
              </Badge>
            ))}
          </BadgeContainer>
        </div>

        <Button disabled={isDisabled} onClick={handleSubmit} size="large">
          가입 완료하기
        </Button>
      </WrapContent>
    </>
  );
};

const SelectedCharacter = styled.div`
  width: 96px;
  height: 96px;
  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 96}px -${props.$yPos * 96}px`};
  background-size: calc(100% * 4);
`;

const WrapHeader = styled.div`
  display: grid;
  padding: 2rem 2rem 3rem 2rem;

  p {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0;
    margin: 0;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  padding-top: 1rem;
  position: relative;
  width: 100%;

  img {
    width: 30%;
  }

  .side-image-left {
    position: absolute;
    bottom: -10%;
    left: 12%;
    z-index: 1;
  }
  .side-image-right {
    position: absolute;
    bottom: -10%;
    right: 12%;
    z-index: 1;
  }
`;

const Badge = styled.div`
  position: relative;
  height: fit-content;
  background-color: #ff625d;
  padding: 0.5rem 1rem;
  color: #ffffff;
  border-radius: 12px;

  img {
    width: 13px;
    padding-left: 0.5rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: 96px;
  padding: 0.5rem;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  background-image: linear-gradient(180deg, #fff 0%, #f2f2f2 100%);
  margin-bottom: 1.5rem;
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2rem;
  padding: 0rem 2rem 4rem 2rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 16px;
`;

const WrapSmallTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  div {
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const Tip = styled.div`
  color: #90949b;
  font-size: 12px;
  margin-top: -1em;
`;

const AddButton = styled.button`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  padding: 4px;
`;

export default ProfileRegisterPage;
