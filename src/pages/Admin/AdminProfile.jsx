import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Camera,
  Mail,
  ShieldCheck,
  User,
  Lock,
  Calendar,
  Save,
  Award,
  Clock,
  Edit2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import ChangePassword from "../../components/Client/Users/Changepassword";
import { updateProfile, changePassword } from "../../api/userApi";

export default function AdminProfile() {
  const { user, setUser } = useOutletContext();

  const [isEditing, setIsEditing] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "male",
    birth_date: "",
    avatar_url: "",
  });

  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user) {
      let formattedDate = "";
      if (user.birth_date) {
        const d = new Date(user.birth_date);
        formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      const initialData = {
        username: user.username || "",
        email: user.email || "",
        gender: user.gender || "male",
        birth_date: formattedDate,
        avatar_url: user.avatar_url || "",
      };

      setFormData(initialData);
      setOriginalData(initialData);
      setAvatarPreview(user.avatar_url || null);
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
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
      setIsEditing(true); // Tự động bật chế độ "Lưu" khi đổi ảnh
    };
    reader.readAsDataURL(file);
  };

  // Xử lý khi bấm nút "Hủy" chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(originalData);
    setAvatarPreview(originalData.avatar_url || null);
  };

  // Logic Call API cập nhật thông tin (Giữ nguyên logic cũ)
  const handleUpdateProfile = async () => {
    try {
      setLoadingInfo(true);
      const updatedUser = await updateProfile(formData);
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setOriginalData(formData);
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoadingInfo(false);
    }
  };
  const handleChangePassword = async (data) => {
    return await changePassword(data);
  };
  const inputClass = isEditing
    ? "w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/80 rounded-xl focus:border-blue-500 focus:ring-[4px] focus:ring-blue-500/15 transition-all font-semibold text-slate-800 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none"
    : "w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-xl text-slate-800 font-bold text-sm outline-none cursor-default pointer-events-none transition-all";
  const dateInputClass = isEditing
    ? "w-full pl-4 pr-12 py-3.5 bg-white border border-slate-200/80 rounded-xl focus:border-blue-500 focus:ring-[4px] focus:ring-blue-500/15 transition-all font-semibold text-slate-800 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-12 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10 pl-4"
    : "w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-transparent rounded-xl text-slate-800 font-bold text-sm outline-none cursor-default pointer-events-none transition-all [&::-webkit-calendar-picker-indicator]:hidden pl-4";

  return (
    <>
      <main className="w-full max-w-275 mx-auto animate-in fade-in duration-500">
        <div className="mb-8 flex flex-col gap-1.5">
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900">
            Hồ sơ quản trị
          </h1>
          <p className="text-[15px] text-slate-500 font-medium">
            Quản lý thông tin định danh và bảo mật tài khoản của bạn.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
          {/* --- CỘT PHẢI: AVATAR & THÔNG TIN TÓM TẮT --- */}
          <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
            <div className="bg-slate-50/50 rounded-[2rem] shadow-sm border border-slate-200/60 p-8 flex flex-col items-center relative overflow-hidden text-center hover:border-slate-300/60 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="relative z-10 group mt-2">
                {/* --- ĐÃ SỬA: rounded-full cho avatar hình tròn --- */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-32 h-32 rounded-full ring-[6px] ring-white overflow-hidden bg-white shadow-lg transition-all cursor-pointer hover:shadow-blue-500/20 hover:ring-blue-50"
                >
                  <img
                    src={
                      avatarPreview || user?.avatar_url || "/default-avatar.png"
                    }
                    alt="Admin Avatar"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                    <Camera size={26} className="mb-1.5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Tải ảnh
                    </span>
                  </div>
                </div>
                {/* Icon camera nhỏ */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-slate-800 text-white p-2 rounded-full shadow-lg border-[3px] border-white cursor-pointer hover:bg-blue-600 transition-colors z-20"
                >
                  <Camera size={16} />
                </div>
              </div>

              <div className="mt-6 z-10 w-full">
                <h2 className="text-[20px] font-extrabold text-slate-800">
                  {user?.username || "Quản trị viên"}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm">
                    <ShieldCheck size={14} className="text-cyan-400" /> Quản Trị
                    Viên
                  </span>
                  {user?.is_premium && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-100 to-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wide border border-amber-200/70">
                      <Award size={14} /> Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
            {user?.subscription_status === "active" && (
              <div className="bg-slate-50/50 rounded-3xl shadow-sm border border-slate-200/60 p-6 flex flex-col gap-3 hover:border-slate-300/60 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Gói hiện tại
                  </span>
                  <span className="text-[11px] font-black text-amber-600 bg-amber-100/60 px-2.5 py-1 rounded-md border border-amber-200/70">
                    {user.plan_name}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      {user.premium_message}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Hết hạn:{" "}
                      {new Date(user.subscription_end_date).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* --- CỘT TRÁI: FORM CHỈNH SỬA CHI TIẾT --- */}
          <div className="flex-1 w-full bg-slate-50/50 rounded-[2rem] shadow-sm border border-slate-200/60 p-8 lg:p-10 hover:border-slate-300/60 transition-colors">
            {/* Header Form */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-5">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100/60 rounded-xl text-blue-600 shadow-sm">
                  <User size={20} />
                </div>
                Thông tin cá nhân
              </h3>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  <Edit2 size={16} /> Chỉnh sửa
                </button>
              )}
            </div>

            <div
              className={`space-y-7 transition-all duration-300 ${!isEditing ? "opacity-95" : "opacity-100"}`}
            >
              {/* Username & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2 relative group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Tên hiển thị
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isEditing ? "text-blue-500" : "text-slate-400"}`}
                    />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="Nhập tên hiển thị"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2 relative group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Email đăng nhập
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isEditing ? "text-blue-500" : "text-slate-400"}`}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      placeholder="admin@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Ngày sinh & Giới tính */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div className="space-y-2 relative group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Ngày sinh
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      className={dateInputClass}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-0">
                      <Calendar
                        size={18}
                        className={`transition-all ${isEditing ? "text-blue-500 drop-shadow-sm" : "text-slate-400"}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    Giới tính
                  </label>
                  <div
                    className={`flex gap-3 h-12.5 ${!isEditing ? "pointer-events-none" : ""}`}
                  >
                    {[
                      { id: "male", label: "Nam" },
                      { id: "female", label: "Nữ" },
                      { id: "other", label: "Khác" },
                    ].map((g) => {
                      const isSelected = formData.gender === g.id;
                      let btnClass =
                        "flex-1 flex items-center justify-center rounded-xl border text-sm font-bold transition-all ";

                      if (!isEditing) {
                        btnClass += isSelected
                          ? "bg-slate-200/70 border-transparent text-slate-800"
                          : "bg-transparent border-transparent text-slate-400 hover:text-slate-500";
                      } else {
                        btnClass += isSelected
                          ? "bg-slate-800 border-slate-800 text-white shadow-md cursor-default ring-2 ring-slate-900/10"
                          : "bg-white border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer shadow-sm";
                      }

                      return (
                        <label key={g.id} className={btnClass}>
                          <input
                            type="radio"
                            name="gender"
                            value={g.id}
                            checked={isSelected}
                            onChange={handleChange}
                            className="hidden"
                          />
                          {g.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-8 mt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200/80 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              >
                <Lock size={16} /> Đổi mật khẩu
              </button>

              {isEditing && (
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleCancelEdit}
                    disabled={loadingInfo}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200/80 text-slate-600 text-sm font-bold hover:bg-slate-50 hover:text-rose-600 transition-all disabled:opacity-50 shadow-sm"
                  >
                    <X size={16} /> Hủy
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loadingInfo}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold tracking-wide shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loadingInfo ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <Save size={16} />
                    )}
                    Lưu thông tin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ChangePassword
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
      />
    </>
  );
}
