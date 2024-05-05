// import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// import FoodTruckCard from './FoodTruckCard';
// import { useNavigate } from 'react-router-dom';
// import { instance } from '../../api/instance';
// import ClipLoader from 'react-spinners/ClipLoader';

const FoodTruck = () => {
  // const navigate = useNavigate();
  // const [foodTruckList, setFoodTruckList] = useState([]);
  // const [loading, setLoading] = useState(false);

  // const fetchFoodtruckInfo = async () => {
  //   let school = '순천향대학교';
  //   try {
  //     setLoading(true);
  //     const res = await instance.get(`/food-truck?school=${school}`);
  //     setFoodTruckList(res.data);
  //     console.log('res', res.data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchFoodtruckInfo();
  // }, []);

  //디데이
  const calculateDDay = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const daysLeft = target.getDate() - today.getDate();

    if (daysLeft < 1) {
      return 'Day';
    }

    return daysLeft;
  };

  const dDay = calculateDDay('2024-05-07');

  return (
    <>
      {/* {loading ? (
        <LoaderContainer>
          <ClipLoader color={'#FF625D'} loading={loading} size={50} />
        </LoaderContainer>
      ) : (
        <WrapCards>
          {foodTruckList.map((foodTruck) => (
            <FoodTruckCard
              key={foodTruck.foodTruckId}
              foodTruckImage={foodTruck.foodTruckImageUrl}
              foodTruckName={foodTruck.truckName}
              onClick={() =>
                navigate(`/festival/foodtruck/${foodTruck.foodTruckId}`)
              }
            />
          ))}
        </WrapCards>
      )} */}
      <EmptyContainer>
        <div className="wrap">
          <img src={'/assets/empty-festival.svg'} alt="empty icon" />
          <div>피닉시아 축제까지</div>
          <span>D-{dDay}</span>
        </div>
      </EmptyContainer>
    </>
  );
};

export default FoodTruck;

// const WrapCards = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const LoaderContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 999;
// `;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65vh;

  > .wrap {
    text-align: center;

    > img {
      margin-bottom: 1rem;
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 800;
    }

    > span {
      background: linear-gradient(#ff3f38 0%, #ffb1ae 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-size: 2rem;
      font-weight: 600;
    }
  }
`;
