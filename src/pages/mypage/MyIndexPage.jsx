import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
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

  return (
    <MyPageContainer>
      <Header />
      {isLoggedIn ? (
        <>
          <WrapMenu>
            <div className="title">마이페이지</div>
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
              <div className="menu" onClick={() => navigate('/privacy')}>
                <div>개인정보 처리방침</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="개인정보 처리방침"
                />
              </div>
              <div className="menu border">
                <div>버전</div>
                <div className="version">1.0.0</div>
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
    </MyPageContainer>
  );
};

export default MyIndexPage;

const MyPageContainer = styled.section`
  padding: 2rem 1.5rem;
`;

const WrapMenu = styled.nav`
  padding: 1.5rem 0;

  .title {
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const WrapButton = styled.div`
  .menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    padding: 0.8rem 0;

    img {
      height: 1rem;
    }

    .version {
      color: #b9b9b9;
    }
  }

  .border {
    border-top: 1px solid #f0f0f0;
    padding: 1.3rem 0;
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
