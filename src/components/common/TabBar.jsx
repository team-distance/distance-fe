import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

/**
 * @todo 사용하지 않는 아이콘 svg 파일 제거
 */
const BottomNavBar = () => {
  const [currentPage, setCurrentPage] = useState("/");
  const location = useLocation();
  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = userAgent.includes("iphone");

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location]);

  const menus = [
    {
      name: "홈",
      path: "/",
      icon: "/assets/icon/icon-home-stroked.svg",
      iconActive: "/assets/icon/icon-home-filled.svg",
    },
    {
      name: "채팅",
      path: "/chat",
      alternative: "/inbox",
      icon: "/assets/icon/icon-chat-stroked.svg",
      iconActive: "/assets/icon/icon-chat-filled.svg",
    },
    {
      name: "페스티벌",
      path: "/festival/program",
      alternative: "/festival/foodtruck",
      icon: "/assets/icon/icon-festival-stroked.svg",
      iconActive: "/assets/icon/icon-festival-filled.svg",
    },
    {
      name: "마이페이지",
      path: "/mypage",
      icon: "/assets/icon/icon-mypage-stroked.svg",
      iconActive: "/assets/icon/icon-mypage-filled.svg",
    },
  ];

  return (
    <StyledNav $isPhone={isIphone}>
      <WrapItem>
        {menus.map((item) => (
          <NavItem to={item.path} key={item.name}>
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
                  ? "#FF625D"
                  : "#767676"
              }>
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
  z-index: 9999;
  width: 100%;
  background-color: #fff;
  border-top: #ededed solid 1px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding-bottom: ${(props) => (props.$isPhone ? "22px" : "0")};
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
