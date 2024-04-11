import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TabBar from "../components/common/TabBar";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState } from "../store/auth";
import { authInstance } from "../api/instance";
import toast, { Toaster } from "react-hot-toast";
import useGPS from "../hooks/useGPS";
import { myDataState } from "../store/myData";
import { onGetToken, registerServiceWorker } from "../firebaseConfig";

const NavLayout = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setMyData = useSetRecoilState(myDataState);
  const currentLocation = useGPS();
  const navigate = useNavigate();
  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = userAgent.includes("iphone");

  const getMemberId = async () => {
    await authInstance
      .get("/member/id")
      .then((res) => {
        localStorage.setItem("memberId", res.data);
      })
      .catch((err) => {
        toast.error("회원 정보를 가져오는데 실패했어요!");
        console.log(err);
      });
  };

  const getMyData = async () => {
    await authInstance
      .get(`/member/profile`)
      .then((res) => {
        setMyData(res.data);
      })
      .catch((err) => {
        toast.error("프로필 정보를 가져오는데 실패했어요!");
        console.log(err);
      });
  };

  useEffect(() => {
    // Firebase 초기화
    // 카카오톡 브라우저에서는 Firebase Messaging을 지원하지 않기 때문에
    // 카카오톡 브라우저인지 확인 후 Firebase Messaging을 초기화
    const initializeFirebase = async () => {
      await registerServiceWorker();
      await onGetToken();
    };

    initializeFirebase()
      .then((res) => console.log(res))
      .catch((err) => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (!userAgent.includes("kakao")) {
          navigate("/kakaotalk-fallback");
        } else {
          toast.error("Firebase Messaging 초기화에 실패했어요!");
          console.log(err);
        }
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchMemberIdAndMyData = async () => {
      await getMemberId();
      await getMyData();
    };

    fetchMemberIdAndMyData();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (currentLocation.error) {
      toast.error(
        "위치 정보를 가져오는데 실패했어요! 앱 종료 후 다시 시도해주세요."
      );
    } else {
      const memberId = localStorage.getItem("memberId");
      if (memberId) {
        authInstance
          .post(`/gps/update`, {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          })
          .catch((err) => {
            toast.error("위치 정보를 업데이트하는데 실패했어요!");
            console.log(err);
          });
      }
    }
  }, [currentLocation]);

  return (
    <>
      <Padding $isIphone={isIphone}>
        <Outlet />
      </Padding>
      <TabBar />
      <Toaster position="bottom-center" />
    </>
  );
};

const Padding = styled.div`
  padding-bottom: ${(props) => (props.$isIphone ? "96px" : "74px")};
`;

export default NavLayout;
