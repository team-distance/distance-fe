import React, { memo, useEffect, useRef } from 'react';
import Message from './Message';
import styled from 'styled-components';

const Messages = memo(
  ({
    groupedMessages,
    myId,
    responseCall,
    viewImage,
    openProfileModal,
    opponentMemberCharacter,
    isMenuOpen,
    isUploadingImage,
    uploadProgress,
    uploadingImagePreviewUrl,
  }) => {
    const messageRef = useRef();

    const scrollToBottom = () => {
      if (messageRef.current) {
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, [groupedMessages, isUploadingImage]);

    return (
      <MessagesWrapper ref={messageRef} $isOpen={isMenuOpen}>
        <Announcement>
          <div className="content">
            📢 잠깐만요! 채팅 상대는 소중한 학우입니다. 사이버 예절을 지켜
            주세요.
          </div>
        </Announcement>
        {Object.entries(groupedMessages).map(([date, messages]) => (
          <React.Fragment key={date}>
            <Announcement>
              <div className="content">
                {new Date(date).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </Announcement>
            {messages.map((message) => (
              <Message
                key={message.messageId}
                message={message}
                isSentByMe={message.senderId !== Number(myId)}
                responseCall={responseCall}
                viewImage={viewImage}
                openProfileModal={openProfileModal}
                opponentMemberCharacter={opponentMemberCharacter}
              />
            ))}
          </React.Fragment>
        ))}
        {isUploadingImage && (
          <UploadingImagePreview>
            <div className="message-container">
              <img src={uploadingImagePreviewUrl} alt="message" />
              <div className="backdrop" />
              <div className="progress">
                <Progress
                  value={
                    Math.round(
                      (uploadProgress.loaded / uploadProgress.total) * 100
                    ) || 0
                  }
                  max="100"
                />
                <div>
                  {/* 바이트를 메가바이트로 변환 */}
                  {(uploadProgress.loaded / (1024 * 1024)).toFixed(2)} MB /{' '}
                  {(uploadProgress.total / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
            </div>
          </UploadingImagePreview>
        )}
      </MessagesWrapper>
    );
  }
);

const MessagesWrapper = styled.div`
  overflow: auto;
  flex: 1;
  min-height: 0;
  margin-bottom: 6rem;
  z-index: ${({ $isOpen }) => ($isOpen ? '0' : '10')};
`;

const Announcement = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px;

  > .content {
    font-size: 0.7rem;
    background-color: #eee;
    padding: 0.5rem;
    text-align: center;
    border-radius: 9999px;
  }
`;

const UploadingImagePreview = styled.div`
  margin: 16px;
  display: flex;
  justify-content: flex-end;

  .message-container {
    display: flex;
    position: relative;
    align-items: end;
    justify-content: flex-end;
    gap: 0.5rem;
    max-width: 80%;
    border-radius: 1rem;
    overflow: hidden;

    img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 1rem;
    }

    .backdrop {
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      opacity: 0.5;
      background-color: black;
    }

    .progress {
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 0.8rem;
      gap: 8px;
    }
  }
`;

const Progress = styled.progress`
  width: 80%;
  height: 8px;
  appearance: none;

  &::-webkit-progress-bar {
    background-color: #f5f5f5;
    border-radius: 9999px;
  }

  &::-webkit-progress-value {
    background-color: #ff625d;
    border-radius: 9999px;
  }
`;

export default Messages;
