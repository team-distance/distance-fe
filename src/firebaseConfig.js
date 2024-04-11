import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

export const registerServiceWorker = async () => {
  await navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => console.log("서비스 워커 등록 성공", registration))
    .catch((err) => console.log("서비스 워커 등록 실패", err));
};

const firebaseConfig = {
  apiKey: "AIzaSyDydUUUAK6jb1mEdIKqMGayiKMOSt6FUPY",
  authDomain: "distance-97455.firebaseapp.com",
  projectId: "distance-97455",
  storageBucket: "distance-97455.appspot.com",
  messagingSenderId: "53582616929",
  appId: "1:53582616929:web:d737260d7953182dab8d20",
  measurementId: "G-7QPW9Z4QCJ",
};

// firebase 앱 초기화
const FBapp = initializeApp(firebaseConfig);

// firebase를 지원하는 브라우저인지 확인하고 getMessaging()을 호출
// (카카오톡 인앱 브라우저 대응)
const isFirebaseSupported = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(FBapp) : null;
};

const messaging = await isFirebaseSupported();

// client 토큰 발급 받기
export const onGetToken = async () => {
  console.log(messaging);
  return getToken(messaging, {
    vapidKey:
      "BA_KtCviBslZEFupMHZwhzFX10LdjtJtMLAzRRTJ4mv-GuoERIyz4G0_i4WC4tIManqSnrPkzWvcFfEAWEw9YSM",
  })
    .then((currentToken) => {
      if (currentToken) {
        localStorage.setItem("clientToken", currentToken);
      } else {
        console.log("토큰 발급 실패");
      }
    })
    .catch((err) => {
      console.log("토큰 발급 에러 발생 : ", err);
    });
};

// 포그라운드 메시지 수신
// (messaging이 초기화 되었다면, onMessage()를 호출하여 메시지 수신)
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload);
    // 알림 권한이 허용되었다면, 사용자에게 알림 표시
    if (Notification.permission === "granted") {
      const currentLocation = window.location.href;
      const notificationTitle = payload.notification.title; // 메시지에서 제목 추출
      const notificationOptions = {
        body: payload.notification.body, // 메시지에서 본문 추출
        // icon: payload.notification.icon, // 메시지에서 아이콘 URL 추출 (선택 사항)
        // 필요에 따라 여기에 더 많은 옵션을 추가할 수 있습니다.
      };

      if (!currentLocation.includes("/chat/" + payload.data.chatRoomId)) {
        new Notification(notificationTitle, notificationOptions);
      }
    }
  });
}
