import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';

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
  .date {
    font-size: 1rem;
    font-weight: 300;
    line-height: 22px;
  }
  .location {
    display: flex;
    width: 100%;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1rem;
    color: #898989;

    img {
      width: 1rem;
      padding-right: 0.2rem;
    }
  }
`;
const ContentDiv = styled.article``;
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
const ContextDiv = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const FestivalDetailPage1 = () => {
  const navigate = useNavigate();

  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '야식제공',
          text: '벚꽃톤 야식에 대한 정보를 확인해 보세요!',
          url: window.location.href,
        })
        .then(() => alert('공유가 성공적으로 완료되었습니다.'))
        .catch((error) => console.log('공유에 실패했습니다.', error));
    } else {
      alert('이 브라우저에서는 공유 기능을 사용할 수 없습니다.');
    }
  };

  const copyButtonHandler = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert('링크가 성공적으로 복사되었습니다.'))
      .catch((error) => console.error('링크 복사에 실패했습니다.', error));
  };

  return (
    <>
      <DetailContainer>
        <Header />
        <TextDiv>
          <div className="title">
            야식제공
            <div>
              <img
                className="copy-button"
                src={'/assets/festival/copy-button.png'}
                alt="Copy button"
                onClick={copyButtonHandler}
              />
              <img
                className="share-button"
                src={'/assets/festival/share-button.png'}
                alt="Share button"
                onClick={shareButtonHandler}
              />
            </div>
          </div>
          <div className="date">2024.03.24 (일) 01:00~02:00</div>
          <br />
          <div className="location">
            <img src="/assets/festival/icon-location.svg" alt="location icon" />
            카카오 AI 캠퍼스 1층 그로잉 홀
          </div>
        </TextDiv>
        <ContentDiv>
          <CardDiv>
            <img src="/assets/festival/contentsImg/1.jpg" alt="Card News" />
            <img src="/assets/festival/contentsImg/2.jpg" alt="Card News" />
            <img src="/assets/festival/contentsImg/3.jpg" alt="Card News" />
          </CardDiv>
          <ContextDiv>
            <h3>
              <b>야간 행사 특별 안내: 야식 제공</b>
            </h3>
            밤이 깊어가는 시간, 벚꽃톤 참가자 여러분을 위한 맛있고 따뜻한 야식을
            준비했습니다. 이제 행사의 즐거움을 더욱 배가시킬 수 있는 완벽한
            기회입니다. <br />
            <br />
            <b>🌙 야식 파티 개요</b>- <b>일시</b>: 2024. 3. 24 (일), 01:00~02:00
            <br />- <b>메뉴</b>: 치킨, 피자
            <br />
            <br />
            여러분의 밤샘에 힘을 북돋아 줄 이번 야식을 꼭 드셔보세요. 함께
            맛있는 음식을 즐기며 파이팅 해봐요!
          </ContextDiv>
        </ContentDiv>
        <PrevButton
          src="/assets/festival/prev-button.png"
          alt="Prev button"
          onClick={() => navigate('/festival/program')}
        />
      </DetailContainer>
    </>
  );
};

export default FestivalDetailPage1;
