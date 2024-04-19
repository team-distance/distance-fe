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
const ContextDiv = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const FestivalDetailPage0 = () => {
  const navigate = useNavigate();

  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '개회식',
          text: '벚꽃톤 개회식에 대한 정보를 확인해 보세요!',
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
            개회식
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
          <div className="date">2024.03.24 (토) 14:00</div>
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
            존경하는 참가자 여러분,
            <br /> <br />
            우리는 구름톤 유니브 2기 벚꽃톤의 개회식에 여러분을 초대하게 되어
            매우 기쁩니다. 이번 행사는 3월 23일(토), 카카오 AI 캠퍼스 1층 그로잉
            홀에서 개최됩니다. 여러분의 참여는 이 행사를 더욱 빛나게 해줄
            것입니다. <br />
            <br />
            개회식은 14시에 시작되며, 다음과 같은 프로그램으로 진행됩니다:
            <br />
            1. 개최사
            <br />
            2. 주최 기관 소개
            <br />
            3. 멘토 소개
            <br />
            <br />
            행사에 참여하시어 우리 모두의 노력과 열정을 한데 모아 구름톤 유니브
            2기 벚꽃톤을 성공적으로 시작할 수 있기를 바랍니다. 개회식에 참석해
            주셔서 함께 축하하고, 벚꽃톤을 위한 첫걸음을 떼는 이 의미 있는
            순간에 동참해 주시길 부탁드립니다.
            <br />
            <br />
            감사합니다.
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

export default FestivalDetailPage0;
