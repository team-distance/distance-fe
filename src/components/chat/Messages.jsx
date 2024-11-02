import React, { memo, useEffect, useRef, useState } from 'react';
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
    requestCancelController,
    onIntersect,
  }) => {
    // 아이폰에서는 프로그레스 바에 파일 전체 크기를 표시하지 않기 위해 사용
    // (axios의 onUploadProgress 이벤트 핸들러에서 total 값이 제대로 전달되지 않음)
    const isIphone = navigator.userAgent.includes('iPhone');
    const [isFetching, setIsFetching] = useState(false);

    const messageRef = useRef();
    const observerRef = useRef(); // Observer를 위한 ref

    const cancelUpload = () => {
      if (requestCancelController) {
        requestCancelController.abort();
      }
    };

    // messages > scrollTop 구현
    // 방 처음 생성 시 상단 여백 해결

    useEffect(() => {
      const observer = new IntersectionObserver(
        async ([entry]) => {
          if (entry.isIntersecting && !isFetching) {
            setIsFetching(true);
            await onIntersect();
            setIsFetching(false);
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0,
        }
      );

      const currentObserverRef = observerRef.current;

      if (currentObserverRef) {
        observer.observe(currentObserverRef);
      }

      return () => {
        if (currentObserverRef) {
          observer.unobserve(currentObserverRef);
        }
      };
    }, [onIntersect, isFetching]);

    // 새로운 메시지가 추가되었을 때 스크롤 위치 조정
    // useEffect(() => {
    //   if (messageRef.current && !isFetching) {
    //     messageRef.current.scrollTo({
    //       top: messageRef.current.scrollHeight,
    //       behavior: 'smooth',
    //     });
    //   }
    // }, [groupedMessages, isFetching]);

    return (
      <MessagesWrapper ref={messageRef} $isOpen={isMenuOpen}>
        {Object.entries(groupedMessages)
          .reverse()
          .map(([date, messages]) => (
            <WrapMessage key={date}>
              <WrapDate>
                <div className="content">
                  {new Date(date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </WrapDate>

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
            </WrapMessage>
          ))}
        {isUploadingImage && (
          <UploadingImagePreview>
            <div className="message-container">
              <img src={uploadingImagePreviewUrl} alt="" />
              <div className="backdrop" />
              <div className="progress">
                <Progress
                  value={Math.round(uploadProgress.progress * 100) || 0}
                  max={100}
                />
                <div>
                  {(uploadProgress.loaded / (1024 * 1024)).toFixed(2)} MB
                  {!isIphone &&
                    ` / ${(uploadProgress.total / (1024 * 1024)).toFixed(
                      2
                    )} MB`}
                </div>
                <RoundedButton onClick={cancelUpload}>취소</RoundedButton>
              </div>
            </div>
          </UploadingImagePreview>
        )}

        <div className="observer" ref={observerRef} />
        <Announcement>
          <div className="content">
            📢 잠깐만요! 채팅 상대는 소중한 학우입니다. 사이버 예절을 지켜
            주세요.
          </div>
        </Announcement>
      </MessagesWrapper>
    );
  }
);

const MessagesWrapper = styled.div`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  margin-bottom: 3rem;
  z-index: ${({ $isOpen }) => ($isOpen ? '0' : '10')};
  transform: scaleY(-1); // 전체 스크롤 뷰를 뒤집기
`;

const WrapMessage = styled.div`
  transform: scaleY(-1);
`;

const WrapDate = styled.div`
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

const Announcement = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px;
  transform: scaleY(-1);

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
  transform: scaleY(-1);

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

const RoundedButton = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 1rem;
`;

export default Messages;
