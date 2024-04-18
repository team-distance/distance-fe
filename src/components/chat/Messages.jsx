import React, { memo, useEffect, useRef } from "react";
import Message from "./Message";
import styled from "styled-components";

const Messages = memo(({ groupedMessages, myId }) => {
  const messageRef = useRef();

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]);

  /**
   * @todo messages.map()의 key 속성을 고유한 값으로 설정 (message.messageId)
   */
  return (
    <MessagesWrapper ref={messageRef}>
      <Announcement>
        <div className="content">
          📢 잠깐만요! 채팅 상대는 소중한 학우입니다. 사이버 예절을 지켜 주세요.
        </div>
      </Announcement>
      {Object.entries(groupedMessages).map(([date, messages]) => (
        <React.Fragment key={date}>
          <Announcement>
            <div className="content">
              {new Date(date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </Announcement>
          {messages.map((message, index) => (
            <Message
              key={index}
              nickname={message.senderName}
              content={message.chatMessage}
              time={message.sendDt}
              read={message.unreadCount}
              senderType={message.senderType}
              sentByMe={message.senderId !== Number(myId)}
            />
          ))}
        </React.Fragment>
      ))}
    </MessagesWrapper>
  );
});

const MessagesWrapper = styled.div`
  overflow: auto;
  flex: 1;
  min-height: 0;
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

export default Messages;
