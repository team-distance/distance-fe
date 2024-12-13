import React from 'react';
import styled from 'styled-components';
import { CHARACTERS } from '../../constants/CHARACTERS';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useMutation } from '@tanstack/react-query';
import { instance } from '../../api/instance';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { ClipLoader } from 'react-spinners';

const ProfileModal = ({ closeModal, selectedProfile }) => {
  const navigate = useNavigate();

  const { showToast: showFullMyChatroomToast } = useToast(
    () => (
      <span>
        이미 생성 가능한 채팅방 개수를 초과했어요! 기존 채팅방을 지우고 다시
        시도해주세요.
      </span>
    ),
    'too-many-my-chatroom'
  );

  const { showToast: showFullOppoChatroomToast } = useToast(
    () => (
      <span>
        상대방이 이미 생성 가능한 채팅방 개수를 초과했어요! 상대방이 수락하면
        알려드릴게요.
      </span>
    ),
    'too-many-opponent-chatroom'
  );

  const { showToast: showGpsErrorToast } = useToast(
    () => <span>상대방의 위치정보가 없어 채팅을 할 수 없어요!</span>,
    'not-exist-gps'
  );

  const { showToast: showLoginErrorToast } = useToast(
    () => <span>로그인 후 이용해주세요.</span>,
    'login-required'
  );

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      instance.post('/chatroom/create', { memberId: selectedProfile.memberId }),
    onSuccess: (res) => {
      console.log(res.data);
      navigate(`/chat/${res.data}`);
      closeModal();
    },
    onError: (error) => {
      switch (error.response.data.code) {
        case 'TOO_MANY_MY_CHATROOM':
          showFullMyChatroomToast();
          break;
        case 'TOO_MANY_OPPONENT_CHATROOM':
          showFullOppoChatroomToast();
          break;
        case 'NOT_AUTHENTICATION_STUDENT':
          window.confirm('학생 인증 후 이용해주세요.') &&
            navigate('/verify/univ');
          break;
        case 'NOT_EXIST_GPS':
          showGpsErrorToast();
          break;
        default:
          showLoginErrorToast();
          break;
      }
    },
  });

  return (
    <Modal>
      <CloseButton
        src="/assets/cancel-button-gray.svg"
        alt="닫기 버튼"
        onClick={closeModal}
      />
      <WrapContent>
        <CharacterBackground
          $backgroundColor={
            CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]?.color
          }
        >
          <img src="/assets/christmas/christmas-hat.png" alt="산타모자" />
          <Character
            $xPos={
              CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]
                ?.position[0]
            }
            $yPos={
              CHARACTERS[selectedProfile.memberProfileDto.memberCharacter]
                ?.position[1]
            }
          />
        </CharacterBackground>
        <TextDiv>
          <MBTI>{selectedProfile.memberProfileDto.mbti}</MBTI>
          <Major>{selectedProfile.memberProfileDto.department}</Major>
        </TextDiv>
        <TagContainer>
          {selectedProfile.memberProfileDto.memberHobbyDto.map(
            (hobby, index) => (
              <Badge key={index}>#{hobby.hobby}</Badge>
            )
          )}
          {selectedProfile.memberProfileDto.memberTagDto.map((tag, index) => (
            <Badge key={index}>#{tag.tag}</Badge>
          ))}
        </TagContainer>
      </WrapContent>
      <Button size="medium" onClick={mutate} disabled={isPending}>
        {isPending ? <ClipLoader color="#ffffff" size={16} /> : '메시지 보내기'}
      </Button>
    </Modal>
  );
};

export default ProfileModal;

const Modal = styled.div`
  position: fixed;
  display: grid;
  gap: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  padding: 48px 32px 32px 32px;
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

const WrapContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
`;

const CharacterBackground = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: ${(props) => props.$backgroundColor};

  img {
    width: 3rem;
    position: absolute;
    top: ${(props) => (props.$backgroundColor === '#D9EAD3' ? '5%' : '0%')};
    left: ${(props) => (props.$backgroundColor === '#D9EAD3' ? '21%' : '20%')};
    z-index: 99;
  }
`;

const Character = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  background-image: url('/assets/sp_character.png');
  background-position: ${(props) =>
    `-${props.$xPos * 60}px -${props.$yPos * 60}px`};
  background-size: calc(100% * 4);
`;

const TextDiv = styled.div`
  text-align: center;
  line-height: 20px;
  color: #333333;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Major = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
`;

const MBTI = styled.div`
  color: #000000;
  font-size: 14px;
`;
