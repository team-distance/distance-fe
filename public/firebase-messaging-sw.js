//public/firebase-messaging-sw.js

importScripts(
  'https://www.gstatic.com/firebasejs/10.2.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging-compat.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyDydUUUAK6jb1mEdIKqMGayiKMOSt6FUPY',
  authDomain: 'distance-97455.firebaseapp.com',
  projectId: 'distance-97455',
  storageBucket: 'distance-97455.appspot.com',
  messagingSenderId: '53582616929',
  appId: '1:53582616929:web:d737260d7953182dab8d20',
  measurementId: 'G-7QPW9Z4QCJ',
};

// Initialize Firebase
const FBapp = firebase.initializeApp(firebaseConfig);
const messaging = FBapp.messaging();

// 대기 중인 서비스 워커를 강제로 활성화
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

// 클라이언트가 페이지를 새로 고침하거나 페이지를 방문할 때마다 서비스 워커를 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log('BACKGROUND MESSAGE RECEIVED', payload);

  // 알림 제목 및 본문 설정
  const title = payload.data.title;

  const notificationOptions = {
    body: payload.data.body,
    icon: 'https://placehold.co/400',
  };

  // 알림 표시
  self.registration.showNotification(title, notificationOptions);
});

// self.addEventListener("notificationclick", function (event) {
//   console.log("Notification Clicked", event);

//   // 알림 창 닫기
//   event.preventDefault();
//   event.notification.close();

//   // '/chat' 라우트로 사용자를 이동시킵니다.
//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((windowClients) => {
//       // 이미 '/chat' 페이지가 열려있는 탭이 있는지 확인합니다.
//       for (var i = 0; i < windowClients.length; i++) {
//         var client = windowClients[i];
//         // 여기서는 단순화를 위해 모든 경로를 검사하지 않습니다.
//         // 실제로는 client.url을 검사하여 적절히 처리할 필요가 있을 수 있습니다.
//         if (client.url.includes("/chat") && "focus" in client) {
//           return client.focus();
//         }
//       }
//       // '/chat' 페이지가 열려있는 탭이 없으면 새 탭에서 엽니다.
//       if (clients.openWindow) {
//         return clients.openWindow("/chat");
//       }
//     })
//   );
// });
