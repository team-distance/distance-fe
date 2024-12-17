import React, { useState } from 'react';
import Button from '../common/Button';
import styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { instance } from '../../api/instance';
import { ClipLoader } from 'react-spinners';
import { CHARACTERS } from '../../constants/CHARACTERS';
import ModifyAnswerModal from '../modal/ModifyAnswerModal';
import useModal from '../../hooks/useModal';

const NewQuestionMessage = ({ chatRoomId, questionId, client }) => {
  const queryClient = useQueryClient();

  const { data: memberId } = useQuery({
    queryKey: ['memberId'],
    queryFn: () => instance.get('/member/id').then((res) => res.data),
    staleTime: Infinity,
  });

  const [clickedNewQuestionList, setClickedNewQuestionList] = useState(
    JSON.parse(localStorage.getItem('clickedNewQuestionList')) || []
  );

  const isClickedThisQuestion = clickedNewQuestionList.some(
    (item) => item.chatRoomId === chatRoomId && item.questionId === questionId
  );

  const { data: answer, isLoading: isLoadingAnswer } = useQuery({
    queryKey: ['answer', questionId],
    queryFn: () =>
      instance.get(`/answer/${questionId}`).then((res) => res.data),
  });

  const isBothAnswered = answer?.answers?.every((answer) => answer.isAnswered);

  const question = answer?.question || '';

  const myAnswer = answer?.answers?.find(
    (answer) => answer.memberId === memberId
  );

  const opponentAnswer = answer?.answers?.find(
    (answer) => answer.memberId !== memberId
  );

  const {
    openModal: openModifyAnswerModal,
    closeModal: closeModifyAnswerModal,
  } = useModal(({ question, originalAnswer, answerId }) => (
    <ModifyAnswerModal
      question={question}
      originalAnswer={originalAnswer}
      answerId={answerId}
      closeModal={closeModifyAnswerModal}
      onComplete={() => {
        queryClient.invalidateQueries(['answer', questionId]);

        // // 새로운 질문을 클릭했을 때, 새로운 질문을 클릭했다는 정보를 로컬스토리지에 저장
        if (!isClickedThisQuestion) {
          localStorage.setItem(
            'clickedNewQuestionList',
            JSON.stringify([
              ...clickedNewQuestionList,
              { chatRoomId, questionId },
            ])
          );
        }

        client.publish({
          destination: `/app/chat/${chatRoomId}`,
          body: JSON.stringify({
            chatMessage: JSON.stringify({
              questionId: questionId,
            }),
            senderId: opponentAnswer?.memberId,
            receiverId: myAnswer?.memberId,
            publishType: 'ANSWER',
          }),
        });
      }}
      questionId={questionId}
    />
  ));

  if (isClickedThisQuestion) {
    return (
      <Announcement>
        {isLoadingAnswer ? (
          <Message>
            <ClipLoader color="#ff625d" size={16} />
          </Message>
        ) : (
          <Contents>
            <Question>Q. {question}</Question>
            <WrapAnswer>
              <CharacterBackground
                $backgroundColor={CHARACTERS[myAnswer?.memberCharacter]?.color}
              >
                <Character
                  $xPos={CHARACTERS[myAnswer?.memberCharacter]?.position[0]}
                  $yPos={CHARACTERS[myAnswer?.memberCharacter]?.position[1]}
                />
              </CharacterBackground>

              <AnswerArea>
                <Nickname>{myAnswer?.nickName} (나)</Nickname>
                <Answer>
                  {myAnswer?.isAnswered
                    ? myAnswer?.answer
                    : '아직 답변을 하지 않았어요!'}
                </Answer>
              </AnswerArea>
            </WrapAnswer>

            <WrapAnswer>
              <CharacterBackground
                $backgroundColor={
                  CHARACTERS[opponentAnswer?.memberCharacter]?.color
                }
              >
                <Character
                  $xPos={
                    CHARACTERS[opponentAnswer?.memberCharacter]?.position[0]
                  }
                  $yPos={
                    CHARACTERS[opponentAnswer?.memberCharacter]?.position[1]
                  }
                />
              </CharacterBackground>

              <AnswerArea>
                <Nickname>{opponentAnswer?.nickName} (상대방)</Nickname>
                <AnswerWrapper>
                  <Answer
                    $isBlurred={!isBothAnswered && opponentAnswer?.isAnswered}
                  >
                    {opponentAnswer?.isAnswered
                      ? opponentAnswer?.answer
                      : '아직 답변을 하지 않았어요!'}
                  </Answer>

                  {!isBothAnswered && opponentAnswer?.isAnswered && (
                    <Blur>
                      질문에 답변하면
                      <br />
                      상대방의 답변을 볼 수 있어요!
                    </Blur>
                  )}
                </AnswerWrapper>
              </AnswerArea>
            </WrapAnswer>

            <Button
              size="small"
              onClick={() => {
                openModifyAnswerModal({
                  question: question,
                  originalAnswer: myAnswer.answer,
                  answerId: myAnswer.answerId,
                });
              }}
            >
              내 답변 수정하기
            </Button>
          </Contents>
        )}
      </Announcement>
    );
  }

  return (
    <Announcement>
      <Message>
        <div className="title">산타의 질문이 도착했어요</div>
        <div className="subtitle">질문에 답해 트리를 완성해보세요</div>

        <Button
          size="small"
          onClick={() => {
            openModifyAnswerModal({
              question: question,
              originalAnswer: myAnswer?.answer,
              answerId: myAnswer?.answerId,
            });

            // 새로운 질문을 클릭했을 때, 새로운 질문을 클릭했다는 정보를 로컬스토리지에 저장
            if (!isClickedThisQuestion) {
              localStorage.setItem(
                'clickedNewQuestionList',
                JSON.stringify([
                  ...clickedNewQuestionList,
                  { chatRoomId, questionId },
                ])
              );
            }

            setClickedNewQuestionList(
              JSON.parse(localStorage.getItem('clickedNewQuestionList')) || []
            );
          }}
        >
          질문보기
        </Button>
      </Message>
    </Announcement>
  );
};

export default NewQuestionMessage;

const Announcement = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px;
`;

const Message = styled.div`
  width: 90%;
  background-color: #eee;
  box-sizing: border-box;
  border-radius: 24px;
  padding: 16px 42px;
  text-align: center;

  .title {
    font-size: 1rem;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: -0.23px;
  }

  .subtitle {
    font-size: 0.75rem;
    font-weight: 300;
    line-height: 20px;
    letter-spacing: -0.23px;
    margin-bottom: 12px;
  }
`;

const Question = styled.div`
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.7px;
  text-wrap: balance;
  word-break: keep-all;
`;

const WrapAnswer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CharacterBackground = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 100%;
  background-color: ${(props) => props.$backgroundColor};
`;

const Character = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 20}px -${props.$yPos * 20}px`};
  background-size: calc(100% * 4);
`;

const AnswerArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Nickname = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
  font-weight: 400;
`;

const AnswerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Answer = styled.div`
  position: relative;
  width: 100%;
  color: #000;
  font-size: 0.75rem;
  font-weight: 400;

  filter: ${(props) => (props.$isBlurred ? 'blur(5px)' : 'none')};
`;

const Blur = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  font-size: 10px;
  font-weight: 600;
  letter-spacing: -0.3px;
`;

const Contents = styled.div`
  width: 90%;
  background-color: #eee;
  border-radius: 24px;
  padding: 16px 42px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
