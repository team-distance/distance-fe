import React, { memo } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { CHARACTERS } from '../../constants/CHARACTERS';
import dayjs from 'dayjs';

/**
 * Message 객체 속성
 * @param {string} senderName - 메시지를 보낸 사람의 닉네임
 * @param {string} chatMessage - 메시지 내용
 * @param {string} sendDt - 메시지를 보낸 시간
 * @param {boolean} unreadCount - 메시지를 읽었는지 여부
 * @param {string} senderType - 메시지를 보낸 사람의 타입 (SYSTEM, USER, CALL_REQUEST, CALL_RESPONSE)
 */

const Message = memo(
  ({
    message,
    isSentByMe,
    responseCall,
    viewImage,
    openProfileModal,
    opponentMemberCharacter,
    bothAgreed,
    openNewQuestionModal,
    roomId,
  }) => {
    const unreadCount = message.unreadCount !== 0 ? message.unreadCount : '';
    const messageTime = dayjs(message.sendDt).format('HH:mm');

    const characterXpos = CHARACTERS[opponentMemberCharacter]?.position[0];
    const characterYpos = CHARACTERS[opponentMemberCharacter]?.position[1];
    const characterColor = CHARACTERS[opponentMemberCharacter]?.color;

    const S3_URL = 'https://distance-buckets.s3.ap-northeast-2.amazonaws.com';
    const CDN_URL = 'https://cdn.dis-tance.com';

    switch (message.senderType) {
      case 'SYSTEM':
        return (
          <Announcement>
            <div className="content">{message.chatMessage}</div>
          </Announcement>
        );

      case 'NEW_QUESTION':
        return (
          <Announcement>
            <NewQuestionMessage>
              <div className="title">산타의 질문이 도착했어요</div>
              <div className="subtitle">질문에 답해 트리를 완성해보세요</div>

              <Button
                size="small"
                onClick={() => {
                  console.log('checkTiKiTaKa:', message.checkTiKiTaKa);
                  openNewQuestionModal({
                    chatRoomId: roomId,
                    checkTiKiTaKa: message.checkTiKiTaKa,
                  });
                }}
              >
                질문보기
              </Button>
            </NewQuestionMessage>
          </Announcement>
        );

      case 'CALL_REQUEST':
        return isSentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{unreadCount}</div>
                <div className="time">{messageTime}</div>
              </div>
              <div className="tail"></div>
              <div className="message">
                <strong>📞 우리 통화해요!</strong>
                <div>요청을 수락하면 서로의 번호로 통화할 수 있어요.</div>
              </div>
            </div>
          </MessageByMe>
        ) : (
          <MessageByOther>
            <CharacterBackground
              $backgroundColor={characterColor}
              onClick={openProfileModal}
            >
              <Character $xPos={characterXpos} $yPos={characterYpos} />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{message.senderName}</div>
              <div className="message-container">
                <div className="tail"></div>
                <div className="message">
                  <strong>📞 우리 통화해요!</strong>
                  <div style={{ marginBottom: '8px' }}>
                    요청을 수락하면 서로의 번호로 통화할 수 있어요.
                  </div>
                  {!bothAgreed && (
                    <Button
                      size="medium"
                      backgroundColor="#36CF00"
                      onClick={responseCall}
                    >
                      수락하기
                    </Button>
                  )}
                </div>
                <div className="wrapper">
                  <div className="read">{unreadCount}</div>
                  <div className="time">{messageTime}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );

      case 'CALL_RESPONSE':
        return isSentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{unreadCount}</div>
                <div className="time">{messageTime}</div>
              </div>
              <div className="tail"></div>
              <div className="message">
                <strong>🎉 통화 요청을 수락했어요!</strong>
                <div>
                  상단{' '}
                  <img
                    src="/assets/callicon-active.svg"
                    alt="전화버튼"
                    style={{ verticalAlign: 'middle' }}
                  />{' '}
                  버튼을 눌러 통화해보세요.
                </div>
              </div>
            </div>
          </MessageByMe>
        ) : (
          <MessageByOther>
            <CharacterBackground
              $backgroundColor={characterColor}
              onClick={openProfileModal}
            >
              <Character $xPos={characterXpos} $yPos={characterYpos} />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{message.senderName}</div>
              <div className="message-container">
                <div className="tail"></div>
                <div className="message">
                  <strong>🎉 통화 요청을 수락했어요!</strong>
                  <div>
                    상단{' '}
                    <img
                      src="/assets/callicon-active.svg"
                      alt="전화버튼"
                      style={{ verticalAlign: 'middle' }}
                    />{' '}
                    버튼을 눌러 통화해보세요.
                  </div>
                </div>
                <div className="wrapper">
                  <div className="read">{unreadCount}</div>
                  <div className="time">{messageTime}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );

      case 'USER':
        return isSentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{unreadCount}</div>
                <div className="time">{messageTime}</div>
              </div>
              <>
                <div className="tail"></div>
                <div className="message">{message.chatMessage}</div>
              </>
            </div>
          </MessageByMe>
        ) : (
          <MessageByOther>
            <CharacterBackground
              $backgroundColor={characterColor}
              onClick={openProfileModal}
            >
              <Character $xPos={characterXpos} $yPos={characterYpos} />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{message.senderName}</div>
              <div className="message-container">
                <>
                  <div className="tail"></div>
                  <div className="message">{message.chatMessage}</div>
                </>
                <div className="wrapper">
                  <div className="read">{unreadCount}</div>
                  <div className="time">{messageTime}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );
      case 'IMAGE':
        const imageViaCdn = message.chatMessage.replace(S3_URL, CDN_URL);
        const width = 600;
        const format = 'webp';
        const quality = 75;

        return isSentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{unreadCount}</div>
                <div className="time">{messageTime}</div>
              </div>
              <img
                src={imageViaCdn + `?w=${width}&f=${format}&q=${quality}`}
                alt=""
                loading="lazy"
                onClick={() => viewImage(imageViaCdn)}
              />
            </div>
          </MessageByMe>
        ) : (
          <MessageByOther>
            <CharacterBackground
              $backgroundColor={characterColor}
              onClick={openProfileModal}
            >
              <Character $xPos={characterXpos} $yPos={characterYpos} />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{message.senderName}</div>
              <div className="message-container">
                <img
                  src={imageViaCdn + `?w=${width}&f=${format}&q=${quality}`}
                  loading="lazy"
                  alt=""
                  onClick={() => viewImage(imageViaCdn)}
                />
                <div className="wrapper">
                  <div className="read">{unreadCount}</div>
                  <div className="time">{messageTime}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );
      default:
        return null;
    }
  }
);

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

const NewQuestionMessage = styled.div`
  width: 60%;
  background-color: #eee;
  padding: 16px 42px;
  text-align: center;
  border-radius: 24px;

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

const CharacterBackground = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  background-color: ${(props) => props.$backgroundColor};

  img {
    position: absolute;
    width: 70%;
    height: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Character = styled.div`
  width: 24px;
  height: 24px;
  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 24}px -${props.$yPos * 24}px`};
  background-size: calc(100% * 4);

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const MessageByOther = styled.div`
  display: flex;
  align-items: start;
  gap: 12px;
  margin: 16px;

  .profile-section {
    width: 44px;
    height: 44px;
    background-color: red;
    border-radius: 100%;
  }

  .message-section {
    > .nickname {
      margin-bottom: 4px;
      font-size: 0.8rem;
      opacity: 50%;
    }

    > .message-container {
      display: flex;
      align-items: end;
      gap: 0.5rem;
      position: relative;
      flex-grow: 1;

      > .tail {
        position: absolute;
        top: 0;
        left: -10px;
        width: 25px;
        height: 30px;
        clip-path: polygon(100% 0, 0 0, 100% 100%);
        background-color: #f5f5f5;
        z-index: -1;
      }

      > .message {
        width: fit-content;
        max-width: 70%;
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 1rem;
        color: black;
        line-height: 1.5;
        overflow-wrap: break-word;
        word-break: break-word;

        a {
          color: black;
        }

        strong {
          font-weight: 600;
        }
      }

      > img {
        width: 200px;
        height: 200px;
        object-fit: cover;
        border-radius: 1rem;
      }

      > .wrapper {
        font-size: 0.6rem;
        > .read {
          color: #ff625d;
        }
        > .time {
          opacity: 50%;
        }
      }
    }
  }
`;

const MessageByMe = styled.div`
  margin: 16px;
  display: flex;
  justify-content: flex-end;

  > .message-container {
    display: flex;
    position: relative;
    align-items: end;
    justify-content: flex-end;
    gap: 0.5rem;
    max-width: 80%;

    > .wrapper {
      text-align: right;
      font-size: 0.6rem;
      > .read {
        color: #ff625d;
      }
      > .time {
        opacity: 50%;
      }
    }

    > .tail {
      position: absolute;
      top: 0;
      right: -10px;
      width: 25px;
      height: 30px;
      clip-path: polygon(100% 0, 0 0, 0% 100%);
      background-color: #ff625d;
      z-index: -1;
    }

    > .message {
      width: fit-content;
      max-width: 100%; // 변경: content의 최대 너비를 wrapper에 맞게 조절
      background-color: #ff625d;
      padding: 10px;
      border-radius: 1rem;
      color: white;
      line-height: 1.5;
      overflow-wrap: break-word;
      word-break: break-word;

      .link {
        text-decoration: underline;
      }

      a {
        color: white;
      }

      strong {
        font-weight: 600;
      }
    }
    > img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 1rem;
    }
  }
`;

export default Message;
