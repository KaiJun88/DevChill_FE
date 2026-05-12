import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Admin/Sidebar";
import AdminHeader from "../components/Admin/AdminHeader";
import { getProfile } from "../api/userApi";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getProfile(token);
        setUser(data);
      } catch (error) {
        console.error("Lỗi lấy thông tin admin:", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} />

      {/* CỘT BÊN PHẢI: Sử dụng w-full để luôn ép giãn kích thước */}
      <div
        className={`flex-1 flex flex-col w-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <AdminHeader
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          user={user}
        />

        {/* Giảm padding lại thành p-4 hoặc p-6 để các thẻ xích sát vào lề */}
        {/* Đảm bảo Outlet có không gian w-full để bung rộng */}
        <main className="flex-1 w-full p-4 md:p-6">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  );
}
