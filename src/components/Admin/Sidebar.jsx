import {
  LayoutDashboard,
  Users,
  Film,
  FileText,
  Package,
  Headphones,
  LogOut,
  ChevronRight,
  CreditCard,
  Clapperboard,
  BarChart3,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfile } from "../../api/userApi";
import { toast } from "react-toastify";
import { logout } from "../../utils/auth";
import { getAccessToken } from "../../utils/auth";
import avatarImg from "../../assets/devchill-logo.png";

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        toast.error("Bạn chưa đăng nhập!");
        setLoading(false);
        return;
      }
      try {
        const data = await getProfile(token);
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải thông tin admin!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    toast.info("Đã Đăng Xuất!");
    navigate("/login");
  };

  const menuItems = [
    { name: "Tổng quan", icon: LayoutDashboard, path: "/admin" },
    { name: "Người Dùng", icon: Users, path: "/admin/customers" },
    { name: "Phim", icon: Film, path: "/admin/movies" },
    { name: "Công Chiếu", icon: Clapperboard, path: "/admin/showtimes" },
    { name: "Hợp đồng", icon: FileText, path: "/admin/contracts" },
    { name: "Gói dịch vụ", icon: Package, path: "/admin/plans" },
    { name: "Thanh Toán", icon: CreditCard, path: "/admin/payment" },
    { name: "Hỗ trợ", icon: Headphones, path: "/admin/support" },
    { name: "Thống Kê & Báo Cáo", icon: BarChart3, path: "/admin/reports" },
  ];

  const avatarSrc = user?.avatar_url || avatarImg;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col justify-between text-slate-700 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      <div className="overflow-visible">
        <div className="h-20 flex items-center px-4 overflow-hidden">
          <Link
            to="/"
            className={`group flex items-center gap-2 w-full ${!isOpen && "justify-center"}`}
          >
            <div className="w-9 h-9 min-w-9 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-200">
              D
            </div>
            {isOpen && (
              <h2 className="text-xl font-bold tracking-tight text-slate-800 whitespace-nowrap">
                DEV<span className="text-cyan-500">CHILL</span>
              </h2>
            )}
          </Link>
        </div>
        <nav className={`px-4 space-y-1 mt-2 ${!isOpen && "px-2"}`}>
          {isOpen ? (
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 whitespace-nowrap">
              Main Navigation
            </p>
          ) : (
            <div className="h-6 mb-2"></div>
          )}

          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative group flex items-center ${
                  isOpen ? "justify-between px-4" : "justify-center px-0"
                } py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 shadow-sm shadow-cyan-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`min-w-5 ${
                      isActive
                        ? "text-cyan-500"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  {isOpen && (
                    <span className="text-[14.5px] whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>

                {isOpen && isActive && (
                  <ChevronRight size={14} className="text-cyan-500" />
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-100 shadow-xl pointer-events-none border border-slate-700">
                    {item.name}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div
        className={`p-4 bg-slate-50/50 border-t border-slate-100 mt-auto ${!isOpen && "px-2"}`}
      >
        {loading ? (
          <div
            className={`flex items-center ${isOpen ? "gap-3 px-2 py-4" : "justify-center py-4"}`}
          >
            <div className="w-10 h-10 min-w-10 bg-slate-200 rounded-full animate-pulse" />
            {isOpen && (
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-20 animate-pulse" />
              </div>
            )}
          </div>
        ) : (
          <>
            {isOpen ? (
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4 transition-all hover:border-cyan-100">
                <img
                  src={avatarSrc}
                  alt="admin avatar"
                  className="w-10 h-10 min-w-10 rounded-xl object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user?.username || "Quản trị viên"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate lowercase">
                    {user?.email || "admin@devchill.com"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group flex justify-center mb-4 cursor-pointer">
                <img
                  src={avatarSrc}
                  alt="admin avatar"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-cyan-200 transition-all"
                />
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-100 shadow-xl pointer-events-none">
                  {user?.username || "Admin"}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`relative group w-full flex items-center justify-center ${
                isOpen ? "gap-2 px-4 py-2.5" : "p-2.5"
              } text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 text-sm font-bold border border-transparent hover:border-red-100`}
            >
              <LogOut size={16} strokeWidth={2.5} className="min-w-4" />
              {isOpen && <span className="whitespace-nowrap">Đăng xuất</span>}
              {!isOpen && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg opacity-0 invisible -translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap z-100 shadow-xl pointer-events-none">
                  Đăng xuất
                </div>
              )}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
