import React from "react";
import styled from "styled-components";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";

const DetailContainer = styled.section`
  padding: 2rem 1.5rem 8rem 1.5rem;
`;

const PrevButton = styled.img`
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 2px 8px 0px #33333366;
`;

const TextDiv = styled.article`
  width: 100%;
  align-items: center;

  .title {
    display: flex;
    justify-content: space-between;
    position: relative;
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 1.5rem;
    img {
      margin-left: 1rem;
    }
  }
`;

const CardDiv = styled.div`
  display: flex;
  overflow: auto;
  white-space: nowrap;
  gap: 0.5rem;
  padding: 1rem 0;

  img {
    width: 200px;
    height: 200px;
  }
`;

const ContextDiv = styled.p`
  color: #000;
  font-size: 16px;
  font-weight: 200;
  line-height: 22px;
  letter-spacing: -0.4px;
`;

const FoodTruckPage2 = () => {
  const navigate = useNavigate();
  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "커피프렌즈",
          text: "커피프렌즈의 푸드트럭 메뉴를 확인하세요.",
          url: window.location.href,
        })
        .then(() => alert("공유가 성공적으로 완료되었습니다."))
        .catch((error) => console.log("공유에 실패했습니다.", error));
    } else {
      alert("이 브라우저에서는 공유 기능을 사용할 수 없습니다.");
    }
  };

  const copyButtonHandler = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("링크가 성공적으로 복사되었습니다."))
      .catch((error) => console.error("링크 복사에 실패했습니다.", error));
  };

  return (
    <DetailContainer>
      <Header />
      <TextDiv>
        <div className="title">
          커피프렌즈
          <div>
            <img
              className="copy-button"
              src={"/assets/festival/copy-button.png"}
              alt="Copy button"
              onClick={copyButtonHandler}
            />
            <img
              className="share-button"
              src={"/assets/festival/share-button.png"}
              alt="Share button"
              onClick={shareButtonHandler}
            />
          </div>
        </div>
      </TextDiv>
      <article>
        <CardDiv>
          <img src="/assets/festival/contentsImg/1.jpg" alt="Card News" />
          <img src="/assets/festival/contentsImg/2.jpg" alt="Card News" />
          <img src="/assets/festival/contentsImg/3.jpg" alt="Card News" />
        </CardDiv>
        <ContextDiv>커피프렌즈</ContextDiv>
      </article>
      <PrevButton
        src="/assets/festival/prev-button.png"
        alt="Prev button"
        onClick={() => navigate("/festival/foodtruck")}
      />
    </DetailContainer>
  );
};

export default FoodTruckPage2;
