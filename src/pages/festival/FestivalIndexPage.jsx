import React from 'react';
import styled from 'styled-components';
import { Outlet, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { tabState } from '../../store/tabState';
import { isLoggedInState } from '../../store/auth';

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
  height: 72vh;

  > .wrap {
    text-align: center; // 텍스트를 중앙 정렬합니다.

    > img {
      margin-bottom: 1rem; // 아이콘과 텍스트 사이의 간격을 조정합니다.
    }

    > div {
      color: #333333;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
  }
`;

const FestivalIndexPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const [tabMenuState, setTabMenuState] = useRecoilState(tabState);

  const handleClickProgram = () => {
    navigate('/festival/program');
    setTabMenuState(0);
  };
  const handleClickFoodTruck = () => {
    navigate('/festival/foodtruck');
    setTabMenuState(1);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <TabMenu>
            <Tab $isSelected={tabMenuState === 0} onClick={handleClickProgram}>
              프로그램
            </Tab>
            <Tab
              $isSelected={tabMenuState === 1}
              onClick={handleClickFoodTruck}
            >
              푸드트럭
            </Tab>
          </TabMenu>
          <Outlet />
        </>
      ) : (
        <EmptyContainer>
          <div className="wrap">
            <img src={'/assets/access-denied-mypage.svg'} alt="access denied" />
            <div>로그인 후 이용해주세요!</div>
          </div>
        </EmptyContainer>
      )}
    </>
  );
};

export default FestivalIndexPage;
