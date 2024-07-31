import { Link, Route, Routes } from 'react-router-dom';
import HomeIndexPage from './pages/home/HomeIndexPage';
import ChatIndexPage from './pages/chat/ChatIndexPage';
import FestivalIndexPage from './pages/festival/FestivalIndexPage';
import MyIndexPage from './pages/mypage/MyIndexPage';
import UserRegisterPage from './pages/register/UserRegisterPage';
import UnivRegisterPage from './pages/register/UnivRegisterPage';
import DonePage from './pages/register/DonePage';
import ProfileRegisterPage from './pages/register/ProfileRegisterPage';
import ChatPage from './pages/chat/ChatPage';
import NavLayout from './layouts/NavLayout';
import LoginPage from './pages/root/LoginPage';
import ProfileEditPage from './pages/mypage/ProfileEditPage';
import ChatInboxPage from './pages/chat/ChatInboxPage';
import Program from './components/festival/Program';
import VerifyMobileIdPage from './pages/verify/VerifyMobileIdPage';
import VerifyOptionsPage from './pages/verify/VerifyOptionsPage';
import VerifyEmailPage from './pages/verify/VerifyEmailPage';
import VerifyIdPage from './pages/verify/VerifyIdPage';
import NotificationSolutionPage from './pages/root/NotificationSolutionPage';
import FoodTruck from './components/festival/FoodTruck';
import FoodTruckPage from './pages/festival/FoodTruckPage';
import KakaotalkFallback from './pages/root/KakaotalkFallback';
import AccountEditPage from './pages/mypage/AccountEditPage';
import DropoutPage from './pages/mypage/DropoutPage';
import { useEffect } from 'react';
import { registerServiceWorker } from './firebaseConfig';
import PrivacyPolicyPage from './pages/root/PrivacyPolicyPage';
import ResetPassword from './pages/root/ResetPassword';
import NotFoundPage from './pages/root/NotFoundPage';
import useGPS from './hooks/useGPS';
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from './store/auth';
import { instance } from './api/instance';
import TeamIntroductionPage from './pages/mypage/TeamIntroductionPage';
import GPSSolutionPage from './pages/root/GPSSolutionPage';
import useRouteChangeTrack from './hooks/useRouteChangeTrack';
import {useToast} from './hooks/useToast';

function App() {
  useRouteChangeTrack();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const currentLocation = useGPS(isLoggedIn);

  //토스트 메세지
  const { showToast: showAlarmGPSErrorToast } = useToast(
    () => <>
      <span style={{ marginRight: '8px' }}>알림과 위치 설정이 꺼져있어요!</span>
      <Link to="/mypage" style={{ color: '#0096FF' }}>
        해결하기
      </Link>
    </>, 'alarm-gps-disabled'
  )
  const { showToast: showGPSUpdateErrorToast } = useToast(
    () => <span>위치 정보를 업데이트하는데 실패했어요!</span>, 'gps-update-error'
  )

  useEffect(() => {
    registerServiceWorker();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (currentLocation.error || ('Notification' in window && Notification.permission !== 'granted')) {
      showAlarmGPSErrorToast();
    } else if (currentLocation.lat === 0 || currentLocation.lng === 0) {
      return;
    } else {
      instance
        .post('/gps/update', {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        })
        .catch((err) => {
          showGPSUpdateErrorToast();
          console.log(err);
        });
    }
  }, [currentLocation]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/password" element={<ResetPassword />} />

      <Route path="/notification" element={<NotificationSolutionPage />} />
      <Route path="/gps" element={<GPSSolutionPage />} />

      <Route path="/register/user" element={<UserRegisterPage />} />
      <Route path="/register/univ" element={<UnivRegisterPage />} />
      <Route path="/register/profile" element={<ProfileRegisterPage />} />
      <Route path="/register/done" element={<DonePage />} />

      <Route path="/verify/univ" element={<VerifyOptionsPage />} />
      <Route path="/verify/univ/mobileid" element={<VerifyMobileIdPage />} />
      <Route path="/verify/univ/email" element={<VerifyEmailPage />} />
      <Route path="/verify/univ/id" element={<VerifyIdPage />} />

      <Route element={<NavLayout />}>
        <Route path="/" element={<HomeIndexPage />} />

        <Route path="/chat" element={<ChatIndexPage />} />
        <Route path="/inbox" element={<ChatInboxPage />} />

        <Route element={<FestivalIndexPage />}>
          <Route path="/festival/program" element={<Program />} />
          <Route path="/festival/foodtruck" element={<FoodTruck />} />
        </Route>

        <Route path="/mypage" element={<MyIndexPage />} />
      </Route>

      <Route path="/team-introduction" element={<TeamIntroductionPage />} />

      <Route path="/mypage/profile" element={<ProfileEditPage />} />
      <Route path="/mypage/account" element={<AccountEditPage />} />
      <Route path="/mypage/account/dropout" element={<DropoutPage />} />

      <Route path="/festival/foodtruck/:id" element={<FoodTruckPage />} />

      <Route path="/chat/:chatRoomId" element={<ChatPage />} />

      <Route path="/kakaotalk-fallback" element={<KakaotalkFallback />} />

      <Route path="/privacy" element={<PrivacyPolicyPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
