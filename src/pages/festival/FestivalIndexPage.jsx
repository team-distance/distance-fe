import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import { Outlet } from 'react-router-dom';

import Header from '../../components/common/Header';

const FestivalContainer = styled.div`
  padding: 2rem 1.5rem;
`;
const TabMenu = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;
const Tab = styled.div`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  border-bottom: ${(props) =>
    props.$isSelected ? '3px solid #FF625D' : '3px solid transparent'};
  transition: all 200ms;
`;

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

const FestivalIndexPage = () => {
  const navigate = useNavigate();

  const [tabMenuState, setTabMenuState] = useState(0);

  const handleClickProgram = () => {
    navigate('/festival/program');
    setTabMenuState(0);
  };
  const handleClickFoodTruck = () => {
    navigate('/festival/foodtruck');
    setTabMenuState(1);
  };

  const calculateDDay = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const difference = target - today;
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days;
  };
  const dDay = calculateDDay('2024-5-7');

  return (
    <FestivalContainer>
      <Header />
      <TabMenu>
        <Tab $isSelected={tabMenuState === 0} onClick={handleClickProgram}>
          프로그램
        </Tab>
        <Tab $isSelected={tabMenuState === 1} onClick={handleClickFoodTruck}>
          푸드트럭
        </Tab>
      </TabMenu>
      <EmptyContainer>
        <div className="wrap">
          <img src={'/assets/empty-festival.svg'} alt="empty icon" />
          <div>피닉시아 축제까지</div>
          <span>D-{dDay}</span>
        </div>
      </EmptyContainer>
      {/* <Outlet /> */}
    </FestivalContainer>
  );
};

export default FestivalIndexPage;
