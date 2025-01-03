import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FoodTruckCard from './FoodTruckCard';
import { useNavigate } from 'react-router-dom';
import { instance } from '../../api/instance';
import { UNIV_STATE } from '../../constants/collegeState';
import Loader from '../common/Loader';

const FoodTruck = () => {
  const navigate = useNavigate();
  const [foodTruckList, setFoodTruckList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState('');

  useEffect(() => {
    const getDomain = async () => {
      try {
        const res = await instance.get('/univ/check/univ-domain');
        if (res.data?.length > 1) setSchool('전남대학교');
        else {
          UNIV_STATE.forEach((univ) => {
            if (res.data[0].includes(univ.id)) setSchool(univ.name);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDomain();
  }, []);

  useEffect(() => {
    const fetchFoodtruckInfo = async () => {
      if (school === '') return;
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

    fetchFoodtruckInfo();
  }, [school]);

  // const calculateDDay = (targetDate) => {
  //   const today = new Date();
  //   const target = new Date(targetDate);
  //   const daysLeft = target.getDate() - today.getDate();

  //   if (daysLeft < 1) {
  //     return 'Day';
  //   }

  //   return daysLeft;
  // };

  // const dDay = calculateDDay('2024-05-22');

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <WrapCards>
          {foodTruckList.length === 0 ? (
            <div>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <img src="/assets/empty-festival.svg" alt="empty data" />
                <div style={{ fontWeight: 600, fontSize: '20px' }}>
                  축제 기간이 아닙니다!
                </div>
              </div>
            </div>
          ) : (
            foodTruckList.map((foodTruck) => (
              <FoodTruckCard
                key={foodTruck.foodTruckId}
                foodTruckImage={foodTruck.foodTruckImageUrl}
                foodTruckName={foodTruck.truckName}
                description={foodTruck.description}
                onClick={() =>
                  navigate(`/festival/foodtruck/${foodTruck.foodTruckId}`)
                }
              />
            ))
          )}
        </WrapCards>
      )}
      {/* <EmptyContainer>
        <div className="wrap">
          <img src={'/assets/empty-festival.svg'} alt="empty icon" />
          <div>
            {school === '경희대학교' ? 'MASTERPEACE : Highlight' : '서랑제'}{' '}
            축제까지
          </div>
          <span>D-{dDay}</span>
        </div>
      </EmptyContainer> */}
    </>
  );
};

export default FoodTruck;

const WrapCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// const EmptyContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: 65vh;

//   > .wrap {
//     text-align: center;

//     > img {
//       margin-bottom: 1rem;
//     }

//     > div {
//       color: #333333;
//       text-align: center;
//       font-size: 1.2rem;
//       font-weight: 800;
//     }

//     > span {
//       background: linear-gradient(#ff3f38 0%, #ffb1ae 100%);
//       background-clip: text;
//       -webkit-background-clip: text;
//       color: transparent;
//       font-size: 2rem;
//       font-weight: 600;
//     }
//   }
// `;
