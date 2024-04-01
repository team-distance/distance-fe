import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

navigator.serviceWorker.register("/firebase-messaging-sw.js");

const firebaseConfig = {
  apiKey: "%%REACT_APP_FIREBASE_API_KEY%%",
  authDomain: "%%REACT_APP_FIREBASE_AUTH_DOMAIN%%",
  projectId: "%%REACT_APP_FIREBASE_PROJECT_ID%%",
  storageBucket: "%%REACT_APP_FIREBASE_STORAGE_BUCKET%%",
  messagingSenderId: "%%REACT_APP_FIREBASE_MESSAGING_SENDER_ID%%",
  appId: "%%REACT_APP_FIREBASE_APP_ID%%",
  measurementId: "%%REACT_APP_FIREBASE_MEASUREMENT_ID%%",
};

// firebase 앱 초기화
const FBapp = initializeApp(firebaseConfig);
const messaging = getMessaging(FBapp);

// client 토큰 발급 받기
export const onGetToken = async () => {
  console.log(messaging);
  return getToken(messaging, {
    vapidKey: "%%REACT_APP_FIREBASE_VAPID_KEY%%",
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

// Notification.requestPermission().then(permission => {
//   if (permission === "granted") {
//     console.log("알림 권한이 허용되었습니다.");
//   } else {
//     console.log("알림 권한이 거부되었습니다.");
//   }
// });

//포그라운드 메시지 수신
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // 알림 권한이 허용되었다면, 사용자에게 알림 표시
  if (Notification.permission === "granted") {
    console.log("Hi");
    const notificationTitle = payload.notification.title; // 메시지에서 제목 추출
    const notificationOptions = {
      body: payload.notification.body, // 메시지에서 본문 추출
      // icon: payload.notification.icon, // 메시지에서 아이콘 URL 추출 (선택 사항)
      // 필요에 따라 여기에 더 많은 옵션을 추가할 수 있습니다.
    };

    new Notification(notificationTitle, notificationOptions);
  }
});
