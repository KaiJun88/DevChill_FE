import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Camera,
  Mail,
  Crown,
  Shield,
  User,
  Calendar,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import Changepassword from "../../../components/Client/Users/Changepassword";
import { updateProfile, changePassword } from "../../../api/userApi";

export default function Profile() {
  const { user, setUser, loading } = useOutletContext();

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    gender: "unknown",
    birth_date: "",
    avatar_url: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      let formattedDate = "";
      if (user.birth_date) {
        const dateObj = new Date(user.birth_date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        formattedDate = `${year}-${month}-${day}`;
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        username: user.username || "",
        gender: user.gender || "unknown",
        birth_date: formattedDate,
        avatar_url: user.avatar_url || "",
      });
      setAvatarPreview(user.avatar_url || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriggerClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, avatar_url: reader.result }));
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateProfile({
        username: formData.username,
        gender: formData.gender,
        avatar_url: formData.avatar_url,
        birth_date: formData.birth_date,
      });

      setUser((prev) => ({ ...prev, ...updatedUser }));
      setAvatarPreview(updatedUser.avatar_url || formData.avatar_url);

      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleChangePassword = async (data) => {
    return await changePassword(data);
  };

  const menuSkeleton = (
    <div className="h-12 w-full bg-slate-100 rounded-xl animate-pulse" />
  );

  return (
    <>
      <main className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 lg:p-10 flex flex-col justify-between h-full">
        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-14">
          <div className="flex flex-col items-center shrink-0 lg:w-48">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div
              onClick={handleTriggerClick}
              className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full ring-4 ring-slate-50 overflow-hidden cursor-pointer bg-slate-100 group shadow-md"
            >
              <img
                src={
                  avatarPreview ||
                  user?.avatar_url ||
                  "../assets/devchill-logo.png"
                }
                alt="Avatar"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                <Camera size={26} className="mb-1.5 drop-shadow-md" />
                <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-md">
                  Đổi ảnh
                </span>
              </div>
            </div>

            <div className="mt-5 text-center w-full">
              {user?.is_premium ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-yellow-400 to-yellow-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm shadow-yellow-500/20">
                  <Crown size={12} fill="currentColor" /> Thành viên Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-wider border border-slate-200">
                  <Shield size={12} /> Tài khoản Free
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-slate-900 mb-6 tracking-tight">
              Thông tin cá nhân
            </h3>

            {loading ? (
              <div className="space-y-5">
                {menuSkeleton}
                {menuSkeleton}
                {menuSkeleton}
                {menuSkeleton}
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail size={16} className="text-slate-900" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 text-sm font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Tên hiển thị
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User size={16} className="text-slate-900" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Nhập tên của bạn"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-12 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-0">
                      <Calendar
                        size={18}
                        className="text-blue-500 drop-shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Giới tính
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: "male", label: "Nam" },
                      { id: "female", label: "Nữ" },
                      { id: "other", label: "Khác" },
                    ].map((g) => (
                      <label
                        key={g.id}
                        className={`relative flex items-center justify-center px-5 py-2.5 rounded-xl border font-semibold text-xs cursor-pointer transition-all ${
                          formData.gender === g.id
                            ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.id}
                          checked={formData.gender === g.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        {g.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleUpdateProfile}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold tracking-wide shadow-md shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Lưu Thay Đổi
          </button>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95"
          >
            <Lock size={16} /> Đổi Mật Khẩu
          </button>
        </div>
      </main>

      <Changepassword
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
}
