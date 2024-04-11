import React, { useEffect } from "react";
import styled from "styled-components";
import { useRef, useState } from "react";
import { authInstance, defaultInstance } from "../../api/instance";
import ClipLoader from "react-spinners/ClipLoader";

import { CHARACTERS, COLORS } from "../../constants/character";
import Header from "../../components/common/Header";
import Profile from "../../components/home/Profile";
import Modal from "../../components/common/Modal";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedInState } from "../../store/auth";
import toast from "react-hot-toast";
import Badge from "../../components/common/Badge";
import { onGetToken, registerServiceWorker } from "../../firebaseConfig";
import { isSupported } from "firebase/messaging";

const HomeIndexPage = () => {
  const profileModal = useRef();
  const [selectedProfile, setSelectedProfile] = useState();
  const isLoggedIn = useRecoilState(isLoggedInState);
  const navigate = useNavigate();

  const memberId = localStorage.getItem("memberId");
  const [memberState, setMemberState] = useState([]);

  const [isReloadButtonDisabled, setIsReloadButtonDisabled] = useState(false);
  const [remainingTimeToReload, setRemainingTimeToReload] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMembersAuth = async () => {
    try {
      setLoading(true);
      const res = await authInstance.get("/gps/matching");
      setMemberState(res.data.matchedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await defaultInstance.get("/gps/matching");
      setMemberState(res.data.matchedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const reloadMembers = async () => {
    try {
      setLoading(true);
      setIsReloadButtonDisabled(true); // 버튼 비활성화
      setRemainingTimeToReload(3); // 초기 남은 시간 설정

      const res = await authInstance.get("/gps/matching");
      setMemberState(res.data.matchedUsers);

      // 매초마다 남은 시간 업데이트
      const intervalId = setInterval(() => {
        setRemainingTimeToReload((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId); // 남은 시간이 0이 되면 인터벌 정지
            setIsReloadButtonDisabled(false); // 버튼 활성화
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsReloadButtonDisabled(false); // 에러 발생 시 버튼 활성화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchMembersAuth();
    else fetchMembers();

    // 홈화면에서 Firebase 초기화
    // 카카오톡 브라우저에서는 Firebase Messaging을 지원하지 않기 때문에
    // 카카오톡 브라우저인지 확인 후 Firebase Messaging을 초기화
    const initializeFirebase = async () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const messaging = await isSupported();

      console.log("messaging", messaging);
      console.log("userAgent", userAgent);

      if (!userAgent.includes("kakao")) {
        registerServiceWorker();
        onGetToken();
      } else {
        navigate("/kakaotalk-fallback");
      }
    };

    initializeFirebase();
  }, []);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    profileModal.current.open();
  };

  const handleCreateChatRoom = async (opponentMemberId) => {
    await authInstance
      .post("/chatroom/create", {
        memberId: opponentMemberId,
      })
      .then((res) => {
        const createdChatRoom = res.data;
        navigate(`/chat/${createdChatRoom}`, {
          state: {
            myId: memberId,
            opponentId: opponentMemberId,
            roomId: createdChatRoom,
          },
        });
      })
      .catch((error) => {
        switch (error.response.data.code) {
          case "TOO_MANY_MY_CHATROOM":
            toast.error(
              "이미 생성된 채팅방 3개입니다. 기존 채팅방을 지우고 다시 시도해주세요."
            );
            break;
          case "TOO_MANY_OPPONENT_CHATROOM":
            toast.error(
              "상대방이 이미 생성된 채팅방 3개입니다. 상대방이 수락하면 알려드릴게요!"
            );
            break;
          default:
            toast.error("로그인 후 이용해주세요.");
            break;
        }
      });
    profileModal.current.close();
  };

  return (
    <>
      <HomeContainer>
        <Header />
        <ProfileContainer>
          {loading ? (
            <LoaderContainer>
              <ClipLoader color={"#FF625D"} loading={loading} size={50} />
            </LoaderContainer>
          ) : (
            memberState.map((profile, index) => (
              <Profile
                key={index}
                id={profile.memberId}
                profile={profile}
                onClick={() => handleSelectProfile(profile)}
              />
            ))
          )}
        </ProfileContainer>
        <ReloadButton onClick={reloadMembers} disabled={isReloadButtonDisabled}>
          {isReloadButtonDisabled && (
            <div className="time-remaining">{remainingTimeToReload}</div>
          )}
          <img src="/assets/home/reload-button.png" alt="Reload button" />
        </ReloadButton>
      </HomeContainer>

      <Modal
        ref={profileModal}
        buttonLabel="메세지 보내기"
        buttonClickHandler={() => {
          handleCreateChatRoom(selectedProfile.memberId);
        }}>
        {selectedProfile && (
          <WrapContent>
            <CharacterBackground
              $character={selectedProfile.memberInfoDto.memberCharacter}>
              <StyledImage
                src={CHARACTERS[selectedProfile.memberInfoDto.memberCharacter]}
                alt={selectedProfile.memberInfoDto.memberCharacter}
              />
            </CharacterBackground>
            <TextDiv>
              <MBTI>{selectedProfile.memberInfoDto.mbti}</MBTI>
              <Major>{selectedProfile.department}</Major>
            </TextDiv>
            <TagContainer>
              {selectedProfile.memberInfoDto.memberHobbyDto.map(
                (hobby, index) => (
                  <Badge key={index}>#{hobby.hobby}</Badge>
                )
              )}
              {selectedProfile.memberInfoDto.memberTagDto.map((tag, index) => (
                <Badge key={index}>#{tag.tag}</Badge>
              ))}
            </TagContainer>
          </WrapContent>
        )}
      </Modal>
    </>
  );
};

const HomeContainer = styled.section`
  padding: 2rem 1.5rem;
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const ReloadButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 7rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: #ffffff;
  box-shadow: 0px 4px 10px 0px #0000001a;
  transition: 0.3s;

  > .time-remaining {
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: 700;
    color: #000000;
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:disabled {
    filter: brightness(0.6);
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

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export default HomeIndexPage;
