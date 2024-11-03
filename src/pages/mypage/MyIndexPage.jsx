import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../store/auth';
import { myDataState } from '../../store/myData';
import { instance } from '../../api/instance';
import { motion } from 'framer-motion';
import { useCheckAlarmActive } from '../../hooks/useCheckAlarmActive';
import { useCheckGpsActive } from '../../hooks/useCheckGpsActive';

const MyIndexPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const myData = useRecoilValue(myDataState);

  //알림, GPS 설정 관리
  const alarmActive = useCheckAlarmActive();
  const gpsActive = useCheckGpsActive();

  const handleLogout = async () => {
    const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
    if (!confirmLogout) return;

    try {
      await instance.get('/member/logout');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      navigate('/');
    }
  };

  const shareButtonHandler = async () => {
    let myTelNum;

    try {
      myTelNum = await instance
        .get('/member/own/telnum')
        .then((res) => res.data);
    } catch (error) {
      console.log('전화번호를 가져오는데 실패했습니다.');
    }

    if (navigator.share) {
      navigator
        .share({
          title: '💕 distance 디스턴스',
          text: '축제를 200% 즐기는 방법, distance 💕',
          url: 'https://dis-tance.com?referredTel=' + myTelNum,
        })
        .then(() => alert('공유가 성공적으로 완료되었습니다.'))
        .catch((error) => console.log('공유에 실패했습니다.', error));
    } else {
      alert('이 브라우저에서는 공유 기능을 사용할 수 없습니다.');
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <WrapMenu>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Title>마이페이지</Title>
              <ShareButton onClick={shareButtonHandler}>
                친구에게 공유하기
              </ShareButton>
            </div>
            <WrapButton>
              <div
                className="menu"
                onClick={() =>
                  navigate('/mypage/profile', { state: myData.contents })
                }
              >
                <div>프로필 수정</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="프로필 수정"
                />
              </div>
              <div className="menu" onClick={() => navigate('/mypage/account')}>
                <div>계정 관리</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="계정 관리"
                />
              </div>
              <div className="menu" onClick={() => navigate('/verify/univ')}>
                <div>학생 인증</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="학생 인증"
                />
              </div>
              <div
                className="menu border"
                onClick={() => navigate('/team-introduction')}
              >
                <div>팀 소개</div>
                <img src="/assets/mypage/arrow-gray-button.png" alt="팀 소개" />
              </div>
              <div className="menu" onClick={() => navigate('/privacy')}>
                <div>개인정보 처리방침</div>
              </div>
              <div className="menu" onClick={() => navigate('/notification')}>
                <div>앱푸시 알림 해결하기</div>
                {!alarmActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <img
                      className="warning-icon"
                      src="/assets/mypage/warning-icon.png"
                      alt="PUSH 알림 문제 해결"
                    />
                  </motion.div>
                )}
              </div>
              <div className="menu" onClick={() => navigate('/gps')}>
                <div>GPS 문제 해결</div>
                {!gpsActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <img
                      className="warning-icon"
                      src="/assets/mypage/warning-icon.png"
                      alt="GPS 문제 해결"
                    />
                  </motion.div>
                )}
              </div>
              <a
                className="menu border"
                href="https://open.kakao.com/o/szlVYjpg"
                target="_blank"
                rel="noreferrer noopener"
              >
                <div>문의하기</div>
              </a>
              <div className="menu">
                <div>버전</div>
                <div className="version">1.1.0</div>
              </div>
              <div className="menu border" onClick={handleLogout}>
                <div>로그아웃</div>
              </div>
            </WrapButton>
          </WrapMenu>
        </>
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/access-denied-mypage.svg'} alt="access denied" />
            <div>로그인 후 이용해주세요!</div>
          </div>
        </EmptyContainer>
      )}
    </>
  );
};

export default MyIndexPage;

const WrapMenu = styled.nav`
  padding: 1.5rem 0;
`;

const Title = styled.div`
  font-size: 2.25rem;
  font-style: normal;
  font-weight: 700;
`;

const ShareButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff625d;
  color: #ffffff;
  border-radius: 0.6875rem;
  padding: 0.625rem 0.75rem 0.6875rem 0.8125rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const WrapButton = styled.div`
  margin: 1.5rem 0;

  .menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    padding: 1rem 0;
    text-decoration: none;
    color: #000000;

    img {
      height: 1rem;
    }
    .warning-icon {
      height: 1.3rem;
    }

    .version {
      color: #b9b9b9;
    }
  }
  .border {
    border-top: 1px solid #f0f0f0;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 72vh;

  > .wrap {
    text-align: center; // 텍스트를 중앙 정렬합니다.

    > img {
      margin-bottom: 1rem; // 아이콘과 텍스트 사이의 간격을 조정합니다.
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;
