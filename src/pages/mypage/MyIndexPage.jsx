import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../store/auth';
import { myDataState } from '../../store/myData';
import { instance } from '../../api/instance';

const MyIndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();
  const myData = useRecoilValue(myDataState);

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

  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '💕 distance 디스턴스',
          text: '축제를 200% 즐기는 방법, distance 💕',
          url: 'https://dis-tance.com',
        })
        .then(() => alert('공유가 성공적으로 완료되었습니다.'))
        .catch((error) => console.log('공유에 실패했습니다.', error));
    } else {
      alert('이 브라우저에서는 공유 기능을 사용할 수 없습니다.');
    }
  };

  return (
    <>
      {/* {isLoggedIn ? ( */}
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
              <img src="/assets/mypage/arrow-gray-button.png" alt="계정 관리" />
            </div>
            <div className="menu" onClick={() => navigate('/verify/univ')}>
              <div>학생 인증</div>
              <img src="/assets/mypage/arrow-gray-button.png" alt="학생 인증" />
            </div>
            <div className="menu border" onClick={() => navigate('/privacy')}>
              <div>개인정보 처리방침</div>
              <img
                src="/assets/mypage/arrow-gray-button.png"
                alt="개인정보 처리방침"
              />
            </div>
            <div
              className="menu"
              onClick={() => navigate('/team-introduction')}
            >
              <div>팀 소개</div>
              <img src="/assets/mypage/arrow-gray-button.png" alt="팀 소개" />
            </div>
            <div
              className="menu border"
              onClick={() => navigate('/notification')}
            >
              <div>PUSH 알림 문제 해결</div>
              <img
                src="/assets/mypage/arrow-gray-button.png"
                alt="PUSH 알림 문제 해결"
              />
            </div>
            <div className="menu" onClick={() => navigate('/gps')}>
              <div>GPS 문제 해결</div>
              <img
                src="/assets/mypage/arrow-gray-button.png"
                alt="GPS 문제 해결"
              />
            </div>
            <a
              className="menu"
              href="https://open.kakao.com/o/szlVYjpg"
              target="_blank"
              rel="noreferrer noopener"
            >
              <div>문의하기</div>
              <img src="/assets/mypage/arrow-gray-button.png" alt="문의하기" />
            </a>
            <div className="menu border">
              <div>버전</div>
              <div className="version">1.0.0</div>
            </div>
            <div className="menu" onClick={handleLogout}>
              <div>로그아웃</div>
            </div>
          </WrapButton>
        </WrapMenu>
      </>
      {/* ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/access-denied-mypage.svg'} alt="access denied" />
            <div>로그인 후 이용해주세요!</div>
          </div>
        </EmptyContainer>
      )} */}
    </>
  );
};

export default MyIndexPage;

const WrapMenu = styled.nav`
  padding: 1.5rem 0;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
`;

const ShareButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff625d;
  color: #ffffff;
  border-radius: 1rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const WrapButton = styled.div`
  .menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    padding: 0.8rem 0;
    text-decoration: none;
    color: #000000;

    img {
      height: 1rem;
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
