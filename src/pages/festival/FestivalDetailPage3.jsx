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

const FestivalDetailPage3 = () => {
  const navigate = useNavigate();

  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '데모부스',
          text: '벚꽃톤 데모부스에 대한 정보를 확인해 보세요!',
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
            데모부스
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
          <div className="date">2024.03.24 (일) 16:30~17:00</div>
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
            <h3>존경하는 참가자 및 방문객 여러분,</h3>
            벚꽃톤의 하이라이트 중 하나인 데모부스 행사에 여러분을 초대합니다.
            이번 행사는 여러분들의 최신 기술, 혁신적인 서비스, 그리고 창의적
            아이디어가 한데 모이는 장입니다. 여러분이 기대하는 다양한 분야의
            선두주자들이 모여 직접 체험하고, 대화를 나눌 수 있는 기회를
            제공합니다. <br />
            <br />
            <b>🌟 데모부스 행사 개요</b> <br />- <b>일시</b>: 2024. 3. 24(일)
            07:00~09:10 <br />- <b>장소</b>: 카카오 AI 캠퍼스 1층, 그로잉 홀{' '}
            <br />
            <br />
            이번 행사에서는 참여 팀들의 서비스를 직접 보고, 체험할 수 있습니다.
            각 부스를 방문하며, 참여자들과의 교류를 통해 새로운 지식을 습득하는
            시간을 가져보세요!
            <br />
            <br />
            이번 기회를 통해 참가자들의 서비스 기획 흐름을 파악하고, 미래를
            선도하는 혁신적 아이디어를 직접 체험해 보시기 바랍니다. 여러분의
            많은 참여를 기다립니다.
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

export default FestivalDetailPage3;
