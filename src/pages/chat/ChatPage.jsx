import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { ClipLoader } from 'react-spinners';

import { instance } from '../../api/instance';
import { checkCurse } from '../../utils/checkCurse';
import useGroupedMessages from '../../hooks/useGroupedMessages';
import { getByteLength } from '../../utils/getByteLength';
import useDetectClose from '../../hooks/useDetectClose';
import useModal from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';

import Messages from '../../components/chat/Messages';
import MessageInput from '../../components/chat/MessageInput';
import Tooltip from '../../components/common/Tooltip';
import ReportModal from '../../components/modal/ReportModal';
import OpponentProfileModal from '../../components/modal/OpponentProfileModal';
import CallModal from '../../components/modal/CallModal';
import CallRequestModal from '../../components/modal/CallRequestModal';
import ImageView from '../../components/chat/ImageView';
import { useFetchDistance } from '../../hooks/useFetchDistance';
import CallActiveLottie from '../../components/chat/CallActiveLottie';

const ChatPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const roomId = parseInt(param?.chatRoomId);

  const distance = useFetchDistance(roomId);

  //리팩토링 중
  // ------------------------------------------

  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isShowLottie, setIsShowLottie] = useState(false);
  const [isOpponentOut, setIsOpponentOut] = useState(false);
  const [bothAgreed, setBothAgreed] = useState(false);
  const [opponentProfile, setOpponentProfile] = useState(null);
  const [isMemberIdsFetched, setIsMemberIdsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgSrc, setImageSrc] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openModal: openReportModal, closeModal: closeReportModal } = useModal(
    () => (
      <ReportModal
        closeModal={closeReportModal}
        onClick={handleReportUser}
        setIsMenuOpen={setIsMenuOpen}
      />
    )
  );

  const {
    openModal: openOpponentProfileModal,
    closeModal: closeOpponentProfileModal,
  } = useModal(() => (
    <OpponentProfileModal
      closeModal={closeOpponentProfileModal}
      opponentProfile={opponentProfile}
    />
  ));

  const { openModal: openCallModal, closeModal: closeCallModal } = useModal(
    () => (
      <CallModal closeModal={closeCallModal} onClick={fetchOpponentTelNum} />
    )
  );

  const { openModal: openCallRequestModal, closeModal: closeCallRequestModal } =
    useModal(() => (
      <CallRequestModal
        closeModal={closeCallRequestModal}
        onClick={requestCall}
      />
    ));

  // 토스트 에러메세지
  const { showToast: showBadWordToast } = useToast(
    () => <span>앗! 부적절한 단어가 포함되어 있어요.</span>,
    'bad-word'
  );
  const { showToast: showWaitToast } = useToast(
    () => <span>잠시 후 다시 시도해주세요!</span>,
    'wait'
  );
  const { showToast: showTelNumErrorToast } = useToast(
    () => <span>상대방의 전화번호를 가져오는데 실패했어요!</span>,
    'telnum-error'
  );
  const { showToast: showRoomInfoErrorToast } = useToast(
    () => <span>방 정보를 가져오는데 실패했어요!</span>,
    'telnum-error'
  );
  const { showToast: showTooMuchMessageToast } = useToast(
    () => <span>내용이 너무 많아요!</span>,
    'message-length-error'
  );

  const tooltipRef = useRef();
  const [isCallTooltipVisible, setIsCallTooltipVisible] = useDetectClose(
    tooltipRef,
    false
  );

  const viewportRef = useRef();

  const [myMemberId, setMyMemberId] = useState(0);
  const [opponentMemberId, setOpponentMemberId] = useState(0);

  const groupedMessages = useGroupedMessages(messages);

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
  const sendMessage = async () => {
    if (!draftMessage.trim() && !file) return;

    //욕설 필터링
    const isIncludingBadWord = checkCurse(draftMessage);
    if (isIncludingBadWord) {
      showBadWordToast();
      setDraftMessage('');
      return;
    }

    //이미지 전송
    if (file) {
      //S3 url 받기
      const formData = new FormData();
      formData.append('file', file);
      const response = await instance.post('/image', formData);

      //stomp 전송
      try {
        client.publish({
          destination: `/app/chat/${roomId}`,
          body: JSON.stringify({
            chatMessage: response.data.imageUrl,
            senderId: opponentMemberId,
            receiverId: myMemberId,
            publishType: 'USER',
          }),
        });

        setDraftMessage('');
        setFile(null);
      } catch (error) {
        showWaitToast();
      }
    } else {
      //stomp 전송
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
        setFile(null);
      } catch (error) {
        showWaitToast();
      }
    }
  };

  // 이미지 크게 보기
  const viewImage = (src) => {
    setImageSrc(src);
    setIsShowImage(true);
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
      showWaitToast();
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
      showWaitToast();
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
      showWaitToast();
    }
  };

  // 상대방 전화번호 가져온 뒤 전화 연결
  const fetchOpponentTelNum = async () => {
    try {
      const res = await instance.get(
        `/member/tel-num?memberId=${opponentMemberId}&chatRoomId=${roomId}`
      );
      window.location.href = `tel:${res.data.telNum}`;
    } catch (error) {
      showTelNumErrorToast();
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
      showRoomInfoErrorToast();
    }
  };

  const checkBothAgreed = async () => {
    try {
      const response = await instance.get(`/chatroom/both-agreed/${roomId}`);
      setBothAgreed(response.data);
    } catch (error) {
      showRoomInfoErrorToast();
    }
  };

  // 전화 버튼 클릭 시
  const handleClickCallButton = () => {
    bothAgreed ? openCallModal() : openCallRequestModal();
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

  // // 상대방 신고하기
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
  };

  // 자신/상대방의 memberId 불러오기
  useEffect(() => {
    const initializeChat = async () => {
      await fetchMemberIds();
      await checkBothAgreed();
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
      showTooMuchMessageToast();
      setDraftMessage(draftMessage.slice(0, -1));
    }
  }, [draftMessage]);

  return (
    <Wrapper>
      {isShowImage && (
        <ImageView imgSrc={imgSrc} handleCancel={() => setIsShowImage(false)} />
      )}
      {isShowLottie && <CallActiveLottie />}

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
              viewImage={viewImage}
              openProfileModal={openOpponentProfileModal}
              opponentMemberCharacter={
                opponentProfile && opponentProfile.memberCharacter
              }
              isMenuOpen={isMenuOpen}
            />
            <MessageInputWrapper>
              <MessageInput
                value={draftMessage}
                uploadedImage={uploadedImage}
                setUploadedImage={setUploadedImage}
                file={file}
                setFile={setFile}
                leaveButtonClickHandler={handleLeaveRoom}
                reportButtonClickHandler={openReportModal}
                changeHandler={handleChangeMessage}
                submitHandler={sendMessage}
                isOpponentOut={isOpponentOut}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            </MessageInputWrapper>
          </>
        )}
      </Container>
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
  z-index: 11;
`;

const TooltipMessage = styled.div`
  position: absolute;
  font-weight: 700;
  font-size: 10px;
  top: calc(100% + 14px);
  right: -10px;
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
  right: 0;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #333333;
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

const MessageInputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
`;

export default ChatPage;
