import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
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
`;

const MenuCardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const MenuCard = styled.div`
  width: 100%;
  height: auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  resize: both;
  overflow: hidden;

  .image-container {
    width: 100%;
    height: 0;
    padding-top: 100%;
    position: relative;
    background-color: #f3f3f3; // 이미지 배경 확인을 위한 색상
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .menu-info {
    padding: 12px;

    .name {
      font-size: 16px;
      font-weight: 600;
    }

    .price {
      font-size: 14px;
      font-weight: 300;
      line-height: 22px;
    }
  }
`;

const FoodTruckPage = () => {
  const navigate = useNavigate();
  const foodTruckId = useParams();
  // const [foodTruck, setFoodTruck] = useState(null);

  const fetchFoodTruck = async () => {
    try {
      // const res = instance.get(`/food-truck/${foodTruckId.id}`);
      // setFoodTruck(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 백엔드 API 완성 시 title, text 지정 필요
  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: '타코야',
          text: '타코야의 푸드트럭 메뉴를 확인하세요.',
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

  useEffect(() => {
    fetchFoodTruck();
  }, [foodTruckId]);

  return (
    <DetailContainer>
      <Header />
      <TextDiv>
        <div className="title">
          타코야
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
      </TextDiv>
      <br />
      <MenuCardContainer>
        <MenuCard>
          <div className="image-container">
            <img src="/assets/festival/contentsImg/chicken.jpeg" alt="치킨" />
          </div>
          <div className="menu-info">
            <div className="name">통귤탕후루</div>
            <div className="price">3,000원</div>
          </div>
        </MenuCard>
        <MenuCard>
          <div className="image-container">
            <img src="/assets/festival/contentsImg/chicken.jpeg" alt="치킨" />
          </div>
          <div className="menu-info">
            <div className="name">통귤탕후루</div>
            <div className="price">3,000원</div>
          </div>
        </MenuCard>
        <MenuCard>
          <div className="image-container">
            <img src="/assets/festival/contentsImg/chicken.jpeg" alt="치킨" />
          </div>
          <div className="menu-info">
            <div className="name">통귤탕후루</div>
            <div className="price">3,000원</div>
          </div>
        </MenuCard>
        <MenuCard>
          <div className="image-container">
            <img src="/assets/festival/contentsImg/chicken.jpeg" alt="치킨" />
          </div>
          <div className="menu-info">
            <div className="name">통귤탕후루</div>
            <div className="price">3,000원</div>
          </div>
        </MenuCard>
      </MenuCardContainer>
      <PrevButton
        src="/assets/festival/prev-button.png"
        alt="Prev button"
        onClick={() => navigate('/festival/foodtruck')}
      />
    </DetailContainer>
  );
};

export default FoodTruckPage;
