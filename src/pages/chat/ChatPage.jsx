import React, { useEffect, useRef, useState } from "react";
import Messages from "../../components/chat/Messages";
import MessageInput from "../../components/chat/MessageInput";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { instance } from "../../api/instance";
import toast, { Toaster } from "react-hot-toast";
import BlankModal from "../../components/common/BlankModal";
import TextInput from "../../components/register/TextInput";
import { checkCurse } from "../../utils/checkCurse";
import Lottie from "react-lottie-player";
import callAnimation from "../../lottie/call-animation.json";
import useGroupedMessages from "../../hooks/useGroupedMessages";

const ChatPage = () => {
  const [distance, setDistance] = useState(-1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isShowLottie, setIsShowLottie] = useState(false);
  const [isOpponentOut, setIsOpponentOut] = useState(false);
  const [opponentTelNum, setOpponentTelNum] = useState("");
  const [reportMessage, setReportMessage] = useState("");

  const reportModalRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const myId = location.state.myId;
  const opponentId = location.state.opponentId;
  const roomId = location.state.roomId;

  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const groupedMessages = useGroupedMessages(messages);

  const viewportRef = useRef();

  // 문자열의 바이트 길이를 구하는 함수
  const getByteLength = (s) => {
    let b = 0,
      i = 0;
    while (i < s.length) {
      const codePoint = s.codePointAt(i);
      if (codePoint <= 0x7f) {
        b += 1;
      } else if (codePoint <= 0x7ff) {
        b += 2;
      } else if (codePoint <= 0xffff) {
        b += 3;
      } else if (codePoint <= 0x10ffff) {
        b += 4;
        i++; // 이모지 같은 서로게이트 쌍의 경우 다음 코드 유닛을 건너뜀
      }
      i++;
    }
    return b;
  };

  // 메시지 길이 제한
  useEffect(() => {
    if (getByteLength(draftMessage) > 200) {
      toast.error("내용이 너무 많아요!", {
        id: "message-length-error",
      });
      setDraftMessage(draftMessage.slice(0, -1));
    }
  }, [draftMessage]);

  const openReportModal = () => {
    reportModalRef.current.open();
  };

  const closeReportModal = () => {
    setReportMessage("");
    reportModalRef.current.close();
  };

  const navigateToVerify = () => {
    navigate("/verify/univ");
  };

  const navigateToBack = () => {
    navigate("/chat");
  };

  const handleReportUser = async (e) => {
    e.preventDefault();

    await instance
      .post("/report", {
        declareContent: reportMessage,
        opponentId,
      })
      .then((res) => {
        alert("신고가 완료되었어요!");
      })
      .catch((error) => {
        console.log(error);
        alert("이미 신고한 사용자예요! 신고는 한 번만 가능해요.");
      });

    closeReportModal();
  };

  useEffect(() => {
    const fetchDistance = async () => {
      const distance = await instance
        .get(`/gps/distance?id1=${myId}&id2=${opponentId}`)
        .then((res) => res.data);

      const parseDistance = parseInt(distance);
      setDistance(parseDistance);
    };
    fetchDistance();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const newClient = new Client({
      brokerURL: "wss://api.dis-tance.com/meet",
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
        chatRoomId: roomId,
        memberId: myId,
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: (frame) => {
        console.log("Connected: " + frame);

        newClient.subscribe(`/topic/chatroom/${roomId}`, (message) => {
          const parsedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => {
            let lastIndexChange = -1;
            const oldMessages = [...prevMessages];
            for (let i = oldMessages.length - 2; i >= 0; i--) {
              if (oldMessages[i].senderId !== oldMessages[i + 1].senderId) {
                lastIndexChange = i;
                break;
              }
            }
            if (lastIndexChange !== -1) {
              for (let i = 0; i <= lastIndexChange; i++) {
                oldMessages[i].unreadCount = 0;
              }
            }
            return [...oldMessages, parsedMessage.body];
          });
        });
      },

      reconnectDelay: 100,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    const fetchMessages = () => {
      const staleMessages = localStorage.getItem("staleMessages");
      console.log("staleMessages", staleMessages);
      if (staleMessages) {
        const parsedStaleMessages = JSON.parse(staleMessages);
        if (parsedStaleMessages[roomId]) {
          setMessages(JSON.parse(parsedStaleMessages[roomId]));
        }
      }
    };

    fetchMessages();

    const fetchUnreadMessages = async () => {
      try {
        const msg = await instance
          .get(`/chatroom/${roomId}`)
          .then((res) => res.data);

        if (msg.length === 0) return;
        setMessages((messages) => [...messages, ...msg]);
      } catch (error) {
        //401에러
        window.confirm("학생 인증 후 이용해주세요.")
          ? navigateToVerify()
          : navigateToBack();
      }
    };

    fetchUnreadMessages();

    newClient.activate();
    setClient(newClient);

    return () => {
      newClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (
      messages.at(-1)?.checkTiKiTaKa &&
      messages.at(-1).roomStatus === "ACTIVE"
    ) {
      setIsCallActive(true);
    }
    else {
      setIsCallActive(false);
      setIsOpponentOut(true);
    }
  }, [messages]);

  const fetchOpponentTelNum = async () => {
    if (opponentTelNum !== "") return;
    const telNum = await instance
      .get(`/member/tel-num/${opponentId}`)
      .then((res) => res.data.telNum);
    setOpponentTelNum(telNum);
  };

  const handleChange = (e) => {
    setDraftMessage(e.target.value);
  };

  const handleLeaveRoom = async (e) => {
    e.preventDefault();
    const res = window.confirm("정말로 나가시겠습니까?");
    if (!res) return;

    client.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({
        chatMessage: "LEAVE",
        senderId: opponentId,
        receiverId: myId,
        publishType: "LEAVE",
      }),
    });

    // const localStorageChat = JSON.parse(localStorage.getItem("staleMessages"));
    // delete localStorageChat[roomId];
    // localStorage.setItem("staleMessages", JSON.stringify(localStorageChat));

    navigate(-1);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    // 메시지가 비어있으면 전송하지 않음
    if (!draftMessage.trim()) return;

    // 욕 있는지 검사
    const isIncludingBadWord = checkCurse(draftMessage);

    if (isIncludingBadWord) {
      toast.error("앗! 부적절한 단어가 포함되어 있어요.");
      setDraftMessage("");
      return;
    }

    client.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify({
        chatMessage: draftMessage,
        senderId: opponentId,
        receiverId: myId,
        publishType: "MESSAGE",
      }),
    });
    setDraftMessage("");
  };

  useEffect(() => {
    if (isCallActive) {
      fetchOpponentTelNum();
    }
  }, [isCallActive]);

  useEffect(() => {
    console.log(messages);
    const saveMessages = () => {
      const staleMessages =
        JSON.parse(localStorage.getItem("staleMessages")) || {};
      staleMessages[roomId] = JSON.stringify(messages); // Save the current state of messages for this room
      localStorage.setItem("staleMessages", JSON.stringify(staleMessages));
    };

    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  useEffect(() => {
    const callEffectShown =
      JSON.parse(localStorage.getItem("callEffectShown")) || [];
    if (!callEffectShown.includes(roomId)) {
      if (isCallActive) {
        const newArray = [...callEffectShown];
        newArray.push(roomId);
        localStorage.setItem("callEffectShown", JSON.stringify(newArray));
        setIsShowLottie(true);
        setTimeout(() => {
          setIsShowLottie(false);
        }, 4000);
      }
    }
  }, [isCallActive]);

  return (
    <Wrapper>
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: 104,
        }}
      />
      {isShowLottie && (
        <LottieContainer>
          <div>
            <Lottie
              animationData={callAnimation}
              play
              style={{ width: 200, height: 200 }}
              loop={false}
            />
          </div>
          <p>
            <strong>전화 버튼이 활성화되었어요!</strong> <br />
            채팅 상대와 전화를 연결해보세요
          </p>
        </LottieContainer>
      )}

      <Container ref={viewportRef}>
        <TopBar>
          <BackButton
            onClick={() => {
              navigate(-1);
            }}>
            <img
              src="/assets/arrow-pink-button.png"
              alt="뒤로가기"
              width={12}
            />
          </BackButton>
          <WrapTitle>
            <div className="title">상대방과의 거리</div>
            <div className="subtitle">
              {distance === -1 ? "불러오는 중..." : `${distance}m`}
            </div>
          </WrapTitle>
          <div>
            <CallButton>
              {isCallActive ? (
                <a href={`tel:${opponentTelNum}`}>
                  <img src="/assets/callicon-active.png" alt="전화버튼" />
                </a>
              ) : (
                <img src="/assets/callicon.png" alt="전화버튼" />
              )}
            </CallButton>
            <LeaveButton onClick={handleLeaveRoom}>
              <img src="/assets/leave-button.png" alt="나가기 버튼" />
            </LeaveButton>
          </div>
        </TopBar>

        <Messages groupedMessages={groupedMessages} myId={myId} />
        <MessageInput
          value={draftMessage}
          buttonClickHandler={openReportModal}
          changeHandler={handleChange}
          submitHandler={sendMessage}
          isOpponentOut={isOpponentOut}
        />
      </Container>

      <BlankModal ref={reportModalRef}>
        <ModalContent>
          <TextInput
            label="사용자 신고하기"
            placeholder="신고 내용을 입력해주세요."
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <ReportButton
              disabled={reportMessage === ""}
              onClick={handleReportUser}>
              신고하기
            </ReportButton>
            <CancelButton onClick={closeReportModal}>취소하기</CancelButton>
          </div>
        </ModalContent>
      </BlankModal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  touch-action: none;
  overflow: hidden;
`;

const Container = styled.div`
  height: 100dvh;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: height 0.3s;
`;

const BackButton = styled.button`
  background: none;
  border: none;
`;

const CallButton = styled.button`
  background: none;
  border: none;
`;

const LeaveButton = styled.button`
  background: none;
  border: none;
`;

const WrapTitle = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  > .title {
    font-size: 1rem;
  }

  > .subtitle {
    font-size: 0.8rem;
    color: #979797;
  }
`;

const TopBar = styled.div`
  position: relative;
  background: #ffffff;
  padding: 0.75rem 1rem;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalContent = styled.div`
  display: grid;
  gap: 1rem;
  width: 250px;
  padding: 1.25rem;
`;

const ReportButton = styled.button`
  background: none;
  border: none;
  color: #ff625d;

  &:disabled {
    color: #e0e0e0;
  }
`;

const CancelButton = styled.button`
  background: none;
  border: none;
`;

const LottieContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  div {
    transform: rotate(20deg) translateX(10px);
  }
  p {
    color: white;
    text-align: center;
    font-size: 0.8rem;
    strong {
      font-size: 1rem;
    }
  }
`;
export default ChatPage;
