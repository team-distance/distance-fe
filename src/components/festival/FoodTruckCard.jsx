import React from 'react';
import styled from 'styled-components';

const WrapCard = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
  height: 100px;
  border-radius: 12px;
  box-shadow: 0px 5px 10px 1px rgba(51, 51, 51, 0.2);
  overflow: hidden;

  .truck {
    min-width: 100px;
    max-width: 100px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextDiv = styled.div`
  width: 100%;

  .title {
    color: #000000;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.4px;
  }

  .menus {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #000000;
    font-size: 12px;
    font-weight: 200;
    letter-spacing: -0.4px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    img {
      width: 0.8rem;
      padding-right: 0.2rem;
    }
  }
`;

const FoodTruckCard = ({
  foodTruckImage,
  foodTruckName,
  description,
  onClick,
}) => {
  return (
    <WrapCard onClick={onClick}>
      <img className="truck" src={foodTruckImage} alt="food truck" />
      <TextDiv>
        <div className="title">{foodTruckName}</div>
        <div className="menus">
          <img src="/assets/festival/icon-truck.svg" alt="truck icon" />
          <div>{description}</div>
        </div>
        <br />
      </TextDiv>
    </WrapCard>
  );
};

export default FoodTruckCard;
