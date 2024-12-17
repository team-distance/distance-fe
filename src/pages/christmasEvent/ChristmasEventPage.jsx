import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ORNAMENT_DATA } from '../../constants/ORNAMENT_DATA';
import { instance } from '../../api/instance';
import QueryAnswerModal from '../../components/modal/QueryAnswerModal';
import useModal from '../../hooks/useModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client } from '@stomp/stompjs';
import { stompBrokerURL } from '../../constants/baseURL';

const ChristmasEventPage = () => {
  const param = useParams();
  const chatRoomId = parseInt(param?.chatRoomId);

  const queryClient = useQueryClient();

  const [client, setClient] = useState(null);
  const [myMemberId, setMyMemberId] = useState(0);
  const [isMemberIdsFetched, setIsMemberIdsFetched] = useState(false);

  const opponentProfile = useLocation().state?.opponentProfile;
  const navigate = useNavigate();

  const { data: myProfile } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => instance.get('/member/profile').then((res) => res.data),
    staleTime: Infinity,
  });

  const { data: questions } = useQuery({
    queryKey: ['question', chatRoomId],
    queryFn: () =>
      instance.get(`/question/${chatRoomId}`).then((res) => res.data),
  });

  const displayedQuestions = questions?.slice(0, 10);

  const questionsLeft = questions?.reduce(
    (acc, question) => acc - question.isAnswer,
    10
  );

  const treeRef = useRef(null);
  const [treeRect, setTreeRect] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
  });

  if (!opponentProfile) {
    navigate(`/chat/${chatRoomId}`);
  }

  const { openModal: openQueryAnswerModal, closeModal: closeQueryAnswerModal } =
    useModal((questionId) => (
      <QueryAnswerModal
        questionId={questionId}
        myProfile={myProfile}
        opponentProfile={opponentProfile}
        closeModal={closeQueryAnswerModal}
        chatRoomId={chatRoomId}
        client={client}
      />
    ));

  const updateTreeRect = () => {
    const img = treeRef.current;
    if (!img) return;

    // 실제 렌더링된 이미지의 크기와 위치를 계산
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    const containerWidth = img.offsetWidth;
    const containerHeight = img.offsetHeight;
    const containerRatio = containerWidth / containerHeight;

    let renderWidth, renderHeight;
    if (containerRatio > naturalRatio) {
      renderHeight = containerHeight;
      renderWidth = renderHeight * naturalRatio;
    } else {
      renderWidth = containerWidth;
      renderHeight = renderWidth / naturalRatio;
    }

    const left = (containerWidth - renderWidth) / 2;
    const top = (containerHeight - renderHeight) / 2;

    setTreeRect({
      width: renderWidth,
      height: renderHeight,
      left,
      top,
    });
  };

  const fetchMemberIds = async () => {
    try {
      const response = await instance.get(`/room-member/${chatRoomId}`);
      const { memberId } = response.data;
      setMyMemberId(memberId);
      setIsMemberIdsFetched(true);
    } catch (error) {
      navigate('/chat');
    }
  };

  useEffect(() => {
    const img = treeRef.current;

    if (img && img.complete) {
      updateTreeRect();
    } else if (img) {
      img.onload = updateTreeRect;
    }

    window.addEventListener('resize', updateTreeRect);
    return () => window.removeEventListener('resize', updateTreeRect);
  }, []);

  useEffect(() => {
    fetchMemberIds();
  }, []);

  const subscriptionCallback = (message) => {
    const parsedMessage = JSON.parse(message.body);
    const { senderId, senderType } = parsedMessage.body;

    if (senderType === 'ANSWER' && senderId === myMemberId) {
      queryClient.invalidateQueries(['question', chatRoomId]);
    }
  };

  useEffect(() => {
    if (isMemberIdsFetched) {
      const newClient = new Client({
        brokerURL: stompBrokerURL,
        connectHeaders: {
          chatRoomId: chatRoomId,
          memberId: myMemberId,
        },
        debug: function (str) {
          console.log(str);
        },
        onConnect: (frame) => {
          console.log('Connected: ' + frame);
          newClient.subscribe(
            `/topic/chatroom/${chatRoomId}`,
            subscriptionCallback
          );
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

      return () => {
        newClient.deactivate();
      };
    }
  }, [isMemberIdsFetched]);

  return (
    <Wrapper>
      <TopBar>
        <BackButton
          onClick={() => {
            navigate(`/chat/${chatRoomId}`);
          }}
        >
          <img src="/assets/arrow-pink-button.png" alt="뒤로가기" />
        </BackButton>
        <Title>산타의 질문이 도착했어요!</Title>
      </TopBar>

      <Texts>
        {questionsLeft <= 0 ? (
          <>
            <Heading>트리가 모두 완성되었어요!</Heading>
            <SubHeading>
              이벤트에 자동 응모되었어요
              <br />
              당첨 시 가입된 전화번호로 경품 증정됩니다
            </SubHeading>
          </>
        ) : (
          <>
            <Heading>
              트리 완성까지 {questionsLeft}개의 오너먼트가 더 필요해요
            </Heading>
            <SubHeading>
              상대와 이야기를 더 나누다보면 산타의 질문이 도착할 거에요
            </SubHeading>
          </>
        )}
      </Texts>

      <TreeArea>
        <Tree ref={treeRef} src="/assets/tree.png" alt="트리" />
        {displayedQuestions?.map((question, index) => (
          <ChristmasOrnament
            key={question.questionId}
            onClick={() => {
              openQueryAnswerModal(question.questionId);
            }}
            $treeRect={treeRect}
            $position={{
              x: ORNAMENT_DATA.at(index).x,
              y: ORNAMENT_DATA.at(index).y,
            }}
            $image={ORNAMENT_DATA.at(index).image}
            $isAnswer={question.isAnswer}
          />
        ))}
      </TreeArea>
    </Wrapper>
  );
};

export default ChristmasEventPage;

const ChristmasOrnament = styled.img.attrs((props) => {
  const { $treeRect, $position, $image, $isAnswer } = props;
  // 트리 너비의 13%를 오너먼트 크기로 설정
  const ornamentSize = Math.round($treeRect.width * 0.13);

  return {
    style: {
      left: `${$treeRect.left + $treeRect.width * $position.x}px`,
      top: `${$treeRect.top + $treeRect.height * $position.y}px`,

      // 오너먼트는 Clickable 해야 하니까 최소 크기를 48*48px로 설정함
      width: `${Math.max(ornamentSize, 48)}px`,
      height: `${Math.max(ornamentSize, 48)}px`,
    },
    src: $isAnswer ? $image.filled : $image.blank,
    alt: 'ornament',
  };
})`
  position: absolute;
  transform: translate(-50%, -50%);
  object-fit: contain;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 90%;
`;

const TopBar = styled.div`
  position: relative;
  width: 100%;
  height: 72px;
  padding: 12px 16px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: none;
  border: none;

  img {
    width: 12px;
  }
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.4px;
`;

const Texts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  word-break: keep-all;

  gap: 12px;
  height: 200px;
`;

const Heading = styled.h2`
  width: 90%;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 22px; /* 122.222% */
  text-wrap: balance;
  word-break: keep-all;
`;

const SubHeading = styled.h3`
  width: 80%;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 200;
  line-height: 22px;
  letter-spacing: -0.2px;
  text-wrap: balance;
  word-break: keep-all;
`;

const TreeArea = styled.div`
  width: 100%;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
`;

const Tree = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
