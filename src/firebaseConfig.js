import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';

export const registerServiceWorker = async () => {
  try {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' }
    );
    console.log('서비스 워커 등록 성공', registration);
    console.log('서비스 워커 스코프: ', registration.scope);
  } catch (error) {
    console.log('서비스 워커 등록 실패', error);
  }

  const userAgent = navigator.userAgent;

  navigator.serviceWorker.controller.postMessage({
    type: 'USER_AGENT',
    payload: { userAgent },
  });
};

const firebaseConfig = {
  apiKey: 'AIzaSyDydUUUAK6jb1mEdIKqMGayiKMOSt6FUPY',
  authDomain: 'distance-97455.firebaseapp.com',
  projectId: 'distance-97455',
  storageBucket: 'distance-97455.appspot.com',
  messagingSenderId: '53582616929',
  appId: '1:53582616929:web:d737260d7953182dab8d20',
  measurementId: 'G-7QPW9Z4QCJ',
};

// firebase 앱 초기화
const FBapp = initializeApp(firebaseConfig);

// firebase를 지원하는 브라우저인지 확인하고 getMessaging()을 호출
// (카카오톡 인앱 브라우저 대응)
const isFirebaseSupported = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(FBapp) : null;
};

export const messaging = await isFirebaseSupported();

// client 토큰 발급 받기
export const onGetToken = () => {
  return getToken(messaging, {
    vapidKey:
      'BA_KtCviBslZEFupMHZwhzFX10LdjtJtMLAzRRTJ4mv-GuoERIyz4G0_i4WC4tIManqSnrPkzWvcFfEAWEw9YSM',
  });
};
