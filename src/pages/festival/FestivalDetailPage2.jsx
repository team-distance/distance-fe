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

const FestivalDetailPage2 = () => {
  const navigate = useNavigate();

  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '시상식 및 럭키드로우',
          text: '시상식 및 럭키드로우에 대한 정보를 확인해 보세요!',
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
            시상식 및 럭키드로우
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
          <div className="date">2024.03.24 (일) 07:00~09:10</div>
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
            <h3>존경하는 참가자 여러분,</h3>
            우리의 행사가 성황리에 진행되어가는 가운데, 이번 행사의 하이라이트인
            시상식 및 럭키드로우 이벤트에 여러분을 초대합니다. 여러분의 열정과
            노력을 기리고, 행운을 나누기 위한 이 특별한 순간을 함께할 수 있기를
            기대합니다. <br />
            <br />
            <b>🏆 시상식 및 럭키드로우 행사 개요</b> <br />
            <br />- <b>일시</b>: 2024. 3. 24 (일) 16:30~17:00 <br />-{' '}
            <b>프로그램</b>: 최종 수상자 선정, 심사평, 럭키드로우 <br />
            <br />
            이번 시상식에서는 행사 기간 동안 탁월한 성과를 보여준 참가자들에게
            상을 수여합니다. 여러분의 노력과 열정이 빛나는 순간을 함께
            축하하고자 합니다. 또한, 럭키드로우 이벤트를 통해 참여해 주신 모든
            분들께 감사의 마음을 전하고, 행운의 주인공을 발표할 예정입니다.
            <br />
            <br />
            <b>행사 하이라이트:</b> <br />- <b>시상식</b>: 각 부문별 수상자 발표
            및 시상 (대상 1팀, 최우수상 2팀, 우수상 2팀) <br />- <b>심사평</b>:
            심사위원 분들의 총괄 심사평 <br />- <b>럭키드로우</b>: 참가자 전원을
            대상으로 진행되는 행운의 추첨 이벤트 <br />
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

export default FestivalDetailPage2;
