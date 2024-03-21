import React, { useEffect } from "react";
import styled from "styled-components";
import { useRef, useState } from "react";
import { authInstance } from "../../api/instance";

import Characters from "../../constants/character";
import Header from "../../components/common/Header";
import Profile from "../../components/home/Profile";
import Modal from "../../components/common/Modal";
import { useNavigate } from "react-router-dom";

const HomeIndexPage = () => {
  const [chatroomCreate, setChatroomCreate] = useState({
    memberId: "",
    roomName: "",
  });

  const [chatroomIdToEnter, setChatroomIdToEnter] = useState({
    myId: "",
    opponentId: "",
    chatRoomId: "",
  });

  const profileModal = useRef();
  const [selectedProfile, setSelectedProfile] = useState();
  const navigate = useNavigate();

  const memberId = localStorage.getItem("memberId");
  const [memberState, setMemberState] = useState([]);

  const content = () => {
    return (
      selectedProfile && (
        <WrapContent>
          <CharacterDiv>
            <StyledImage
              src={Characters[selectedProfile.memberInfoDto.memberCharacter]}
              alt={Characters[selectedProfile.memberInfoDto.memberCharacter]}
            />
          </CharacterDiv>
          <TextDiv>
            <div className="text-major">{selectedProfile.department}</div>
            <div className="text-mbti">
              {selectedProfile.memberInfoDto.mbti}
            </div>
            <div className="text-tags">
              {selectedProfile.memberInfoDto.memberHobbyDto.map(
                (tag, index) => (
                  <div key={index}>#{tag.hobby} </div>
                )
              )}
              {selectedProfile.memberInfoDto.memberTagDto.map((tag, index) => (
                <div key={index}>#{tag.tag} </div>
              ))}
            </div>
          </TextDiv>
        </WrapContent>
      )
    );
  };

  const handleChangeChatroom = (e) => {
    setChatroomCreate({
      ...chatroomCreate,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeChatroomId = (e) => {
    setChatroomIdToEnter({
      ...chatroomIdToEnter,
      [e.target.name]: e.target.value,
    });
  };

  const chatroomDisabled = chatroomCreate.memberId === "";

  const chatroomIdDisabled =
    chatroomIdToEnter.myId === "" ||
    chatroomIdToEnter.opponentId === "" ||
    chatroomIdToEnter.chatRoomId === "";

  useEffect(() => {
    console.log(memberState);
  }, [memberState]);

  const fetchGetMembers = async () => {
    try {
      const response = await authInstance.get(`/gps/matching`);
      const matchedUsers = response.data.matchedUsers;
      setMemberState(matchedUsers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchGetMembers();
  }, []);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    profileModal.current.open();
  };

  const handleCreateChatRoom = async (opponentMemberId) => {
    // 방이 성공적으로 생성된 경우
    // 이미 이사람과 생성된 방이 있는 경우
    // 내가 이미 3개의 방을 갖고 있는 경우
    // 상대방이 3개의 방을 갖고 있는 경우
    // 이외 에러 발생 시
    await authInstance
      .post("/chatroom/create", {
        memberId: opponentMemberId,
      })
      .then((res) => {
        const createdChatRoom = res.data;
        navigate(`chat/${createdChatRoom}`, {
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
            alert(
              "이미 생성된 채팅방 3개입니다. 기존 채팅방을 지우고 다시 시도해주세요."
            );
            break;
          case "TOO_MANY_OPPONENT_CHATROOM":
            alert(
              "상대방이 이미 생성된 채팅방 3개입니다. 상대방이 수락하면 알려드릴게요!"
            );
            break;
          default:
            alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
            break;
        }
      });
    profileModal.current.close();
  };

  /**
   * TEMP AREA
   */
  const createChatroom = async () => {
    await authInstance
      .post("/chatroom/create", {
        memberId: chatroomCreate.memberId,
      })
      .then((res) => alert(`${res.data}번 방이 성공적으로 생성되었습니다!`))
      .catch((error) => console.log(error));
  };

  const navigateChatroom = () => {
    navigate(`/chat/${chatroomIdToEnter.chatRoomId}`, {
      state: {
        myId: chatroomIdToEnter.myId,
        opponentId: chatroomIdToEnter.opponentId,
        roomId: chatroomIdToEnter.chatRoomId,
      },
    });
  };

  return (
    <>
      <Modal
        ref={profileModal}
        content={content()}
        buttonLabel="메세지 보내기"
        onCreateRoom={() => {
          handleCreateChatRoom(selectedProfile.memberId);
        }}
      />
      <HomeContainer>
        <Header />
        <div>
          <div style={{ fontWeight: "900" }}>/api/chatroom/create</div>
          <label htmlFor="memberId">memberId</label>
          <input
            style={{ width: "40px" }}
            id="memberId"
            name="memberId"
            onChange={handleChangeChatroom}
            type="number"
          />
          <label htmlFor="roomName">roomName</label>
          <input
            style={{ width: "40px" }}
            id="roomName"
            name="roomName"
            onChange={handleChangeChatroom}
            type="text"
          />
          <button onClick={createChatroom} disabled={chatroomDisabled}>
            채팅방 생성
          </button>
        </div>

        <br />

        <div style={{ fontWeight: "900" }}>채팅방 입장하기</div>
        <label htmlFor="myId">내ID</label>
        <input
          style={{ width: "40px" }}
          id="myId"
          name="myId"
          onChange={handleChangeChatroomId}
          type="number"
        />
        <label htmlFor="opponentId">상대ID</label>
        <input
          style={{ width: "40px" }}
          id="opponentId"
          name="opponentId"
          onChange={handleChangeChatroomId}
          type="number"
        />
        <label htmlFor="chatRoomId">chatRoomId</label>
        <input
          style={{ width: "40px" }}
          id="chatRoomId"
          name="chatRoomId"
          onChange={handleChangeChatroomId}
          type="number"
        />
        <button onClick={navigateChatroom} disabled={chatroomIdDisabled}>
          {chatroomIdToEnter.chatRoomId && chatroomIdToEnter.chatRoomId + "번"}{" "}
          채팅방 입장
        </button>

        <br />

        <ProfileContainer>
          {memberState.map((profile, index) => (
            <Profile
              key={index}
              id={profile.memberId}
              side={index % 2 === 0 ? "left" : "right"}
              profile={profile}
              onClick={() => handleSelectProfile(profile)}
            />
          ))}
        </ProfileContainer>
        <ReloadButton
          src="/assets/home/reload-button.png"
          alt="Reload button"
          onClick={fetchGetMembers}
        />
      </HomeContainer>
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

const ReloadButton = styled.img`
  position: fixed;
  right: 1.5rem;
  bottom: 4.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 2px 8px 0px #33333366;
`;

const WrapContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const CharacterDiv = styled.div`
  width: 50%;
  display: flex;
  margin: 0 auto;
  padding-bottom: 1rem;
`;

const StyledImage = styled.img`
  width: 100%;
`;

const TextDiv = styled.div`
  width: 100%;
  text-align: center;
  color: #333333;

  .text-major {
    font-size: 1.4rem;
    font-weight: 700;
    white-space: nowrap;
  }
  .text-mbti {
    font-size: 1.2rem;
    font-weight: 400;
  }
  .text-tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.2rem;
    font-size: 1rem;
    font-weight: 400;
    margin: 1.5rem auto;
  }
`;

export default HomeIndexPage;
