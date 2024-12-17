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
// import CallActiveLottie from '../../components/chat/CallActiveLottie';
import { useCallActive } from '../../hooks/useCallActive';
import {
  useCountPages,
  // useFetchMessagesPerPage,
} from '../../hooks/useFetchMessages';
import TopBar from '../../components/chat/TopBar';
import Loader from '../../components/common/Loader';
import { useSendMessage } from '../../hooks/useSendMessage';
import CallDistanceModal from '../../components/modal/CallDistanceModal';
import { Client } from '@stomp/stompjs';
import { stompBrokerURL } from '../../constants/baseURL';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SnowAnimation from '../../components/chat/SnowAnimation';
import ChristmasEventAnnouncementModal from '../../components/modal/ChristmasEventAnnouncementModal';

const ChatPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const roomId = parseInt(param?.chatRoomId);

  const distance = useFetchDistance(roomId);
  const [messages, setMessages] = useState([]);
  const groupedMessages = useGroupedMessages(messages);

  const queryClient = useQueryClient();

  const [lastProcessedMessageId, setLastProcessedMessageId] = useState(null);

  // 크리스마스 이벤트 동안 isCallActive 임시 제거
  const { isCallActive, tiKiTaKaCount } = useCallActive(messages, roomId);
  const [client, setClient] = useState(null);
  const [myMemberId, setMyMemberId] = useState(0);
  const [opponentMemberId, setOpponentMemberId] = useState(0);
  const [draftMessage, setDraftMessage] = useState('');
  const [isOpponentOut, setIsOpponentOut] = useState(false);
  const [bothAgreed, setBothAgreed] = useState(false);
  const [isMemberIdsFetched, setIsMemberIdsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isShowImage, setIsShowImage] = useState(false);
  const [imgSrc, setImageSrc] = useState('');

  const [isInputFocused, setIsInputFocused] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSend, setIsSend] = useState(false);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    loaded: 0,
    total: 0,
    progress: 0,
  });
  const [uploadingImagePreviewUrl, setUploadingImagePreviewUrl] = useState('');
  const [requestCancelController, setRequestCancelController] = useState(null);

  const [currentPage, setCurrentPage] = useState(-1);

  const fetchPagesNum = useCountPages(roomId);

  const { data: opponentProfile } = useQuery({
    queryKey: ['opponentProfile', { chatRoomId: roomId }],
    queryFn: () =>
      instance
        .get(`/member/profile/${opponentMemberId}`)
        .then((res) => res.data),
    enabled: isMemberIdsFetched,
    staleTime: 1000 * 60 * 10,
  });

  const {
    openModal: openChristmasEventAnnouncementModal,
    closeModal: closeChristmasEventAnnouncementModal,
  } = useModal(() => (
    <ChristmasEventAnnouncementModal
      closeModal={closeChristmasEventAnnouncementModal}
    />
  ));

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
    showWaitToast,
    setIsUploadingImage,
    setUploadProgress,
    uploadingImagePreviewUrl,
    setUploadingImagePreviewUrl,
    setRequestCancelController
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

  // 대화 도중 상대방이 탈퇴하면 메시지를 보냈을 때 채팅방을 나가도록 함
  // 대화중 상대방이 탈퇴했을 때 메시지를 보내면
  // 마지막 메시지에 "존재하지 않는 유저입니다!"라는 문자열이 채워짐
  // 이 문자열이 존재하면 채팅방을 나가도록 함
  useEffect(() => {
    const lastMessage = messages?.at(-1);

    if (typeof lastMessage === 'string') {
      navigate('/chat');
    }
  }, [messages]);

  // 방 나가기
  const handleLeaveRoom = () => {
    const res = window.confirm('정말로 나가시겠습니까?');
    if (!res) return;

    // 현재 roomId에 해당하는 로컬 저장소 항목 모두 삭제
    Object.keys(localStorage).forEach((key) => {
      if (key.includes(`"messages",${roomId},`)) {
        localStorage.removeItem(key);
      }
    });

    // 이 방을 나가면 여기서 추가한 chatroomid, tikitakacount 삭제
    // 크리스마스 이벤트 이후 삭제
    const clickedNewQuestionList =
      JSON.parse(localStorage.getItem('clickedNewQuestionList')) || [];
    const filteredClickedNewQuestionList = clickedNewQuestionList.filter(
      (item) => item.chatRoomId !== roomId
    );
    localStorage.setItem(
      'clickedNewQuestionList',
      JSON.stringify(filteredClickedNewQuestionList)
    );

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
      navigate('/chat');
    }
  };

  const checkBothAgreed = async () => {
    try {
      const response = await instance.get(`/chatroom/both-agreed/${roomId}`);
      setBothAgreed(response.data);
      return response.data;
    } catch (error) {
      showRoomInfoErrorToast();
      return false;
    }
  };

  // 전화 버튼 클릭 시
  const handleClickCallButton = async () => {
    const bothAgreed = await checkBothAgreed();
    bothAgreed ? openCallModal() : openCallRequestModal();
  };

  // 상대방 신고하기
  const handleReportUser = async (reportMessage) => {
    try {
      await instance.post('/report', {
        reportContent: reportMessage,
        opponentId: opponentMemberId,
      });
      alert('신고가 완료되었어요!');
    } catch (error) {
      console.log(error);
      alert('이미 신고한 사용자예요! 신고는 한 번만 가능해요.');
    }
  };

  const subscritionCallback = (message) => {
    const parsedMessage = JSON.parse(message.body);
    const { senderId, senderType } = parsedMessage.body;

    if (senderType === 'COME' && senderId === myMemberId) {
      // COME 메시지를 보낸 사람이 '나'인 경우
      return;
    } else if (senderType === 'COME' && senderId !== myMemberId) {
      // COME 메시지를 보낸 사람이 '상대방'인 경우
      setMessages((prevMessages) => {
        const oldMessages = [...prevMessages];
        oldMessages.forEach((message) => {
          message.unreadCount = 0;
        });
        return oldMessages;
      });
      return;
    } else if (senderType === 'ANSWER' && senderId !== myMemberId) {
      // ANSWER 메시지를 보낸 사람이 '상대방'인 경우
      const questionId = parsedMessage.body.questionId;
      queryClient.invalidateQueries(['answer', questionId]);
      return;
    } else {
      // 그 외의 메시지인 경우
      setMessages((prevMessages) => {
        const oldMessages = [...prevMessages];
        // 가장 최근 메시지가 상대방이 보낸 메시지인 경우 이전 메시지들은 모두 읽음 처리
        if (senderId !== oldMessages.at(-1)?.senderId) {
          oldMessages.forEach((message) => {
            message.unreadCount = 0;
          });
        }
        return [...oldMessages, parsedMessage.body];
      });

      return;
    }
  };

  // 자신/상대방의 memberId 불러오기
  useEffect(() => {
    const initializeChat = async () => {
      await fetchMemberIds();
      await checkBothAgreed();
    };

    initializeChat();

    // 크리스마스 이벤트 안내 모달 관련 코드
    // 크리스마스 이벤트 이후 아래 코드 제거
    const dismissedList =
      JSON.parse(localStorage.getItem('dismissForever')) || [];

    const isDismissed = dismissedList.some(
      (item) =>
        item.name === 'christmasEventAnnouncement' && item.type === 'modal'
    );

    if (!isDismissed) {
      openChristmasEventAnnouncementModal();
    }
  }, []);

  useEffect(() => {
    if (isMemberIdsFetched) {
      // STOMP 클라이언트 생성
      const newClient = new Client({
        brokerURL: stompBrokerURL,
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

          // STOMP 연결이 완료되면 채팅방 입장 메시지 전송
          newClient.publish({
            destination: `/app/chat/${roomId}`,
            body: JSON.stringify({
              chatMessage: '',
              senderId: myMemberId,
              receiverId: opponentMemberId,
              publishType: 'COME',
            }),
          });
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

      // 페이지 수 가져오기
      fetchPagesNum(setCurrentPage);

      return () => {
        newClient.deactivate();
      };
    }
  }, [isMemberIdsFetched]);

  const sendNewQuestionMessage = (questionId) => {
    try {
      client.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify({
          chatMessage: JSON.stringify({
            message: '새로운 질문이 도착했어요!',
            chatRoomId: roomId,
            tikiTakaCount: messages.at(-1).checkTiKiTaKa,
            questionId: questionId,
          }),
          senderId: opponentMemberId,
          receiverId: myMemberId,
          publishType: 'NEW_QUESTION',
        }),
      });
    } catch (error) {
      showWaitToast();
    }
  };

  const createNewQuestion = async () => {
    try {
      const response = await instance.post('/question', {
        chatRoomId: roomId,
        tikiTakaCount: messages.at(-1).checkTiKiTaKa,
      });

      // 이전에 같은 questionId로 NEW_QUESTION 메시지를 보낸 적이 없을 때만 메시지 전송
      if (
        !messages.find(
          (message) =>
            message.senderType === 'NEW_QUESTION' &&
            JSON.parse(message.chatMessage).questionId ===
              response.data.questionId
        )
      ) {
        sendNewQuestionMessage(response.data.questionId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 메시지가 업데이트 될 때마다 상대방이 나갔는지 확인
  // 메시지가 업데이트 될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    const lastMessage = messages.at(-1);

    if (lastMessage?.roomStatus === 'ACTIVE') setIsOpponentOut(false);
    else if (lastMessage?.roomStatus === 'INACTIVE') setIsOpponentOut(true);

    console.log(messages);

    if (
      lastMessage &&
      lastMessage?.messageId !== lastProcessedMessageId &&
      lastMessage?.checkTiKiTaKa !== 0 &&
      lastMessage?.checkTiKiTaKa % 3 === 0 &&
      lastMessage?.senderType !== 'NEW_QUESTION' &&
      lastMessage?.senderId === opponentMemberId
    ) {
      setLastProcessedMessageId(lastMessage.messageId);
      createNewQuestion();
    }
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

      {/* 크리스마스 이벤트 이후 주석 해제 */}
      {/* {isShowLottie && <CallActiveLottie />} */}

      <Container>
        <TopBar
          distance={distance}
          isCallActive={isCallActive}
          openCallDistanceModal={openCallDistanceModal}
          handleClickCallButton={handleClickCallButton}
          opponentProfile={opponentProfile}
          roomId={roomId}
          leaveButtonClickHandler={handleLeaveRoom}
        />

        <SnowAnimationWrapper>
          <SnowAnimation />
        </SnowAnimationWrapper>

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
              isUploadingImage={isUploadingImage}
              uploadProgress={uploadProgress}
              uploadingImagePreviewUrl={uploadingImagePreviewUrl}
              requestCancelController={requestCancelController}
              setIsSend={setIsSend}
              isSend={isSend}
              roomId={roomId}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setMessages={setMessages}
              isInputFocused={isInputFocused}
              bothAgreed={bothAgreed}
              client={client}
            />
            <MessageInputWrapper>
              <MessageInput
                value={draftMessage}
                file={file}
                setFile={setFile}
                reportButtonClickHandler={openReportModal}
                changeHandler={handleChangeMessage}
                submitHandler={sendMessage}
                isOpponentOut={isOpponentOut}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                setIsSend={setIsSend}
                setIsInputFocused={setIsInputFocused}
              />
            </MessageInputWrapper>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  touch-action: none;
  overflow: hidden;
`;

const SnowAnimationWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* TopBar 뒤로 이동 */
  pointer-events: none; /* 클릭 이벤트 차단 */
`;

const Container = styled.div`
  height: 100%;
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
