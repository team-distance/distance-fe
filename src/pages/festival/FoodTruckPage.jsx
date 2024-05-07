import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../components/common/Header';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';

const FoodTruckPage = () => {
  const navigate = useNavigate();
  const foodTruckId = useParams();
  const [foodTruckMenus, setFoodTruckMenus] = useState([]);
  const [foodTruckName, setFoodTruckName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFoodTruckMenus = async () => {
    try {
      setLoading(true);
      const res = await instance.get(`/truck-menu/${foodTruckId.id}`);
      setFoodTruckMenus(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 백엔드 API 완성 시 title, text 지정 필요
  const shareButtonHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: foodTruckName,
          text: `${foodTruckName}의 푸드트럭 메뉴를 확인하세요.`,
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
    fetchFoodTruckMenus();
  }, [foodTruckId]);

  useEffect(() => {
    if (foodTruckMenus) {
      if (foodTruckMenus?.length !== 0) {
        const truckName = foodTruckMenus[0].truckName;
        setFoodTruckName(truckName);
      }
    }
    console.log(foodTruckMenus);
  }, [foodTruckMenus]);

  return (
    <>
      {loading ? (
        <LoaderContainer>
          <ClipLoader color={'#FF625D'} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <DetailContainer>
          <Header />
          <TextDiv>
            <div className="title">
              {foodTruckName}
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
            {foodTruckMenus &&
              foodTruckMenus.map((menu) => (
                <MenuCard key={menu.truckMenuId}>
                  <div className="image-container">
                    <img src={menu.menuImageUrl} alt={menu.menu} />
                  </div>
                  <div className="menu-info">
                    <div className="name">{menu.menu}</div>
                    <div className="price">{menu.price}</div>
                  </div>
                </MenuCard>
              ))}
          </MenuCardContainer>
          <PrevButton
            src="/assets/festival/prev-button.png"
            alt="Prev button"
            onClick={() => navigate('/festival/foodtruck')}
          />
        </DetailContainer>
      )}
    </>
  );
};
export default FoodTruckPage;

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
  overflow: hidden;
  background-color: #fcfcfc;
  box-shadow: 0px 5px 10px 1px rgba(51, 51, 51, 0.2);

  .image-container {
    width: 100%;
    height: 0;
    padding-top: 100%;
    position: relative;
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

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;
