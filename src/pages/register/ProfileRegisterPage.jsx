import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DropdownMBTI from "../../components/register/DropdownMBTI";
import AnimalSelector from "../../components/register/AnimalSelector";
import BlankModal from "../../components/common/BlankModal";
import Button from "../../components/common/Button";
import { ATTRACTIVENESS, HOBBY } from "../../constants/profile";
import { authInstance } from "../../api/instance";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { registerDataState } from "../../store/registerDataState";
import ProgressBar from "../../components/register/ProgressBar";

/**
 * @todo 코드 분리
 */
const ProfileRegisterPage = () => {
  const [registerData, setRegisterData] = useRecoilState(registerDataState);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [attractiveness, setAttractiveness] = useState([]);
  const [hobby, setHobby] = useState([]);
  const [hashtagCount, setHashtagCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setRegisterData((prev) => ({
      ...prev,
      memberCharacter: selectedAnimal,
      mbti: selectedMBTI,
      memberHobbyDto: hobby.map((value) => ({ hobby: value })),
      memberTagDto: attractiveness.map((value) => ({ tag: value })),
    }));
  }, [selectedAnimal, selectedMBTI, attractiveness, hobby]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await authInstance
      .post("/member/signup", {
        loginId: registerData.loginId,
        password: registerData.password,
        checkPassword: registerData.checkPassword,
        gender: registerData.gender,
        telNum: registerData.telNum,
        school: registerData.school,
        college: registerData.college,
        department: registerData.department,
        schoolEmail: registerData.schoolEmail,
        agreeTerms: registerData.agreeTerms,
        agreePrivacy: registerData.agreePrivacy,
        mbti: selectedMBTI,
        memberCharacter: selectedAnimal,
        memberHobbyDto: registerData.memberHobbyDto,
        memberTagDto: registerData.memberTagDto,
      })
      .then(() => {
        navigate("/register/done", {
          state: {
            loginId: registerData.loginId,
            password: registerData.password,
          },
        });
      })
      .catch((error) => {
        alert("회원정보 등록에 실패했습니다.");
      });
  };

  const attractivenessModalRef = useRef();
  const hobbyModalRef = useRef();

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

  const handleAnimalClick = (e) => {
    setSelectedAnimal(e.target.value);
  };

  const isDisabled =
    !selectedAnimal || !selectedMBTI || hashtagCount < 3 || hashtagCount > 5;

  useEffect(() => {
    setHashtagCount(attractiveness.length + hobby.length);
  }, [attractiveness, hobby]);

  return (
    <div>
      <WrapHeader>
        <ProgressBar progress={3} />
        <p>전화번호를 인증해주세요</p>
      </WrapHeader>

      <WrapContent>
        <h2>프로필을 등록해주세요</h2>
      </WrapContent>
      <AnimalSelector
        label="캐릭터 선택하기"
        clickHandler={handleAnimalClick}
      />

      <WrapContent>
        <div>
          <Label>MBTI 선택하기</Label>
          <DropdownMBTI setState={setSelectedMBTI} />
        </div>

        <div>
          <Label>해시태그 선택하기</Label>
          <Tip>최소 3개, 최대 5개까지 고를 수 있어요!</Tip>

          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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

          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                  color={attractiveness.includes(value) ? "#FF0000" : "black"}
                  onClick={() => {
                    if (attractiveness.includes(value) || hashtagCount >= 5)
                      return;
                    setAttractiveness([...attractiveness, value]);
                    closeAttractivenessModal();
                  }}>
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
                  color={hobby.includes(value) ? "#FF0000" : "black"}
                  onClick={() => {
                    if (hobby.includes(value) || hashtagCount >= 5) return;
                    setHobby([...hobby, value]);
                    closeHobbyModal();
                  }}>
                  {value}
                </ListItem>
              ))}
            </ListContainer>
          </BlankModal>
        </div>
        <Button disabled={isDisabled} onClick={handleSubmit} size="large">
          가입 완료하기
        </Button>
      </WrapContent>
    </div>
  );
};

const WrapHeader = styled.div`
  display: grid;
  padding: 4rem 2rem 0 2rem;
  
  p {
    font-size: 1.5rem;
    font-weight: 700;
  }
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
  box-shadow: 0 0 5px 1px #e0e0e0;
  margin: 1em 0;
  height: 96px;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
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

export default ProfileRegisterPage;
