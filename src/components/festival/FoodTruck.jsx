import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FoodTruckCard from './FoodTruckCard';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';

const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FoodTruck = () => {
  const navigate = useNavigate();
  const [foodTruckList, setFoodTruckList] = useState([]);

  const fetchFoodtruckInfo = async () => {
    let school = '순천향대학교';
    try {
      const res = await instance.get(`/food-truck?school=${school}`);
      setFoodTruckList(res.data);
      console.log('res', res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFoodtruckInfo();
  }, []);

  return (
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
  );
};

export default FoodTruck;
