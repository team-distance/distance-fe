import React from 'react';
import styled from 'styled-components';
import FoodTruckCard from './FoodTruckCard';
import { useNavigate } from 'react-router-dom';

const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FoodTruck = () => {
  const navigate = useNavigate();
  const content = [
    {
      title: '타코야',
      img: '/assets/festival/contentsImg/opening.jpeg',
      foods: '오리지날 타코야끼, 치즈 타코야끼',
    },
    {
      title: '피자마루',
      img: '/assets/festival/contentsImg/chicken.jpeg',
      foods: '페퍼로니 피자, 치즈 피자, 콤비네이션 피자',
    },
    {
      title: '커피프렌즈',
      img: '/assets/festival/contentsImg/awards.jpeg',
      foods: '아메리카노, 카페라떼, 카푸치노',
    },
    {
      title: '햄버거',
      img: '/assets/festival/contentsImg/demobooth.jpeg',
      foods: '치즈버거, 더블버거, 치킨버거',
    },
  ];

  return (
    <WrapCards>
      {content.map((food, idx) => (
        <FoodTruckCard
          key={idx}
          onClick={() => navigate(`/festival/foodtruck/${idx}`)}
          content={food}
        />
      ))}
    </WrapCards>
  );
};

export default FoodTruck;
