import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import ShowtimesSchedule from "../pages/Client/ShowTimes/ShowtimesSchedule";
import PremiereRoom from "../pages/Client/ShowTimes/PremiereRoom";
import VerifyOtp from "../components/VerifyOtp";
import ForgotPassword from "../components/Forgotpassword";
import ResetPassword from "../components/Resetpassword";
import Profile from "../pages/Client/Profile/Profile";
import HistoryView from "../pages/Client/Profile/WatchHistory";
import MovieList from "@/pages/MovieList";
import MovieDetail from "@/pages/MovieDetail";
import Support from "../pages/Client/Profile/Support";
import CustomerList from "../pages/Admin/CustomerList";
import ContractList from "../pages/Admin/ContractList";
import ReportAdmin from "../pages/Admin/ReportAdmin";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../routes/ProtectedRoute";
import DashBoard from "../pages/Admin/DashBoard";
import MoviesListAdmin from "../pages/Admin/MovieListAdmin";
import WatchMovie from "../pages/WatchMovie";
import CategoryMovies from "../pages/CategoryMovies ";
import PremiumPage from "../pages/Client/Premium/PremiumPage";
import PlanListAdmin from "../pages/Admin/PlanListAdmin";
import PremiumDetail from "../pages/Client/Premium/PremiumDetail";
import PaymentSuccess from "../pages/Client/Premium/PaymentSucces";
import TermsOfService from "../pages/TermsOfService";
import MySubscription from "../pages/Client/Profile/MySubscription";
import AccountLayout from "../pages/Client/Profile/AccountLayout";
import PaymentListAdmin from "../pages/Admin/PaymentListAdmin";
import ShowtimeListAdmin from "../pages/Admin/ShowtimeListAdmin";
import WatchHistory from "../pages/Client/Profile/WatchHistory";
import AdminProfile from "../pages/Admin/AdminProfile";
import SupportAdminList from "../pages/Admin/SupportAdminList";
import GuestSupport from "../pages/Client/GuestSupport";
import DevChillBot from "../pages/Client/Chat/DevChillBot";

const ConditionalBot = () => {
  const location = useLocation();
  const hiddenPaths = [
    "/login",
    "/terms",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
    "/guest-support",
  ];
  const isHidden =
    hiddenPaths.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  if (isHidden) {
    return null;
  }

  return <DevChillBot />;
};
export default function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:slug" element={<MovieDetail />} />
            <Route path="/movies/category/:slug" element={<CategoryMovies />} />
            <Route path="/movies/watch/:slug" element={<WatchMovie />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/premium/:id" element={<PremiumDetail />} />
            <Route path="/payment-result" element={<PaymentSuccess />} />
            <Route path="/showtimes" element={<ShowtimesSchedule />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/guest-support" element={<GuestSupport />} />

          <Route element={<ProtectedRoute roles={["user"]} />}>
            <Route element={<AppLayout />}>
              <Route path="/showtimes/:id" element={<PremiereRoom />} />
              <Route path="/profile" element={<AccountLayout />}>
                <Route index element={<Profile />} />
                <Route path="my-premium" element={<MySubscription />} />
                <Route path="history" element={<WatchHistory />} />
                <Route path="support" element={<Support />} />
              </Route>
            </Route>
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashBoard />} />
              <Route path="/admin/customers" element={<CustomerList />} />
              <Route path="/admin/contracts" element={<ContractList />} />
              <Route path="/admin/movies" element={<MoviesListAdmin />} />
              <Route path="/admin/plans" element={<PlanListAdmin />} />
              <Route path="/admin/payment" element={<PaymentListAdmin />} />
              <Route path="/admin/showtimes" element={<ShowtimeListAdmin />} />
              <Route path="/admin/support" element={<SupportAdminList />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/reports" element={<ReportAdmin />} />
            </Route>
          </Route>

          <Route element={<NotFound />} path="*" />
        </Routes>
        <ConditionalBot />
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
