import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useQuery } from '@tanstack/react-query';
import { CHARACTERS } from '../../constants/CHARACTERS';
import useModal from '../../hooks/useModal';
import ModifyAnswerModal from './ModifyAnswerModal';

const QueryAnswerModal = ({
  questionId,
  opponentProfile,
  myProfile,
  closeModal,
}) => {
  const [questions, setQuestions] = useState([]);
  const isBothAnswered = questions.length === 2;

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingQuestionError, setIsLoadingQuestionError] = useState(false);

  const {
    openModal: openModifyAnswerModal,
    closeModal: closeModifyAnswerModal,
  } = useModal(({ question, originalAnswer, answerId }) => (
    <ModifyAnswerModal
      question={question}
      originalAnswer={originalAnswer}
      answerId={answerId}
      closeModal={closeModifyAnswerModal}
    />
  ));

  const { data: memberId } = useQuery({
    queryKey: ['memberId'],
    queryFn: () => instance.get('/member/id').then((res) => res.data),
    staleTime: 'Infinity',
  });

  const myAnswer = questions.find((q) => q.memberId === memberId);
  const opponentAnswer = questions.find((q) => q.memberId !== memberId);

  const fetchQuestion = async () => {
    try {
      setIsLoadingQuestion(true);
      const res = await instance.get(`/answer/${questionId}`);
      setQuestions(res.data);
    } catch (error) {
      setIsLoadingQuestionError(true);
      console.error(error);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const renderAnswers = () => {
    if (questions.length === 0) return null;

    return (
      <>
        <WrapAnswer>
          <CharacterBackground
            $backgroundColor={CHARACTERS[myProfile?.memberCharacter]?.color}
          >
            <Character
              $xPos={CHARACTERS[myProfile?.memberCharacter]?.position[0]}
              $yPos={CHARACTERS[myProfile?.memberCharacter]?.position[1]}
            />
          </CharacterBackground>

          <AnswerArea>
            <Nickname>{myProfile?.nickName} (나)</Nickname>
            <Answer>{myAnswer?.answer}</Answer>
          </AnswerArea>
        </WrapAnswer>

        <WrapAnswer>
          <CharacterBackground
            $backgroundColor={
              CHARACTERS[opponentProfile?.memberCharacter]?.color
            }
          >
            <Character
              $xPos={CHARACTERS[opponentProfile?.memberCharacter]?.position[0]}
              $yPos={CHARACTERS[opponentProfile?.memberCharacter]?.position[1]}
            />
          </CharacterBackground>

          <AnswerArea>
            <Nickname>{opponentProfile?.nickName} (상대방)</Nickname>
            <Answer $isBlurred={!isBothAnswered && opponentAnswer}>
              {opponentAnswer
                ? opponentAnswer.answer
                : '아직 답변을 하지 않았어요!'}
            </Answer>
          </AnswerArea>
        </WrapAnswer>
      </>
    );
  };

  return (
    <Modal>
      {isLoadingQuestion ? (
        <Loader />
      ) : (
        <>
          <CloseButton
            src="/assets/cancel-button-gray.svg"
            alt="닫기 버튼"
            onClick={closeModal}
          />

          {isLoadingQuestionError ? (
            <>
              <div style={{ textAlign: 'center' }}>
                문제를 불러오는 데 실패했습니다.
              </div>
              <ModalButton size="medium" onClick={fetchQuestion}>
                다시 시도하기
              </ModalButton>
            </>
          ) : (
            <>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                }}
              >
                {questions.length !== 0 && (
                  <Question>Q. {questions[0].question}</Question>
                )}
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                  }}
                >
                  {renderAnswers()}
                </div>
              </div>
              <ModalButton
                size="medium"
                onClick={() =>
                  openModifyAnswerModal({
                    question: myAnswer.question,
                    originalAnswer: myAnswer.answer,
                    answerId: myAnswer.answerId,
                  })
                }
              >
                내 답변 수정하기
              </ModalButton>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default QueryAnswerModal;

const ModalButton = styled(Button)`
  width: 70%;
`;

const Modal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 32px;
  transform: translate(-50%, -50%);
  justify-content: space-between;
  width: 90%;
  min-height: 451px;
  box-sizing: border-box;
  padding: 72px 32px 32px 32px;
  background: white;
  border-radius: 30px;
  box-shadow: 0px 0px 20px 0px #3333334d;
  z-index: 100;
  overflow: hidden;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 25px;
  right: 32px;
`;

const Question = styled.div`
  text-align: center;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 30px;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Nickname = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
  font-weight: 400;
`;

const Answer = styled.div`
  color: #000;
  font-size: 0.75rem;
  font-weight: 400;

  filter: ${(props) => (props.$isBlurred ? 'blur(5px)' : 'none')};
`;
