import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TabBar from "../components/common/TabBar";
import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoggedInState } from "../store/auth";
import { instance } from "../api/instance";
import toast, { Toaster } from "react-hot-toast";
import useGPS from "../hooks/useGPS";
import { myDataState } from "../store/myData";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebaseConfig";

const NavLayout = () => {
  const setMyData = useSetRecoilState(myDataState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const currentLocation = useGPS();
  const navigate = useNavigate();
  const userAgent = navigator.userAgent.toLowerCase();
  const isIphone = userAgent.includes("iphone");

  const getMemberId = async () => {
    await instance
      .get("/member/id")
      .then((res) => {
        localStorage.setItem("memberId", res.data);
      })
      .catch((err) => {
        toast.error("회원 정보를 가져오는데 실패했어요!", {
          id: "member-id-error",
          position: "bottom-center",
        });
        console.log(err);
      });
  };

  const getMyData = async () => {
    await instance
      .get(`/member/profile`)
      .then((res) => {
        setMyData(res.data);
      })
      .catch((err) => {
        toast.error("프로필 정보를 가져오는데 실패했어요!", {
          id: "my-data-error",
          position: "bottom-center",
        });
        console.log(err);
      });
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("kakao")) {
      navigate("/kakaotalk-fallback");
    }
  }, []);

  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("FOREGROUND MESSAGE RECEIVED", payload);
        const notificationTitle = payload.notification.title; // 메시지에서 제목 추출
        const notificationBody = payload.notification.body; // 메시지에서 본문 추출

        const toastId = toast.custom(
          <ToastContainer
            onClick={() => {
              navigate("/chat");
              toast.remove();
            }}>
            <ToastSectionLeft>
              <ToastIcon
                src={payload.notification.image}
                alt="디스턴스 아이콘"
              />
              <ToastContent>
                <ToastTitle>{notificationTitle}</ToastTitle>
                <ToastBody>{notificationBody}</ToastBody>
              </ToastContent>
            </ToastSectionLeft>
            <ToastSectionRight>
              <ToastCloseButton
                onClick={(e) => {
                  e.stopPropagation();
                  toast.remove();
                }}>
                <img src="/assets/cancel-button-gray.svg" alt="닫기 아이콘" />
              </ToastCloseButton>
            </ToastSectionRight>
          </ToastContainer>,
          {
            duration: 5000,
            position: "top-center",
          }
        );
        // 화면에 한개의 토스트만 띄우기 위해 이전 토스트를 지우는 코드
        toast.remove(String(+toastId - 1));
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMemberIdAndMyData = async () => {
      await getMemberId();
      await getMyData();
    };

    fetchMemberIdAndMyData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (currentLocation.error) {
      toast.error(
        "위치 정보를 가져오는데 실패했어요! 설정에서 위치 정보를 허용해주세요.",
        {
          id: "gps-error",
          position: "bottom-center",
        }
      );
    } else {
      instance
        .post(`/gps/update`, {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        })
        .catch((err) => {
          toast.error("위치 정보를 업데이트하는데 실패했어요!", {
            id: "gps-update-error",
            position: "bottom-center",
          });
          console.log(err);
        });
    }
  }, [currentLocation]);

  return (
    <>
      <Padding $isIphone={isIphone}>
        <Outlet />
      </Padding>
      <TabBar />
      <Toaster
        containerStyle={{
          bottom: isIphone ? "116px" : "96px",
        }}
      />
    </>
  );
};

const Padding = styled.div`
  padding-bottom: ${(props) => (props.$isIphone ? "96px" : "74px")};
`;

const ToastContainer = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToastSectionLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ToastSectionRight = styled.div`
  display: flex;
  align-items: center;
`;

const ToastIcon = styled.img`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  margin-right: 16px;
`;

const ToastContent = styled.div``;

const ToastTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const ToastCloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: none;

  img {
    width: 16px;
    height: 16px;
    -webkit-tap-highlight-color: transparent;
  }
`;

const ToastBody = styled.div`
  font-size: 14px;
  color: #333333;

  // wrap content
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all; // 문단으로 끊어져서 줄바꿈 됨
`;

export default NavLayout;
