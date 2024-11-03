import { useNavigate } from 'react-router-dom';
import { instance } from '../api/instance';
import { useToast } from './useToast';

export const useCreateChatRoom = () => {
  const navigate = useNavigate();

  // 토스트 메세지
  const { showToast: showFullMyChatroomToast } = useToast(
    () => (
      <span>
        이미 생성 가능한 채팅방 개수를 초과했어요!. 기존 채팅방을 지우고 다시
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
    'too-many-oppo-chatroom'
  );
  const { showToast: showGpsErrorToast } = useToast(
    () => <span>상대방의 위치정보가 없어 채팅을 할 수 없어요!</span>,
    'too-many-oppo-chatroom'
  );
  const { showToast: showLoginErrorToast } = useToast(
    () => <span>로그인 후 이용해주세요.</span>,
    'too-many-oppo-chatroom'
  );

  const handleCreateChatRoom = async (
    opponentMemberId,
    closeProfileModal,
    setIsProfileButtonClicked
  ) => {
    await instance
      .post('/chatroom/create', {
        memberId: opponentMemberId,
      })
      .then((res) => {
        setIsProfileButtonClicked(true); //연타 방지
        const createdChatRoom = res.data;
        navigate(`/chat/${createdChatRoom}`);
      })
      .catch((error) => {
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
      });
    closeProfileModal();
  };

  return handleCreateChatRoom;
};
