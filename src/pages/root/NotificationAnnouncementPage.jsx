import React from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { Navigate, useNavigate } from 'react-router-dom';
import { onGetToken } from '../../firebaseConfig';

const NotificationAnnouncementPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await onGetToken()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      })
      .finally('/');
  };

  if (Notification.permission === 'granted') {
    return <Navigate to="/" />;
  }

  return (
    <WrapPage>
      <WrapHeader>
        <div className="title-big">알림을 허용해주세요!</div>
        <div className="title-small">
          알림을 허용해서 채팅을 실시간으로 확인해보세요.
        </div>
      </WrapHeader>

      <img src="/assets/noti-announcement.svg" alt="알림 허용 이미지" />

      <Button size="large" onClick={handleSubmit}>
        알림 허용하기
      </Button>
    </WrapPage>
  );
};

export default NotificationAnnouncementPage;

const WrapHeader = styled.header`
  .title-big {
    font-size: 2rem;
    font-weight: 700;
  }
  .title-small {
    font-size: 0.8rem;
    font-weight: 700;
    color: #979797;
  }
`;

const WrapPage = styled.form`
  height: 90vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
