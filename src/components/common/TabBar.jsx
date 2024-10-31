import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { tabState } from '../../store/tabState';

/**
 * @todo 사용하지 않는 아이콘 svg 파일 제거
 */
const BottomNavBar = () => {
  const [currentPage, setCurrentPage] = useState('/');
  const location = useLocation();

  const setTabMenuState = useSetRecoilState(tabState);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  const menus = [
    {
      name: '홈',
      path: '/',
      icon: '/assets/icon/icon-home-stroked.svg',
      iconActive: '/assets/icon/icon-home-filled.svg',
    },
    {
      name: '채팅',
      path: '/chat',
      alternative: '/inbox',
      icon: '/assets/icon/icon-chat-stroked.svg',
      iconActive: '/assets/icon/icon-chat-filled.svg',
    },
    {
      name: '학교행사',
      path: '/event',
      icon: '/assets/icon/icon-festival-stroked.svg',
      iconActive: '/assets/icon/icon-festival-filled.svg',
    },
    // {
    //   name: '페스티벌',
    //   path: '/festival/program',
    //   alternative: '/festival/foodtruck',
    //   icon: '/assets/icon/icon-festival-stroked.svg',
    //   iconActive: '/assets/icon/icon-festival-filled.svg',
    // },
    {
      name: '마이페이지',
      path: '/mypage',
      icon: '/assets/icon/icon-mypage-stroked.svg',
      iconActive: '/assets/icon/icon-mypage-filled.svg',
    },
  ];

  return (
    <StyledNav>
      <WrapItem>
        {menus.map((item) => (
          <NavItem
            to={item.path}
            key={item.name}
            onClick={() => {
              setTabMenuState(0);
            }}
          >
            <img
              src={
                currentPage === item.path || currentPage === item?.alternative
                  ? item.iconActive
                  : item.icon
              }
              alt={item.name}
            />
            <Label
              color={
                currentPage === item.path || currentPage === item?.alternative
                  ? '#FF625D'
                  : '#767676'
              }
            >
              {item.name}
            </Label>
          </NavItem>
        ))}
      </WrapItem>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  width: 100%;
  background-color: #fff;
  border-top: #ededed solid 1px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);

  // env(safe-area-inset-bottom) : 대략 34px
  // 기존 사용하던 padding-bottom 값은 22px
  // 34px은 너무 높아서 22px로 조정
  padding-bottom: calc(env(safe-area-inset-bottom) - 12px);
`;

const WrapItem = styled.div`
  display: flex;
  width: 90%;
`;

const NavItem = styled(Link)`
  text-align: center;
  width: 100%;
  padding: 16px 0;
  text-decoration: none;

  img {
    -webkit-tap-highlight-color: transparent;
  }
`;

const Label = styled.div`
  color: ${(props) => props.color};
  font-size: 12px;
`;

export default BottomNavBar;
