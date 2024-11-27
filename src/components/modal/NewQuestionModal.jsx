import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { instance } from '../../api/instance';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import Loader from '../common/Loader';
import { ClipLoader } from 'react-spinners';
import { useToast } from '../../hooks/useToast';

/**
 * @todo answer가 비어있으면 등록 버튼이 비활성화되어야 함
 * @todo 답변 최대 길이 제한
 * @todo 에러 처리
 * @todo 문제가 불러와지기 전 로딩 스피너
 * @todo 답변 등록 중 로딩 스피너
 * @todo 답변 등록 성공 시 토스트 메시지
 * @returns
 */
const NewQuestionModal = ({ chatRoomId, checkTiKiTaKa, closeModal }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const [isLoadingQuestionError, setIsLoadingQuestionError] = useState(false);

  const { showToast: showAnswerSubmitSuccessToast } = useToast(
    () => <span>등록이 완료되었어요!</span>,
    'answer-submitted',
    'bottom-center',
    'success'
  );

  const { showToast: showAnswerSubmitErrorToast } = useToast(
    () => <span>등록에 실패했어요! 다시 시도해주세요.</span>,
    'answer-submit-error',
    'bottom-center',
    'error'
  );

  const { showToast: showAlreadyAnweredToast } = useToast(
    () => <span>이미 답변을 등록했어요!</span>,
    'already-answered',
    'bottom-center',
    'error'
  );

  const fetchNewQuestion = async () => {
    try {
      setIsLoadingQuestionError(false);
      setIsLoadingQuestion(true);

      const res = await instance.post('/question', {
        chatRoomId,
        tikiTakaCount: checkTiKiTaKa,
      });

      setQuestion(res.data);
    } catch (error) {
      setIsLoadingQuestionError(true);
      console.error(error);
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const handleSubmitAnswer = async () => {
    try {
      setIsSubmittingAnswer(true);
      await instance.post('/answer', {
        questionId: question.questionId,
        answer,
      });

      closeModal();
      showAnswerSubmitSuccessToast();
    } catch (error) {
      if (error.response.data.code === 'ALREADY_EXIST_MEMBER') {
        showAlreadyAnweredToast();
      } else {
        showAnswerSubmitErrorToast();
      }
      console.error(error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, []);

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
              <Button size="medium" onClick={fetchNewQuestion}>
                다시 시도하기
              </Button>
            </>
          ) : (
            <>
              <Question>Q. {question.question}</Question>

              <BottomArea>
                <TextArea
                  placeholder="답변을 입력하세요"
                  value={answer}
                  rows={1}
                  maxRows={4}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                <Button
                  size="medium"
                  onClick={handleSubmitAnswer}
                  disabled={answer.length === 0 || isSubmittingAnswer}
                >
                  {isSubmittingAnswer ? (
                    <ClipLoader color="#ffffff" size={16} />
                  ) : (
                    '답변 등록하기'
                  )}
                </Button>
              </BottomArea>
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default NewQuestionModal;

const Modal = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  top: 50%;
  left: 50%;
  gap: 24px;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 50%;
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

const BottomArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const Question = styled.div`
  text-align: center;
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 30px;
  letter-spacing: -0.7px;
`;
