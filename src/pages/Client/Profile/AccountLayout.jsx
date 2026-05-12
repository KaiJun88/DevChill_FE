import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../../components/Client/SideBar";
import PageHeader from "./PageHeader";
import { getProfile } from "../../../api/userApi";
import { planApi } from "../../../api/planApi";
import { removeTokens } from "../../../utils/auth";

export default function AccountLayout() {
  const [user, setUser] = useState(null);
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, subscriptionData] = await Promise.all([
          getProfile(),
          planApi.getMySubscription().catch(() => null),
        ]);
        setUser(profileData);
        setSubData(subscriptionData);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    removeTokens();
    window.location.href = "/login";
  };

  const activeTab =
    location.pathname.includes("/my-premium") ||
    location.pathname.includes("/my-premium")
      ? "my-premium"
      : "profile";

  const headerTitle =
    activeTab === "profile" ? "Cài đặt tài khoản" : "Quản lý Gói Premium";
  const headerDesc =
    activeTab === "profile"
      ? "Quản lý thông tin cá nhân, cập nhật avatar và bảo mật."
      : "Theo dõi đặc quyền VIP và lịch sử giao dịch của bạn.";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <PageHeader
          title={headerTitle}
          description={headerDesc}
          mySub={subData}
          loading={loading}
        />
        <div className="flex flex-col md:flex-row gap-8 items-stretch relative min-h-162.5">
          <Sidebar active={activeTab} user={user} onLogout={handleLogout} />
          <div className="flex-1 flex flex-col items-stretch">
            <Outlet context={{ user, setUser, subData, loading }} />
          </div>
        </div>
      </div>
    </div>
  );
}
