import { Link, useLocation } from "react-router-dom";
import { User, Ticket, Crown, LifeBuoy, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import avatarImg from "../../assets/devchill-logo.png"; 

export default function Sidebar({ user, onLogout, customAvatar }) {
  const location = useLocation();

  const menuItems = [
    {
      id: "profile",
      icon: <User size={20} />,
      label: "Tài khoản cá nhân",
      path: "/profile",
    },
    {
      id: "tickets",
      icon: <Ticket size={20} />,
      label: "Lịch sử xem phim",
      path: "/profile/history",
    },
    {
      id: "subscription",
      icon: <Crown size={20} />,
      label: "Gói đã mua",
      path: "/profile/my-premium",
    },
    {
      id: "support",
      icon: <LifeBuoy size={20} />,
      label: "Hỗ trợ",
      path: "/profile/support",
    },
  ];

  const avatarSrc = customAvatar || user?.avatar_url || avatarImg;

  const handleLogout = () => {
    toast.info("Bạn đã đăng xuất khỏi hệ thống");
    onLogout?.();
  };

  return (
    <aside className="w-full md:w-72 lg:w-80 shrink-0 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between p-6 z-10">
      <div>
        <h2 className="text-slate-900 text-xl font-extrabold mb-6 tracking-tight pl-2">
          Quản lý tài khoản
        </h2>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 border border-transparent ${
                    isActive
                      ? "text-blue-600 bg-blue-50 border-blue-100 font-bold shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium"
                  }`}
                >
                  {item.icon}
                  <span className="text-[14px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-slate-100 pt-6 mt-8">
        {!user ? (
          <div className="flex items-center gap-3 px-2 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-2/3" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 px-2 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
            <div className="relative shrink-0">
              <img
                src={avatarSrc}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              {user?.is_premium && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                  <span className="flex w-4 h-4 bg-yellow-400 rounded-full text-[10px] items-center justify-center text-white">
                    <Crown size={10} fill="currentColor" />
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-slate-900 text-sm font-bold truncate">
                  {user?.username || "Người dùng"}
                </p>
              </div>
              <p className="text-slate-400 text-[11px] font-medium truncate mt-0.5">
                {user?.email || "Chưa cập nhật email"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm transition-all duration-300"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
