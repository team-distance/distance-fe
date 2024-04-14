import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

export const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    console.log("서비스 워커 등록 성공", registration);
  } catch (error) {
    console.log("서비스 워커 등록 실패", error);
  }
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
export const onGetToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BA_KtCviBslZEFupMHZwhzFX10LdjtJtMLAzRRTJ4mv-GuoERIyz4G0_i4WC4tIManqSnrPkzWvcFfEAWEw9YSM",
  });
};

// 포그라운드 메시지 수신
// (messaging이 초기화 되었다면, onMessage()를 호출하여 메시지 수신)
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("FOREGROUND MESSAGE RECEIVED", payload);
    // 알림 권한이 허용되었다면, 사용자에게 알림 표시
    if (Notification.permission === "granted") {
      const currentLocation = window.location.href;
      const notificationTitle = payload.notification.title; // 메시지에서 제목 추출
      const notificationOptions = {
        body: payload.notification.body, // 메시지에서 본문 추출
        icon: payload.notification.image, // 메시지에서 아이콘 URL 추출 (선택 사항)
      };

      if (!currentLocation.includes("/chat/" + payload.data.chatRoomId)) {
        new Notification(notificationTitle, notificationOptions);
      }
    }
  });
}
