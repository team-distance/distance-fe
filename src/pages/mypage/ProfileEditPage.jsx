import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DropdownMBTI from '../../components/register/DropdownMBTI';
import BlankModal from '../../components/common/BlankModal';
import { ATTRACTIVENESS, HOBBY } from '../../constants/profile';
import Button from '../../components/common/Button';
import HeaderPrev from '../../components/common/HeaderPrev';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { CHOOSE_CHARACTERS } from '../../constants/character';
import toast, { Toaster } from 'react-hot-toast';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedMBTI, setSelectedMBTI] = useState('');
  const [attractiveness, setAttractiveness] = useState([]);
  const [hobby, setHobby] = useState([]);
  const [hashtagCount, setHashtagCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await instance
      .patch('/member/profile/update', {
        department: department,
        mbti: selectedMBTI,
        memberCharacter: selectedAnimal,
        memberHobbyDto: hobby.map((value) => ({ hobby: value })),
        memberTagDto: attractiveness.map((value) => ({ tag: value })),
      })
      .then(() => {
        alert('회원정보 수정이 완료되었습니다.');
      })
      .then(() => {
        navigate('/mypage');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const characterModalRef = useRef();
  const attractivenessModalRef = useRef();
  const hobbyModalRef = useRef();

  const openCharacterModal = () => {
    characterModalRef.current.open();
  };

  const closeCharacterModal = () => {
    characterModalRef.current.close();
  };

  const openAttractivenessModal = () => {
    attractivenessModalRef.current.open();
  };

  const closeAttractivenessModal = () => {
    attractivenessModalRef.current.close();
  };

  const openHobbyModal = () => {
    hobbyModalRef.current.open();
  };

  const closeHobbyModal = () => {
    hobbyModalRef.current.close();
  };

  const handleClickAttractiveness = (e) => {
    setAttractiveness((prev) => {
      return prev.filter((value) => value !== e.target.innerText);
    });
  };

  const handleClickHobby = (e) => {
    setHobby((prev) => {
      return prev.filter((value) => value !== e.target.innerText);
    });
  };

  const isDisabled =
    !selectedAnimal || !selectedMBTI || hashtagCount < 3 || hashtagCount > 5;

  useEffect(() => {
    setHashtagCount(attractiveness.length + hobby.length);
  }, [attractiveness, hobby]);

  useEffect(() => {
    const fetchProfile = async () => {
      await instance
        .get('/member/profile')
        .then((response) => {
          setDepartment(response.data.department);
          setSelectedAnimal(response.data.memberCharacter);
          setSelectedMBTI(response.data.mbti);
          setAttractiveness(
            response.data.memberTagDto.map((value) => value.tag)
          );
          setHobby(response.data.memberHobbyDto.map((value) => value.hobby));
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchProfile();
  }, []);

  return (
    <Wrapper>
      <Toaster position="bottom-center" />
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
              <img
                src={CHOOSE_CHARACTERS[selectedAnimal]}
                alt="selected profile"
              />
            )}
            <img
              className="side-image-right"
              src="/assets/profile-register-rightimg.png"
              alt="profile register button"
            />
          </ProfileContainer>
        </div>

        <BlankModal ref={characterModalRef}>
          <ModalTitle>
            <div>캐릭터 선택하기</div>
            <img
              src="/assets/cancel-button.png"
              alt="닫기 버튼"
              onClick={closeCharacterModal}
            />
          </ModalTitle>
          <AnimalListContainer>
            {Object.entries(CHOOSE_CHARACTERS).map(([character, imageSrc]) => {
              return (
                <AnimalListItem
                  key={character}
                  onClick={() => {
                    setSelectedAnimal(character);
                    closeCharacterModal();
                  }}
                >
                  <img src={imageSrc} alt={character} />
                </AnimalListItem>
              );
            })}
          </AnimalListContainer>
        </BlankModal>

        <div>
          <Label>MBTI 선택하기</Label>
          <DropdownMBTI state={selectedMBTI} setState={setSelectedMBTI} />
        </div>

        <div>
          <Label>해시태그 선택하기</Label>
          <Tip>최소 3개, 최대 5개까지 고를 수 있어요!</Tip>

          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>저는 이런 매력이 있어요!</div>
            <AddButton onClick={openAttractivenessModal}>+ 추가하기</AddButton>
          </div>
          <BadgeContainer>
            {attractiveness.map((value, index) => (
              <Badge key={index} onClick={handleClickAttractiveness}>
                {value}
              </Badge>
            ))}
          </BadgeContainer>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>저는 이런 취미가 있어요!</div>
            <AddButton onClick={openHobbyModal}>+ 추가하기</AddButton>
          </div>
          <BadgeContainer>
            {hobby.map((value, index) => (
              <Badge key={index} onClick={handleClickHobby}>
                {value}
              </Badge>
            ))}
          </BadgeContainer>

          <BlankModal ref={attractivenessModalRef}>
            <ModalTitle>
              <div>본인의 매력을 선택해주세요.</div>
              <img
                src="/assets/cancel-button.png"
                alt="닫기 버튼"
                onClick={closeAttractivenessModal}
              />
            </ModalTitle>
            <ListContainer>
              {ATTRACTIVENESS.map((value, index) => (
                <ListItem
                  key={index}
                  color={attractiveness.includes(value) ? '#FF0000' : 'black'}
                  onClick={() => {
                    if (hashtagCount >= 5) {
                      toast.error('해시태그는 5개까지만 선택 가능해요!', {
                        id: 'hashtag-limit',
                      });
                      return;
                    } else if (attractiveness.includes(value)) {
                      toast.error('이미 선택한 해시태그에요!', {
                        id: 'hashtag-duplicate',
                      });
                      return;
                    }
                    setAttractiveness([...attractiveness, value]);
                    closeAttractivenessModal();
                  }}
                >
                  {value}
                </ListItem>
              ))}
            </ListContainer>
          </BlankModal>

          <BlankModal ref={hobbyModalRef}>
            <ModalTitle>
              <div>본인의 취미을 선택해주세요.</div>
              <img
                src="/assets/cancel-button.png"
                alt="닫기 버튼"
                onClick={closeHobbyModal}
              />
            </ModalTitle>
            <ListContainer>
              {HOBBY.map((value, index) => (
                <ListItem
                  key={index}
                  color={hobby.includes(value) ? '#FF0000' : 'black'}
                  onClick={() => {
                    if (hashtagCount >= 5) {
                      toast.error('해시태그는 5개까지만 선택 가능해요!', {
                        id: 'hashtag-limit',
                      });
                      return;
                    } else if (hobby.includes(value)) {
                      toast.error('이미 선택한 해시태그에요!', {
                        id: 'hashtag-duplicate',
                      });
                      return;
                    }
                    setHobby([...hobby, value]);
                    closeHobbyModal();
                  }}
                >
                  {value}
                </ListItem>
              ))}
            </ListContainer>
          </BlankModal>
        </div>
        <Button disabled={isDisabled} onClick={handleSubmit} size="large">
          수정하기
        </Button>
      </WrapContent>
    </Wrapper>
  );
};

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

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  background-color: #ff625d;
  justify-content: space-between;
  gap: 3rem;
  padding: 0.75rem 1.25rem;
  color: white;
`;

const ListContainer = styled.div`
  max-height: 256px;
  overflow: auto;
`;

const ListItem = styled.div`
  color: ${(props) => props.color};
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Tip = styled.div`
  color: #90949b;
  font-size: 12px;
  margin-top: -1em;
  font-weight: 600;
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

const AnimalListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
  overflow: auto;
  margin-top: 0.5rem;
  padding: 1rem 1.3rem;
`;

const AnimalListItem = styled.div`
  padding: 0.5rem 0.2rem;

  img {
    width: 3rem;
  }
`;

export default ProfileEditPage;
