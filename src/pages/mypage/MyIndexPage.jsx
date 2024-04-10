import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState } from "../../store/auth";
import { myDataState } from "../../store/myData";

const MyIndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();
  const myData = useRecoilValue(myDataState);

  const handleLogout = () => {
    //토큰 넘기기 (api)
    
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("clientToken");
    localStorage.removeItem("memberId");
    navigate("/");
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
                  navigate("/mypage/profile", { state: myData.contents })
                }>
                <div>프로필 수정</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="Edit Profile"
                />
              </div>
              <div
                className="menu"
                onClick={() =>
                  navigate("/mypage/profile", { state: myData.contents })
                }>
                <div>계정 관리</div>
                <img
                  src="/assets/mypage/arrow-gray-button.png"
                  alt="Edit Profile"
                />
              </div>
              <div className="menu">
                <div>버전</div>
                <div className="version">1.0.0</div>
              </div>
            </WrapButton>
            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
          </WrapMenu>
        </>
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={"/assets/access-denied-mypage.svg"} alt="access denied" />
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
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
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

const LogoutButton = styled.div`
  position: absolute;
  left: 50%;
  bottom: 7rem;
  transform: translateX(-50%);
  color: #767676;
  font-size: 12px;
  font-weight: 500;
`;
