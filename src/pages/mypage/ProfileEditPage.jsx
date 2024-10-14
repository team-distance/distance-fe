import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DropdownMBTI from '../../components/register/DropdownMBTI';
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { CHARACTERS } from '../../constants/CHARACTERS';
import useModal from '../../hooks/useModal';
import CharacterModal from '../../components/modal/CharacterModal';
import AttractivenessModal from '../../components/modal/AttractivenessModal';
import HobbyModal from '../../components/modal/HobbyModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [attractiveness, setAttractiveness] = useState([]);
  const [hobby, setHobby] = useState([]);

  const hashtagCount = attractiveness.length + hobby.length;
  const isDisabled =
    !selectedAnimal || !selectedMBTI || hashtagCount < 3 || hashtagCount > 5;

  const queryClient = useQueryClient();

  const { data: myData } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => instance.get('/member/profile').then((res) => res.data),
    staleTime: Infinity,
  });

  const mutation = useMutation({
    mutationFn: (data) => instance.patch('/member/profile/update', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      alert('회원정보 수정이 완료되었습니다.');
      navigate('/mypage');
    },
    onError: (error) => {
      console.error(error);
    },
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      department: department,
      mbti: selectedMBTI,
      memberCharacter: selectedAnimal,
      memberHobbyDto: hobby.map((value) => ({ hobby: value })),
      memberTagDto: attractiveness.map((value) => ({ tag: value })),
    };

    mutation.mutate(data);
  };

  const filterSelectedAttractiveness = (target) => {
    setAttractiveness((prev) => prev.filter((value) => value !== target));
  };

  const filterSelectedHobby = (target) => {
    setHobby((prev) => prev.filter((value) => value !== target));
  };

  useEffect(() => {
    if (myData) {
      setDepartment(myData.department);
      setSelectedAnimal(myData.memberCharacter);
      setSelectedMBTI(myData.mbti);
      setAttractiveness(myData.memberTagDto.map((value) => value.tag));
      setHobby(myData.memberHobbyDto.map((value) => value.hobby));
    }
  }, [myData]);

  return (
    <Wrapper>
      <WrapContent>
        <div>
          <HeaderPrev title="프로필 수정하기" navigateTo={-1} />
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
          <Label>해시태그 선택하기</Label>
          <Tip>최소 3개, 최대 5개까지 고를 수 있어요!</Tip>

          <br />
          <WrapSmallTitle>
            <div>저는 이런 매력이 있어요!</div>
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
          <br />
          <WrapSmallTitle>
            <div>저는 이런 취미가 있어요!</div>
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
          수정하기
        </Button>
      </WrapContent>
    </Wrapper>
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

const Wrapper = styled.div`
  max-height: 100vh;
  overflow-y: scroll;
`;

const Badge = styled.div`
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
  height: 96px;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  background-image: linear-gradient(180deg, #fff 0%, #f2f2f2 100%);
`;

const WrapContent = styled.div`
  display: grid;
  gap: 2rem;
  padding: 2rem;
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

const ProfileContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
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

export default ProfileEditPage;
