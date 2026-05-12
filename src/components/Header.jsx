/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { removeTokens, getAccessToken } from "../utils/auth";
import { useState, useEffect, useRef } from "react";
import { FaUser, FaCrown, FaTv } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { Bell, Clock } from "lucide-react";
import axios from "axios";
import SearchBox from "./SearchBox";
import { toast } from "react-toastify";
import { getProfile } from "../api/userApi";
import {
  getMyNotificationsClient,
  markNotificationReadClient,
} from "../api/supportUserApi";
import SupportClientModal from "./Client/Support/SupportClientModal";

export default function Header() {
  const navigate = useNavigate();
  const token = getAccessToken();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNotifMenu, setOpenNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, countryRes, yearRes] = await Promise.all([
          axios.get(
            "https://devchillbe-production.up.railway.app/api/movies/category",
          ),
          axios.get(
            "https://devchillbe-production.up.railway.app/api/movies/country",
          ),
          axios.get(
            "https://devchillbe-production.up.railway.app/api/movies/year",
          ),
        ]);

        setCategories(catRes.data?.data?.data || []);
        setCountries(countryRes.data?.data?.data || []);
        setYears(yearRes.data?.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const loadNotifications = async () => {
    if (!token) return;
    try {
      const userData = await getProfile();
      setUser(userData);

      const notifData = await getMyNotificationsClient();
      const notifs = notifData?.data || notifData || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenUserMenu(false);
      }
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target)
      ) {
        setOpenNotifMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildLink = (key, value) => {
    const params = new URLSearchParams();
    if (key && value) params.set(key, value);
    params.set("page", "1");
    return `/movies?${params.toString()}`;
  };

  const handleLogout = () => {
    removeTokens();
    navigate("/login");
    toast.info("Đã đăng xuất!");
  };

  const handleGoPremium = () => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để vào Premium!");
      navigate("/login");
      return;
    }
    navigate("/premium");
  };

  const handleToggleNotif = () => {
    setOpenNotifMenu(!openNotifMenu);
    setOpenUserMenu(false);
  };
  const handleNotifClick = async (notif) => {
    setOpenNotifMenu(false);
    if (notif.reference_id) {
      setSelectedTicketId(notif.reference_id);
      setModalOpen(true);
    } else {
      navigate("/profile/support");
    }
    if (!notif.is_read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      try {
        await markNotificationReadClient(notif.id);
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
  };
  useEffect(() => {
    const handleTicketViewed = async (e) => {
      const viewedTicketId = e.detail;
      let foundNotifId = null;
      setNotifications((prevNotifs) => {
        const isExistUnread = prevNotifs.find(
          (n) =>
            String(n.reference_id) === String(viewedTicketId) && !n.is_read,
        );

        if (isExistUnread) {
          foundNotifId = isExistUnread.id;
          setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
          return prevNotifs.map((n) =>
            n.id === isExistUnread.id ? { ...n, is_read: true } : n,
          );
        }
        return prevNotifs;
      });
      if (foundNotifId) {
        try {
          await markNotificationReadClient(foundNotifId);
        } catch (error) {
          console.error("Lỗi khi đánh dấu thông báo đã đọc từ Modal:", error);
        }
      }
    };

    window.addEventListener("client_ticket_viewed", handleTicketViewed);
    return () => {
      window.removeEventListener("client_ticket_viewed", handleTicketViewed);
    };
  }, []);

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <>
      <header className="bg-blue-50/90 backdrop-blur-md border-b border-blue-100/50 shadow-sm sticky top-0 z-50 text-gray-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-2xl text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <HiMenu />
            </button>
            <Link
              to="/"
              className="flex items-center font-bold text-xl tracking-tight"
            >
              🎬
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-700 ml-1">
                DevChill
              </span>
            </Link>

            <div className="hidden sm:block ml-2 w-64 lg:w-72">
              <SearchBox />
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold">
            <button
              onClick={() => navigate(buildLink("type", "movie"))}
              className="px-3 py-2 rounded-xl hover:bg-blue-100/50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Phim Lẻ
            </button>

            <button
              onClick={() => navigate(buildLink("type", "series"))}
              className="px-3 py-2 rounded-xl hover:bg-blue-100/50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              Phim Bộ
            </button>

            <button
              onClick={() => navigate("/showtimes")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-100/50 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <FaTv className="text-red-500 text-[15px]" />
              Công Chiếu
            </button>

            <Dropdown
              title="Thể loại"
              items={categories}
              type="category"
              buildLink={buildLink}
            />
            <Dropdown
              title="Quốc gia"
              items={countries}
              type="country"
              buildLink={buildLink}
            />
            <Dropdown
              title="Năm"
              items={years}
              type="year"
              buildLink={buildLink}
            />

            <button
              onClick={handleGoPremium}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-blue-100/50 hover:text-yellow-600 transition-colors whitespace-nowrap text-gray-900"
            >
              <FaCrown className="text-yellow-500 text-[15px] drop-shadow-sm" />
              Premium
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <div className="flex items-center gap-3">
                <div className="relative" ref={notifMenuRef}>
                  <button
                    onClick={handleToggleNotif}
                    className="relative p-2 text-gray-600 hover:bg-white hover:text-blue-600 rounded-full transition-all"
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  <div
                    className={`absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgb(0,0,0,0.1)] py-2 transition-all duration-200 z-50 origin-top-right
                    ${openNotifMenu ? "opacity-100 visible pointer-events-auto scale-100" : "opacity-0 invisible pointer-events-none scale-95"}`}
                  >
                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                      <span className="font-bold text-gray-800">Thông báo</span>
                      <Link
                        to="/profile/support"
                        className="text-[12px] text-blue-500 hover:underline"
                        onClick={() => setOpenNotifMenu(false)}
                      >
                        Xem tất cả
                      </Link>
                    </div>
                    <div className="max-h-87.5 overflow-y-auto hidden-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                          Không có thông báo mới
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotifClick(notif)}
                            className={`relative px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                              !notif.is_read
                                ? "bg-blue-50/40 hover:bg-blue-50/70"
                                : "bg-white hover:bg-slate-50"
                            }`}
                          >
                            {!notif.is_read && (
                              <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                            )}

                            <div className={!notif.is_read ? "pl-3" : "pl-1"}>
                              <p
                                className={`text-[13px] mb-0.5 ${!notif.is_read ? "font-extrabold text-blue-900" : "font-medium text-slate-700"}`}
                              >
                                {notif.title}
                              </p>
                              <p
                                className={`text-[12px] line-clamp-2 ${!notif.is_read ? "text-gray-800" : "text-gray-500"}`}
                              >
                                {notif.content}
                              </p>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                                <Clock size={10} /> {timeAgo(notif.created_at)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setOpenUserMenu(!openUserMenu);
                      setOpenNotifMenu(false);
                    }}
                    className="flex items-center gap-2 bg-white/60 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-white shadow-sm transition-all"
                  >
                    <img
                      src={user?.avatar_url || "../assets/devchill-logo.png"}
                      onError={(e) =>
                        (e.target.src = "../assets/devchill-logo.png")
                      }
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                      alt="avatar"
                    />
                    <span className="font-semibold text-gray-800 whitespace-nowrap max-w-25 truncate">
                      {user?.username || "User"}
                    </span>
                    {user?.is_premium ? (
                      <FaCrown
                        className="text-yellow-500 drop-shadow-sm"
                        title="Premium"
                      />
                    ) : (
                      <span className="text-xs text-gray-500"></span>
                    )}
                  </button>
                  <div
                    className={`absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-2 transition-all duration-150 z-50 origin-top-right
                    ${openUserMenu ? "opacity-100 visible pointer-events-auto scale-100" : "opacity-0 invisible pointer-events-none scale-95"}`}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Hồ sơ
                    </Link>

                    <Link
                      to="/profile/history"
                      className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Lịch Sử Xem
                    </Link>

                    <Link
                      to="/profile/my-premium"
                      className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Gói Đã Mua
                    </Link>
                    <Link
                      to="/profile/support"
                      className="block px-4 py-2.5 font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setOpenUserMenu(false)}
                    >
                      Hỗ Trợ
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-full transition-all shadow-sm whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-sm whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-70 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
          <span className="font-bold text-xl tracking-tight text-gray-900">
            🎬 Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-2 text-[15px] font-medium text-gray-700">
          <button
            onClick={() => {
              navigate(buildLink("type", "movie"));
              setMobileOpen(false);
            }}
            className="text-left py-2.5 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Phim Lẻ
          </button>
          <button
            onClick={() => {
              navigate(buildLink("type", "series"));
              setMobileOpen(false);
            }}
            className="text-left py-2.5 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            Phim Bộ
          </button>

          <button
            onClick={() => {
              navigate("/showtimes");
              setMobileOpen(false);
            }}
            className="text-left py-2.5 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
          >
            <FaTv className="text-red-500" />
            Công Chiếu
          </button>

          <div className="px-1 mt-1">
            <MobileDropdown
              title="Thể loại"
              items={categories}
              type="category"
              buildLink={buildLink}
              closeMenu={() => setMobileOpen(false)}
            />
            <MobileDropdown
              title="Quốc gia"
              items={countries}
              type="country"
              buildLink={buildLink}
              closeMenu={() => setMobileOpen(false)}
            />
            <MobileDropdown
              title="Năm"
              items={years}
              type="year"
              buildLink={buildLink}
              closeMenu={() => setMobileOpen(false)}
            />
          </div>
        </div>
      </div>
      <SupportClientModal
        isOpen={isModalOpen}
        ticketId={selectedTicketId}
        onClose={() => setModalOpen(false)}
        onReload={loadNotifications}
      />
    </>
  );
}
function Dropdown({ title, items = [], type, buildLink }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 50);
  };

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${open ? "text-blue-600 bg-blue-100/50" : "hover:bg-blue-100/50 hover:text-blue-600"}`}
      >
        {title}
      </button>
      <div
        className={`absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 shadow-[0_10px_30px_rgb(0,0,0,0.08)] rounded-xl py-2 transition-all duration-100 z-50
        ${open ? "opacity-100 visible pointer-events-auto translate-y-0" : "opacity-0 invisible pointer-events-none -translate-y-1"}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {items.length > 0 ? (
          <div className="max-h-87.5 overflow-y-auto custom-scrollbar px-2">
            {items.map((item) => (
              <button
                key={item.id || item.slug}
                onClick={() => {
                  navigate(buildLink(type, item.slug));
                  setOpen(false);
                }}
                className="block w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 text-[14px] font-medium transition-colors truncate"
              >
                {item.name || item.year}
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-3 text-gray-400 text-sm">Đang tải...</div>
        )}
      </div>
    </div>
  );
}

function MobileDropdown({ title, items = [], type, buildLink, closeMenu }) {
  const navigate = useNavigate();

  return (
    <details className="group border-b border-gray-100/70 last:border-0">
      <summary className="cursor-pointer font-semibold py-3 px-2 rounded-xl hover:bg-blue-50 transition-colors list-none flex justify-between items-center text-gray-800">
        {title}
        <span className="transition-transform duration-300 group-open:-rotate-180 text-gray-400">
          ▾
        </span>
      </summary>

      <div className="flex flex-col gap-1 pl-4 pb-3 mt-1">
        {items.map((item) => (
          <button
            key={item.id || item.slug}
            className="text-left py-2 px-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
            onClick={() => {
              navigate(buildLink(type, item.slug));
              if (closeMenu) closeMenu();
            }}
          >
            {item.name || item.year}
          </button>
        ))}
      </div>
    </details>
  );
}
