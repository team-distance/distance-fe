import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Characters from "../../constants/character";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInState } from "../../store/auth";
import { myDataState } from "../../store/myData";

const MyIndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const navigate = useNavigate();
  const myData = useRecoilValue(myDataState);

  const handleLogout = () => {
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
            <WarpProfile>
              <img src={Characters[myData.memberCharacter]} alt="festival" />
              <TextDiv>
                <div className="title">
                  {myData.department}, {myData.mbti}
                </div>
                <WrapTag>
                  {myData.memberHobbyDto &&
                    myData.memberHobbyDto.map((hobby, index) => (
                      <div key={index} className="tag">
                        # {hobby.hobby}
                      </div>
                    ))}
                </WrapTag>
                <WrapTag>
                  {myData.memberTagDto &&
                    myData.memberTagDto.map((tag, index) => (
                      <div key={index} className="tag">
                        # {tag.tag}
                      </div>
                    ))}
                </WrapTag>
              </TextDiv>
            </WarpProfile>
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
              <div className="menu">
                <div>버전</div>
                <div className="version">1.0.0</div>
              </div>
              <div className="menu" onClick={handleLogout}>
                <div>로그아웃</div>
              </div>
            </WrapButton>
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

const WarpProfile = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  height: 130px;
  border-radius: 1rem;
  box-shadow: 0px 5px 20px 0px #00000014;
  margin-bottom: 2rem;
  padding: 0 1rem;

  img {
    width: 35%;
  }
`;

const TextDiv = styled.div`
  width: 100%;
  align-items: center;

  .title {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.5rem;
  }
  .tag {
    display: flex;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1rem;
    color: #333333;
    white-space: nowrap;
  }
`;

const WrapTag = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 50%;

  > .wrap {
    text-align: center; // 텍스트를 중앙 정렬합니다.

    > img {
      margin-bottom: 1rem; // 아이콘과 텍스트 사이의 간격을 조정합니다.
    }

    > div {
      font-size: 1rem;
      font-weight: 600;
      line-height: 22px;
    }
  }
`;
