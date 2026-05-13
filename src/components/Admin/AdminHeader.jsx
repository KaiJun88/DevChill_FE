/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getUnreadSupportCountAdmin,
  getAllSupportTicketsAdmin,
} from "../../api/supportAdminApi";
import SupportModal from "./Support/SupportModal";

export default function AdminHeader({ toggleSidebar, user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const unreadRes = await getUnreadSupportCountAdmin();
      setUnreadCount(
        unreadRes?.data?.unread_count || unreadRes?.unread_count || 0,
      );
      const notifRes = await getAllSupportTicketsAdmin({
        limit: 10,
        sort_by: "updated_at",
        order: "desc",
      });
      const data =
        notifRes?.data?.tickets || notifRes?.tickets || notifRes?.data || [];
      setNotifications(data);
    } catch (error) {
      console.error("Lỗi tải thông báo Header:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handleTicketUpdated = () => {
      fetchNotifications();
    };
    const handleTicketViewed = (e) => {
      const viewedTicketId = e.detail;
      setNotifications((prevNotifs) =>
        prevNotifs.map((notif) => {
          if (notif.id === viewedTicketId && notif.needs_attention) {
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
            return { ...notif, needs_attention: false };
          }
          return notif;
        }),
      );
    };
    window.addEventListener("support_ticket_updated", handleTicketUpdated);
    window.addEventListener("support_ticket_viewed", handleTicketViewed);
    return () => {
      window.removeEventListener("support_ticket_updated", handleTicketUpdated);
      window.removeEventListener("support_ticket_viewed", handleTicketViewed);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Đã Đăng Xuất");
    navigate("/login");
  };

  const handleToggleNotif = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const handleClickNotification = (ticketId) => {
    setSelectedTicketId(ticketId);
    setModalOpen(true);
    setIsNotifOpen(false);
  };

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
      <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
          >
            <Menu size={24} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-800">
              Chào {user?.username ? user.username : "Đang tải..."} 👋
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Chúc bạn một ngày làm việc hiệu quả!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button
              onClick={handleToggleNotif}
              className="relative p-2.5 text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <Bell size={22} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border-2 border-white shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {isNotifOpen && (
              <div className="absolute right-0 mt-3 w-90 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 text-[14px]">
                    Thông báo hỗ trợ
                  </h3>
                  <Link
                    to="/admin/support"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[12px] font-semibold text-blue-500 hover:text-blue-600"
                  >
                    Xem tất cả
                  </Link>
                </div>
                <div className="max-h-95 overflow-y-auto hidden-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-[13px] text-gray-400 font-medium">
                      Không có thông báo mới nào.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleClickNotification(notif.id)}
                        className={`relative flex gap-3 px-5 py-4 cursor-pointer border-b border-gray-50 transition-all ${
                          notif.needs_attention
                            ? "bg-blue-50/50 hover:bg-blue-100/60"
                            : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        {notif.needs_attention && (
                          <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]"></div>
                        )}
                        <div
                          className={`shrink-0 mt-1 ${notif.needs_attention ? "ml-2" : ""}`}
                        >
                          <img
                            src={notif.avatar_url}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4
                              className={`text-[13px] truncate pr-2 ${notif.needs_attention ? "font-extrabold text-blue-900" : "font-bold text-gray-800"}`}
                            >
                              {notif.user_name || "Khách Vãng Lai"}
                            </h4>
                            <span className="shrink-0 text-[11px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                              #{notif.ticket_code}
                            </span>
                          </div>

                          <p
                            className={`text-[13px] line-clamp-2 leading-relaxed mb-2 ${notif.needs_attention ? "text-gray-800 font-medium" : "text-gray-500"}`}
                          >
                            Yêu cầu hỗ trợ <b>{notif.category}</b>:{" "}
                            {notif.description}
                          </p>

                          <div className="flex justify-between items-center mt-1">
                            <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                              <Clock size={12} />
                              {timeAgo(notif.updated_at || notif.created_at)}
                            </span>

                            {notif.priority === "high" &&
                              notif.status !== "resolved" && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500">
                                  <AlertCircle size={12} /> Gấp
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 bg-white">
                <img
                  src={user?.avatar_url}
                  alt={user?.username || "Admin"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden md:block text-left mr-1">
                <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                  {user?.username || "Admin"}
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Quản trị viên
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200">
                <Link
                  to="/admin/profile"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User size={18} />
                  Thông tin cá nhân
                </Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <SupportModal
        isOpen={isModalOpen}
        ticketId={selectedTicketId}
        onClose={() => setModalOpen(false)}
        onReload={fetchNotifications}
      />
    </>
  );
}
