import React, { memo } from 'react';
import styled from 'styled-components';
import { parseTime } from '../../utils/parseTime';
import Button from '../common/Button';
import { CHARACTERS } from '../../constants/CHARACTERS';

/**
 * @param {string} nickname - 메시지를 보낸 사람의 닉네임
 * @param {string} content - 메시지 내용
 * @param {string} time - 메시지를 보낸 시간
 * @param {boolean} read - 메시지를 읽었는지 여부
 * @param {string} senderType - 메시지를 보낸 사람의 타입 (SYSTEM, USER, CALL_REQUEST, CALL_RESPONSE)
 * @param {boolean} sentByMe - 메시지를 내가 보냈는지 여부
 */
const Message = memo(
  ({
    nickname,
    content,
    time,
    read,
    senderType,
    sentByMe,
    responseCall,
    openProfileModal,
    opponentMemberCharacter,
  }) => {
    switch (senderType) {
      case 'SYSTEM':
        return (
          <Announcement>
            <div className="content">{content}</div>
          </Announcement>
        );

      case 'CALL_REQUEST':
        return sentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{read !== 0 ? read : ''}</div>
                <div className="time">{parseTime(time)}</div>
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
              $backgroundColor={CHARACTERS[opponentMemberCharacter]?.color}
              onClick={openProfileModal}
            >
              <Character
                $xPos={CHARACTERS[opponentMemberCharacter]?.position[0]}
                $yPos={CHARACTERS[opponentMemberCharacter]?.position[1]}
              />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{nickname}</div>
              <div className="message-container">
                <div className="tail"></div>
                <div className="message">
                  <strong>📞 우리 통화해요!</strong>
                  <div style={{ marginBottom: '8px' }}>
                    요청을 수락하면 서로의 번호로 통화할 수 있어요.
                  </div>
                  <Button
                    size="medium"
                    backgroundColor="#36CF00"
                    onClick={responseCall}
                  >
                    수락하기
                  </Button>
                </div>
                <div className="wrapper">
                  <div className="read">{read !== 0 ? read : ''}</div>
                  <div className="time">{parseTime(time)}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );

      case 'CALL_RESPONSE':
        return sentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{read !== 0 ? read : ''}</div>
                <div className="time">{parseTime(time)}</div>
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
              $backgroundColor={CHARACTERS[opponentMemberCharacter]?.color}
              onClick={openProfileModal}
            >
              <Character
                $xPos={CHARACTERS[opponentMemberCharacter]?.position[0]}
                $yPos={CHARACTERS[opponentMemberCharacter]?.position[1]}
              />
            </CharacterBackground>
            <div className="message-section">
              <div className="nickname">{nickname}</div>
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
                  <div className="read">{read !== 0 ? read : ''}</div>
                  <div className="time">{parseTime(time)}</div>
                </div>
              </div>
            </div>
          </MessageByOther>
        );

      case 'USER':
        return sentByMe ? (
          <MessageByMe>
            <div className="message-container">
              <div className="wrapper">
                <div className="read">{read !== 0 ? read : ''}</div>
                <div className="time">{parseTime(time)}</div>
              </div>
              <div className="tail"></div>
              <div className="message">{content}</div>
            </div>
          </MessageByMe>
        ) : (
          <MessageByOther>
            <CharacterBackground
              $backgroundColor={CHARACTERS[opponentMemberCharacter]?.color}
              onClick={openProfileModal}
            >
              <Character
                $xPos={CHARACTERS[opponentMemberCharacter]?.position[0]}
                $yPos={CHARACTERS[opponentMemberCharacter]?.position[1]}
              />
            </CharacterBackground>

            <div className="message-section">
              <div className="nickname">{nickname}</div>
              <div className="message-container">
                <div className="tail"></div>
                <div className="message">{content}</div>
                <div className="wrapper">
                  <div className="read">{read !== 0 ? read : ''}</div>
                  <div className="time">{parseTime(time)}</div>
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
        width: 30px;
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
      width: 30px;
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
  }
`;

export default Message;
