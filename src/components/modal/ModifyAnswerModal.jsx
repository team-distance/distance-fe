import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { instance } from '../../api/instance';
import { useToast } from '../../hooks/useToast';
import TextArea from '../common/TextArea';
import { ClipLoader } from 'react-spinners';

const ModifyAnswerModal = ({
  question,
  originalAnswer,
  answerId,
  closeModal,
  onComplete,
}) => {
  const [answer, setAnswer] = useState(originalAnswer || '');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const { showToast: showAnswerSubmitSuccessToast } = useToast(
    () => <span>수정이 완료되었어요!</span>,
    'answer-submitted',
    'bottom-center',
    'success'
  );

  const { showToast: showAnswerSubmitErrorToast } = useToast(
    () => <span>수정에 실패했어요! 다시 시도해주세요.</span>,
    'answer-submit-error',
    'bottom-center',
    'error'
  );

  const handleSubmitAnswer = async () => {
    try {
      setIsSubmittingAnswer(true);
      await instance.patch(`/answer/${answerId}`, { answer });
      showAnswerSubmitSuccessToast();
      closeModal();

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(error);
      showAnswerSubmitErrorToast();
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />

      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        <Question>Q. {question}</Question>
        <TextArea
          placeholder="답변을 입력하세요"
          value={answer}
          rows={1}
          maxRows={4}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>
      <ModalButton
        size="medium"
        onClick={handleSubmitAnswer}
        disabled={answer?.length === 0 || isSubmittingAnswer}
      >
        {isSubmittingAnswer ? (
          <ClipLoader color="#ffffff" size={16} />
        ) : (
          '작성 완료'
        )}
      </ModalButton>
    </Modal>
  );
};

export default ModifyAnswerModal;

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
