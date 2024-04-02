import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/root/LandingPage";
import HomeIndexPage from "./pages/home/HomeIndexPage";
import ChatIndexPage from "./pages/chat/ChatIndexPage";
import FestivalIndexPage from "./pages/festival/FestivalIndexPage";
import MyIndexPage from "./pages/mypage/MyIndexPage";
import UserRegisterPage from "./pages/register/UserRegisterPage";
import UnivRegisterPage from "./pages/register/UnivRegisterPage";
import DonePage from "./pages/register/DonePage";
import ProfileRegisterPage from "./pages/register/ProfileRegisterPage";
import ChatPage from "./pages/chat/ChatPage";
import NavLayout from "./layouts/NavLayout";
import LoginPage from "./pages/root/LoginPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import ChatInboxPage from "./pages/chat/ChatInboxPage";
import FestivalDetailPage0 from "./pages/festival/FestivalDetailPage0";
import Information from "./components/festival/Information";
import Schedule from "./components/festival/Schedule";
import Program from "./components/festival/Program";
import FestivalDetailPage1 from "./pages/festival/FestivalDetailPage1";
import FestivalDetailPage2 from "./pages/festival/FestivalDetailPage2";
import FestivalDetailPage3 from "./pages/festival/FestivalDetailPage3";
import NotificationAnnouncementPage from "./pages/root/NotificationAnnouncementPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/notification"
          element={<NotificationAnnouncementPage />}
        />

        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/univ" element={<UnivRegisterPage />} />
        <Route path="/register/done" element={<DonePage />} />
        <Route path="/register/profile" element={<ProfileRegisterPage />} />

        <Route element={<NavLayout />}>
          <Route path="/" element={<HomeIndexPage />} />

          <Route path="/chat" element={<ChatIndexPage />} />
          <Route path="/inbox" element={<ChatInboxPage />} />

          <Route element={<FestivalIndexPage />}>
            <Route path="/festival/program" element={<Program />} />
            <Route path="/festival/schedule" element={<Schedule />} />
            <Route path="/festival/information" element={<Information />} />
          </Route>

          <Route path="/mypage" element={<MyIndexPage />} />
          <Route path="/mypage/profile" element={<ProfileEditPage />} />
        </Route>

        <Route path="/festival/detail/0" element={<FestivalDetailPage0 />} />
        <Route path="/festival/detail/1" element={<FestivalDetailPage1 />} />
        <Route path="/festival/detail/2" element={<FestivalDetailPage2 />} />
        <Route path="/festival/detail/3" element={<FestivalDetailPage3 />} />

        <Route path="/chat/:chatRoomId" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
