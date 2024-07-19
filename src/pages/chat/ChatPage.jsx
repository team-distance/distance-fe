import React, { useEffect, useRef, useState } from 'react';
import Messages from '../../components/chat/Messages';
import MessageInput from '../../components/chat/MessageInput';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { instance } from '../../api/instance';
import toast, { Toaster } from 'react-hot-toast';
import { checkCurse } from '../../utils/checkCurse';
import Lottie from 'react-lottie-player';
import callAnimation from '../../lottie/call-animation.json';
import useGroupedMessages from '../../hooks/useGroupedMessages';
import Modal from '../../components/common/Modal';
import Tooltip from '../../components/common/Tooltip';
import { getByteLength } from '../../utils/getByteLength';
import useDetectClose from '../../hooks/useDetectClose';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../../components/common/Badge';
import { ClipLoader } from 'react-spinners';
import ReportModal from '../../components/modal/ReportModal';

const ChatPage = () => {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [distance, setDistance] = useState(-1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isShowLottie, setIsShowLottie] = useState(false);
  const [isOpponentOut, setIsOpponentOut] = useState(false);
  const [bothAgreed, setBothAgreed] = useState(false);
  const [opponentProfile, setOpponentProfile] = useState(null);
  const [isMemberIdsFetched, setIsMemberIdsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const param = useParams();

  const tooltipRef = useRef();
  const [isCallTooltipVisible, setIsCallTooltipVisible] = useDetectClose(
    tooltipRef,
    false
  );

  const profileModalRef = useRef();
  const reportModalRef = useRef();
  const callModalRef = useRef();
  const viewportRef = useRef();

  const navigate = useNavigate();

  const [myMemberId, setMyMemberId] = useState(0);
  const [opponentMemberId, setOpponentMemberId] = useState(0);
  const roomId = parseInt(param?.chatRoomId);

  const groupedMessages = useGroupedMessages(messages);

  const openReportModal = () => {
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const openCallModal = () => {
    callModalRef.current.open();
  };

  const closeCallModal = () => {
    callModalRef.current.close();
  };

  const openProfileModal = () => {
    profileModalRef.current.open();
  };

  const navigateToVerify = () => {
    navigate('/verify/univ');
  };

  const navigateToBack = () => {
    navigate('/chat');
  };

  const handleChangeMessage = (e) => {
    setDraftMessage(e.target.value);
  };

  // 로컬 스토리지에 메시지 저장
  const saveMessagesToLocal = () => {
    const staleMessages =
      JSON.parse(localStorage.getItem('staleMessages')) || {};
    staleMessages[roomId] = JSON.stringify(messages);
    localStorage.setItem('staleMessages', JSON.stringify(staleMessages));
  };

  // 로컬 스토리지에서 메시지 불러오기
  const fetchStaleMessagesFromLocal = () => {
    const staleMessages = localStorage.getItem('staleMessages');
    if (staleMessages) {
      const parsedStaleMessages = JSON.parse(staleMessages);
      if (parsedStaleMessages[roomId]) {
        const localMessages = JSON.parse(parsedStaleMessages[roomId]);
        setMessages(JSON.parse(parsedStaleMessages[roomId]));
        return localMessages;
      }
    }
    return [];
  };

  // 메시지 전송
  const sendMessage = (e) => {
    e.preventDefault();

    if (!draftMessage.trim()) return;
    const isIncludingBadWord = checkCurse(draftMessage);

    if (isIncludingBadWord) {
      toast.error('앗! 부적절한 단어가 포함되어 있어요.');
      setDraftMessage('');
      return;
    }

    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: draftMessage,
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'USER',
        }),
      });
      setDraftMessage('');
    } catch (error) {
      toast.error('잠시 후 다시 시도해주세요!');
    }
  };

  // 방 나가기
  const handleLeaveRoom = () => {
    const res = window.confirm('정말로 나가시겠습니까?');
    if (!res) return;

    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: 'LEAVE',
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'LEAVE',
        }),
      });

      if (localStorage.getItem('staleMessages') !== null) {
        const staleMessages = JSON.parse(localStorage.getItem('staleMessages'));
        delete staleMessages[roomId];
        localStorage.setItem('staleMessages', JSON.stringify(staleMessages));
      }

      navigate('/');
    } catch (error) {
      toast.error('잠시 후 다시 시도해주세요!');
    }
  };

  // 통화 요청 메시지 전송
  const requestCall = () => {
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: '통화를 요청하셨어요!',
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'CALL_REQUEST',
        }),
      });
    } catch (error) {
      toast.error('잠시 후 다시 시도해주세요!');
    }
  };

  // 통화 요청 수락 메시지 전송
  const responseCall = () => {
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: '통화 요청을 수락했어요!',
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'CALL_RESPONSE',
        }),
      });
    } catch (error) {
      toast.error('잠시 후 다시 시도해주세요!');
    }
  };

  // STOMP 메시지 수신 시 작동하는 콜백 함수
  const subscritionCallback = (message) => {
    const parsedMessage = JSON.parse(message.body);

    // 가장 최근 메시지가 상대방이 보낸 메시지인 경우 이전 메시지들은 모두 읽음 처리
    setMessages((prevMessages) => {
      const oldMessages = [...prevMessages];
      if (parsedMessage.body.senderId !== oldMessages.at(-1)?.senderId) {
        for (let i = 0; i < oldMessages.length; i++) {
          oldMessages[i].unreadCount = 0;
        }
      }
      return [...oldMessages, parsedMessage.body];
    });
  };

  const fetchMemberIds = async () => {
    try {
      const response = await instance.get(`/room-member/${roomId}`);
      const { memberId, opponentId } = response.data;
      setMyMemberId(memberId);
      setOpponentMemberId(opponentId);
      setIsMemberIdsFetched(true);
    } catch (error) {
      toast.error('방 정보를 가져오는데 실패했어요! ', {
        position: 'bottom-center',
      });
    }
  };

  // 전화 버튼 클릭 시
  const handleClickCallButton = async () => {
    try {
      const response = await instance.get(`/chatroom/both-agreed/${roomId}`);
      setBothAgreed(response.data);
    } catch (error) {
      toast.error('방 상태를 가져오는데 실패했어요!', {
        position: 'bottom-center',
      });
    }

    openCallModal();
  };

  // 서버에서 모든 메시지 불러오기
  const fetchAllMessagesFromServer = async () => {
    try {
      const msg = await instance.get(`/chatroom/${roomId}/allmessage`);
      if (msg.data.length === 0) return;
      setMessages(msg.data);
    } catch (error) {
      window.confirm('학생 인증 후 이용해주세요.')
        ? navigateToVerify()
        : navigateToBack();
    }
  };

  // 서버에서 읽지 않은 메시지 불러오기
  const fetchUnreadMessagesFromServer = async () => {
    try {
      const unreadMessages = await instance
        .get(`/chatroom/${roomId}`)
        .then((res) => res.data);
      if (unreadMessages.length === 0) return;

      // unreadMessages를 순회하며 messageId가 이미 messages에 있는지 확인하고 없으면 추가
      unreadMessages.forEach((unreadMessage) => {
        if (
          !messages.find(
            (message) => message.messageId === unreadMessage.messageId
          )
        ) {
          setMessages((messages) => [...messages, unreadMessage]);
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  // 신고하기
  const handleReportUser = async (reportMessage) => {
    try {
      await instance.post('/report', {
        declareContent: reportMessage,
        opponentId: opponentMemberId,
      });
      alert('신고가 완료되었어요!');
    } catch (error) {
      console.log(error);
      alert('이미 신고한 사용자예요! 신고는 한 번만 가능해요.');
    }
    closeReportModal();
  };

  // 거리 불러오기
  const fetchDistance = async () => {
    try {
      const distance = await instance.get(`/gps/distance/${roomId}`);
      const parseDistance = parseInt(distance.data.distance);
      setDistance(parseDistance);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 상대방 프로필 정보 불러오기
  const fetchOpponentProfile = async () => {
    try {
      const opponentProfile = await instance
        .get(`/member/profile/${opponentMemberId}`)
        .then((res) => res.data);
      setOpponentProfile(opponentProfile);
    } catch (error) {
      console.log('error', error);
    }
  };

  // 자신/상대방의 memberId 불러오기
  useEffect(() => {
    const initializeChat = async () => {
      await fetchMemberIds();
    };

    initializeChat();
  }, []);

  // STOMP 클라이언트 생성
  useEffect(() => {
    if (isMemberIdsFetched) {
      fetchOpponentProfile();

      const newClient = new Client({
        brokerURL: 'wss://dev.dis-tance.com/meet',
        connectHeaders: {
          chatRoomId: roomId,
          memberId: myMemberId,
        },
        debug: function (str) {
          console.log(str);
        },
        onConnect: (frame) => {
          setIsLoading(false);
          console.log('Connected: ' + frame);
          newClient.subscribe(`/topic/chatroom/${roomId}`, subscritionCallback);
        },
        onStompError: (error) => {
          console.log(error);
        },
        reconnectDelay: 50,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      const staleMessages = fetchStaleMessagesFromLocal();
      if (staleMessages.length === 0) fetchAllMessagesFromServer();
      else fetchUnreadMessagesFromServer();

      fetchDistance();

      newClient.activate();
      setClient(newClient);

      return () => {
        newClient.deactivate();
      };
    }
  }, [isMemberIdsFetched]);

  // 메시지가 업데이트 될 때마다 상대방이 나갔는지 확인
  // 메시지가 업데이트 될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    const lastMessage = messages.at(-1);
    console.log('lastMessage', lastMessage);

    if (lastMessage?.checkTiKiTaKa) setIsCallActive(true);
    else setIsCallActive(false);

    if (lastMessage?.roomStatus === 'ACTIVE') setIsOpponentOut(false);
    else if (lastMessage?.roomStatus === 'INACTIVE') setIsOpponentOut(true);

    if (messages.length > 0) saveMessagesToLocal();
  }, [messages]);

  // 전화 버튼 애니메이션
  useEffect(() => {
    const callEffectShown =
      JSON.parse(localStorage.getItem('callEffectShown')) || [];

    if (!callEffectShown.includes(roomId)) {
      if (isCallActive) {
        const newArray = [...callEffectShown];
        newArray.push(roomId);
        localStorage.setItem('callEffectShown', JSON.stringify(newArray));
        setIsShowLottie(true);
        setTimeout(() => {
          setIsShowLottie(false);
        }, 4000);
        setIsCallTooltipVisible(false);
      }
    }
  }, [isCallActive]);

  // 메시지 길이 제한
  useEffect(() => {
    if (getByteLength(draftMessage) > 200) {
      toast.error('내용이 너무 많아요!', {
        id: 'message-length-error',
      });
      setDraftMessage(draftMessage.slice(0, -1));
    }
  }, [draftMessage]);

  return (
    <Wrapper>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '14px',
          },
        }}
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
            }}
          >
            <img
              src="/assets/arrow-pink-button.png"
              alt="뒤로가기"
              width={12}
            />
          </BackButton>
          <WrapTitle>
            <div className="title">상대방과의 거리</div>
            <div className="subtitle">
              {distance === -1 ? (
                <>
                  <Tooltip message="두 명 모두 위치 정보를 공유해야 확인할 수 있어요!" />{' '}
                  <span>위치를 표시할 수 없습니다.</span>
                </>
              ) : (
                `${distance}m`
              )}
            </div>
          </WrapTitle>
          <div>
            <CallButton>
              {isCallActive ? (
                <div onClick={handleClickCallButton}>
                  <img src="/assets/callicon-active.svg" alt="전화버튼" />
                </div>
              ) : (
                <div
                  ref={tooltipRef}
                  onClick={() => setIsCallTooltipVisible(!isCallTooltipVisible)}
                  style={{ position: 'relative' }}
                >
                  <img src="/assets/callicon.svg" alt="전화버튼" />
                  {isCallTooltipVisible && (
                    <TooltipMessage>
                      <TooltipTail />
                      상대방과 더 대화해보세요!
                    </TooltipMessage>
                  )}
                </div>
              )}
            </CallButton>
            <LeaveButton onClick={handleLeaveRoom}>
              <img
                src="/assets/leave-button.svg"
                alt="나가기 버튼"
                width={21}
              />
            </LeaveButton>
          </div>
        </TopBar>

        {isLoading ? (
          <LoaderContainer>
            <ClipLoader color="#FF625D" size={50} />
          </LoaderContainer>
        ) : (
          <>
            <Messages
              groupedMessages={groupedMessages}
              myId={myMemberId}
              responseCall={responseCall}
              openProfileModal={openProfileModal}
              opponentMemberCharacter={
                opponentProfile && opponentProfile.memberCharacter
              }
            />

            <MessageInput
              value={draftMessage}
              buttonClickHandler={openReportModal}
              changeHandler={handleChangeMessage}
              submitHandler={sendMessage}
              isOpponentOut={isOpponentOut}
            />
          </>
        )}
      </Container>

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          opponentMemberId={opponentMemberId}
        />
      )}

      <Modal
        ref={callModalRef}
        buttonLabel={bothAgreed ? '통화하기' : '요청하기'}
        buttonClickHandler={
          bothAgreed
            ? async () => {
                try {
                  const res = await instance.get(
                    `/member/tel-num?memberId=${opponentMemberId}&chatRoomId=${roomId}`
                  );
                  window.location.href = `tel:${res.data.telNum}`;
                } catch (error) {
                  toast.error('상대방의 전화번호를 가져오는데 실패했어요!', {
                    position: 'bottom-center',
                  });
                  console.log(error);
                }
              }
            : () => {
                requestCall();
                closeCallModal();
              }
        }
      >
        <CallModalContent>
          {bothAgreed ? (
            <>
              <strong>🎉 이제 통화할 수 있어요!</strong>
              <div>아래 버튼을 눌러 통화해보세요.</div>
            </>
          ) : (
            <>
              <strong>📞 통화를 요청할까요?</strong>
              <div>
                상대방이 요청을 수락하면
                <br />
                서로의 번호로 통화할 수 있어요.
              </div>
            </>
          )}
        </CallModalContent>
      </Modal>
      <Modal ref={profileModalRef}>
        {opponentProfile && (
          <WrapContent>
            <CharacterBackground
              backgroundColor={
                CHARACTERS[opponentProfile.memberCharacter]?.color
              }
            >
              <StyledImage
                $xPos={CHARACTERS[opponentProfile.memberCharacter]?.position[0]}
                $yPos={CHARACTERS[opponentProfile.memberCharacter]?.position[1]}
              />
            </CharacterBackground>
            <TextDiv>
              <MBTI>{opponentProfile.mbti}</MBTI>
              <Major>{opponentProfile.department}</Major>
            </TextDiv>
            <TagContainer>
              {opponentProfile.memberHobbyDto.map((hobby, index) => (
                <Badge key={index}>#{hobby.hobby}</Badge>
              ))}
              {opponentProfile.memberTagDto.map((tag, index) => (
                <Badge key={index}>#{tag.tag}</Badge>
              ))}
            </TagContainer>
          </WrapContent>
        )}
      </Modal>
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
    line-height: 1.5;
  }

  > .subtitle {
    font-size: 0.8rem;
    color: #979797;
    line-height: 1.5;
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
  z-index: 1;
`;

const CancelButton = styled.button`
  background: none;
  border: none;
`;

const CallModalContent = styled.div`
  display: grid;
  gap: 1rem;
  padding: 32px 0;
  text-align: center;
  line-height: normal;

  strong {
    font-weight: 600;
  }
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

const TooltipMessage = styled.div`
  position: absolute;
  font-weight: 700;
  font-size: 10px;
  top: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 10px;
  background-color: #333333;
  color: #ffffff;
  white-space: nowrap;
  border-radius: 12px;
`;

const TooltipTail = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #333333;
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
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: ${(props) => props.backgroundColor};
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

const TextDiv = styled.div`
  width: 100%;
  text-align: center;
  color: #333333;
`;

const Major = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: normal;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
  line-height: normal;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
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

export default ChatPage;
