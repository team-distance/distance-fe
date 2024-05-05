import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FoodTruckCard from './FoodTruckCard';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import ClipLoader from 'react-spinners/ClipLoader';

const FoodTruck = () => {
  const navigate = useNavigate();
  const [foodTruckList, setFoodTruckList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFoodtruckInfo = async () => {
    let school = '순천향대학교';
    try {
      setLoading(true);
      const res = await instance.get(`/food-truck?school=${school}`);
      setFoodTruckList(res.data);
      console.log('res', res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodtruckInfo();
  }, []);

  return (
    <>
      {loading ? (
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
      )}
    </>
  );
};

export default FoodTruck;

const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
