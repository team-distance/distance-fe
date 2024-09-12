import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import { instance } from '../../api/instance';
import { checkCurse } from '../../utils/checkCurse';
import useGroupedMessages from '../../hooks/useGroupedMessages';
import { getByteLength } from '../../utils/getByteLength';
import useModal from '../../hooks/useModal';
import { useToast } from '../../hooks/useToast';

import Messages from '../../components/chat/Messages';
import MessageInput from '../../components/chat/MessageInput';
import ReportModal from '../../components/modal/ReportModal';
import OpponentProfileModal from '../../components/modal/OpponentProfileModal';
import CallModal from '../../components/modal/CallModal';
import CallRequestModal from '../../components/modal/CallRequestModal';
import ImageView from '../../components/chat/ImageView';
import { useFetchDistance } from '../../hooks/useFetchDistance';
import CallActiveLottie from '../../components/chat/CallActiveLottie';
import { useCallActive } from '../../hooks/useCallActive';
import {
  useFetchMessagesFromLocal,
  useFetchMessagesFromServer,
  useFetchUnreadMessagesFromServer,
} from '../../hooks/useFetchMessages';
import TopBar from '../../components/chat/TopBar';
import Loader from '../../components/common/Loader';
import { useSendMessage } from '../../hooks/useSendMessage';
import CallDistanceModal from '../../components/modal/CallDistanceModal';
import { Client } from '@stomp/stompjs';

const ChatPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const roomId = parseInt(param?.chatRoomId);

  const distance = useFetchDistance(roomId);
  const [messages, setMessages] = useState([]);
  const fetchLocalMessages = useFetchMessagesFromLocal(roomId);
  const fetchServerMessages = useFetchMessagesFromServer(roomId);
  const fetchServerUnreadMessages = useFetchUnreadMessagesFromServer(roomId);
  const groupedMessages = useGroupedMessages(messages);
  const { isCallActive, isShowLottie, tiKiTaKaCount } = useCallActive(
    messages,
    roomId
  );
  const [client, setClient] = useState(null);
  const [myMemberId, setMyMemberId] = useState(0);
  const [opponentMemberId, setOpponentMemberId] = useState(0);
  const [draftMessage, setDraftMessage] = useState('');
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

  const {
    openModal: openCallDistanceModal,
    closeModal: closeCallDistanceModal,
  } = useModal(() => (
    <CallDistanceModal
      closeModal={closeCallDistanceModal}
      onClick={fetchOpponentTelNum}
      tikitakaCount={tiKiTaKaCount}
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

  // 메시지 전송
  const { sendImageMessage, sendTextMessage } = useSendMessage(
    draftMessage,
    setDraftMessage,
    setFile,
    file,
    client,
    roomId,
    opponentMemberId,
    myMemberId,
    showWaitToast
  );
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
      sendImageMessage();
    } else {
      //stomp 전송
      sendTextMessage();
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
      console.log('둘다동의>>>>>>>>>>>>', response.data);
      setBothAgreed(response.data);
    } catch (error) {
      showRoomInfoErrorToast();
    }
  };

  // 전화 버튼 클릭 시
  const handleClickCallButton = async () => {
    await checkBothAgreed();
    bothAgreed ? openCallModal() : openCallRequestModal();
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

  const subscritionCallback = (message) => {
    const parsedMessage = JSON.parse(message.body);

    // messages 새로 set
    setMessages((prevMessages) => {
      const oldMessages = [...prevMessages];
      // 가장 최근 메시지가 상대방이 보낸 메시지인 경우 이전 메시지들은 모두 읽음 처리
      if (parsedMessage.body.senderId !== oldMessages.at(-1)?.senderId) {
        for (let i = 0; i < oldMessages.length; i++) {
          oldMessages[i].unreadCount = 0;
        }
      }
      return [...oldMessages, parsedMessage.body];
    });
  };

  useEffect(() => {
    if (isMemberIdsFetched) {
      //상대방 프로필 불러오기
      fetchOpponentProfile();
      // STOMP 클라이언트 생성
      const newClient = new Client({
        brokerURL: 'wss://api.dis-tance.com/meet',
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

      newClient.activate();
      setClient(newClient);

      //이전 메세지 목록 불러오기
      const staleMessages = fetchLocalMessages(setMessages);
      if (staleMessages.length === 0) fetchServerMessages(setMessages);
      else fetchServerUnreadMessages(messages, setMessages);

      return () => {
        newClient.deactivate();
      };
    }
  }, [isMemberIdsFetched]);

  // 메시지가 업데이트 될 때마다 상대방이 나갔는지 확인
  // 메시지가 업데이트 될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    const lastMessage = messages.at(-1);

    if (lastMessage?.roomStatus === 'ACTIVE') setIsOpponentOut(false);
    else if (lastMessage?.roomStatus === 'INACTIVE') setIsOpponentOut(true);

    if (messages.length > 0) saveMessagesToLocal();
  }, [messages]);

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

      <Container>
        <TopBar
          distance={distance}
          isCallActive={isCallActive}
          openCallDistanceModal={openCallDistanceModal}
          handleClickCallButton={handleClickCallButton}
        />

        {isLoading ? (
          <Loader />
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

const MessageInputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 10;
`;

export default ChatPage;
