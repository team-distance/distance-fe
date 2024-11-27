import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { useQuery } from '@tanstack/react-query';

const QuestionModal = ({ questionId, closeModal }) => {
  const [questions, setQuestions] = useState([]);
  const isBothAnswered = questions.length === 2;

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingQuestionError, setIsLoadingQuestionError] = useState(false);

  const { data: memberId } = useQuery({
    queryKey: ['memberId'],
    queryFn: () => instance.get('/member/id').then((res) => res.data),
    staleTime: 'Infinity',
  });

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

    const myAnswer = questions.find((q) => q.memberId === memberId);
    const opponentAnswer = questions.find((q) => q.memberId !== memberId);

    return (
      <>
        <WrapAnswer>
          <div>상대방:</div>
          {opponentAnswer ? (
            <Answer $isBlurred={!isBothAnswered}>
              {opponentAnswer.answer}
            </Answer>
          ) : (
            <div>아직 답변하지 않았어요!</div>
          )}
        </WrapAnswer>
        <WrapAnswer>
          <div>나:</div>
          {myAnswer ? (
            <Answer $isBlurred={false}>{myAnswer.answer}</Answer>
          ) : (
            <div>아직 답변하지 않았어요!</div>
          )}
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
              <Button size="medium" onClick={fetchQuestion}>
                다시 시도하기
              </Button>
            </>
          ) : (
            <>
              {questions.length !== 0 && (
                <Question>Q. {questions[0].question}</Question>
              )}
              <div>{renderAnswers()}</div>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default QuestionModal;

const Modal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 24px;
  transform: translate(-50%, -50%);
  width: 90%;
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
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.7px;
`;

const WrapAnswer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Answer = styled.div`
  text-align: center;
  filter: ${(props) => (props.$isBlurred ? 'blur(5px)' : 'none')};
`;
