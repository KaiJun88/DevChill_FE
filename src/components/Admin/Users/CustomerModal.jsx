/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, User, Pencil } from "lucide-react";
import { getAllPlansAdmin } from "../../../api/planAdminApi";

export default function CustomerModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: "",
        premium_plan: user.premium_plan || "",
      });
    }
    setIsEditing(false);
    setError("");
    setEmailError("");
  }, [user, isOpen]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getAllPlansAdmin({ status: "active" });
        let data = res?.data || res || [];
        data = data.filter((plan) => plan.status === "active");
        setPlans(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách gói:", error);
      }
    };

    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setError("");
    setEmailError("");

    const data = { ...formData };
    if (!data.password || data.password.trim() === "") {
      delete data.password;
    }

    try {
      if (onSave) {
        await onSave(data);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Cập nhật thất bại. Vui lòng thử lại.";
      if (errorMsg.toLowerCase().includes("email")) {
        setEmailError(errorMsg);
      } else {
        setError(errorMsg);
      }
    }
  };

  const formatDate = (d) => {
    if (!d) return "Không có";
    const date = new Date(d);
    if (isNaN(date)) return "Không hợp lệ";
    return date.toLocaleString("vi-VN");
  };

  const inputStyle =
    "w-full h-11 px-4 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border";
  const activeInputStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";
  const disabledStyle =
    "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed";
  const errorInputStyle =
    "bg-rose-50/50 border-rose-300 text-rose-700 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Hồ sơ khách hàng
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setError("");
                setEmailError("");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                isEditing
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <Pencil size={14} strokeWidth={2.5} />
              {isEditing ? "Đang sửa" : "Chỉnh sửa"}
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1"></div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-sm bg-slate-100">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    className="w-full h-full object-cover"
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-black bg-slate-100">
                    {formData.username?.slice(0, 2).toUpperCase() || (
                      <User size={40} />
                    )}
                  </div>
                )}
              </div>
              <div
                className={`absolute bottom-0 right-2 w-4 h-4 rounded-full border-2 border-white ${
                  formData.is_active ? "bg-emerald-400" : "bg-slate-300"
                }`}
              ></div>
            </div>

            <div>
              <p className="text-lg font-bold text-slate-800">
                {formData.username}
              </p>
              <p className="text-[13px] font-medium text-slate-400 mt-0.5">
                ID: #{formData.id}
              </p>
            </div>

            <div className="w-full bg-white border border-slate-100 rounded-2xl p-4 space-y-2.5 mt-8 shadow-sm">
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-slate-400">Ngày tạo</span>
                <span className="font-bold text-slate-600">
                  {formatDate(formData.created_at)}
                </span>
              </div>
              <div className="w-full h-px bg-slate-50"></div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="font-semibold text-slate-400">Cập nhật</span>
                <span className="font-bold text-slate-600">
                  {formatDate(formData.updated_at)}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Địa chỉ Email
              </label>
              <input
                value={formData.email || ""}
                disabled={!isEditing}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (emailError) setEmailError("");
                }}
                className={`${inputStyle} ${
                  !isEditing
                    ? disabledStyle
                    : emailError
                      ? errorInputStyle
                      : activeInputStyle
                }`}
              />
              {emailError && (
                <span className="text-rose-500 text-[12px] font-semibold mt-1.5 ml-1 block animate-in fade-in zoom-in-95 duration-200">
                  {emailError}
                </span>
              )}
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={formData.password || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  isEditing ? "Bỏ trống nếu không muốn đổi..." : "Được bảo mật"
                }
                className={`${inputStyle} ${
                  isEditing ? activeInputStyle : disabledStyle
                }`}
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Phân quyền (Role)
              </label>
              <select
                value={formData.role}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className={`${inputStyle} cursor-pointer appearance-none ${
                  isEditing ? activeInputStyle : disabledStyle
                }`}
              >
                <option value="user">Người dùng (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-sm flex justify-between items-center">
              <span className="text-[13px] font-bold text-slate-500">
                Trạng thái
              </span>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                  formData.is_active
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {formData.is_active ? "Hoạt động" : "Chưa kích hoạt"}
              </span>
            </div>

            <div>
              <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                Gói Premium
              </label>
              <select
                disabled={!isEditing}
                value={formData.premium_plan || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_premium: true,
                    premium_plan: Number(e.target.value),
                  })
                }
                className={`${inputStyle} cursor-pointer appearance-none ${
                  isEditing ? activeInputStyle : disabledStyle
                }`}
              >
                <option value="" disabled>
                  -- Chọn gói --
                </option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`p-4 border rounded-2xl transition-colors ${
                formData.is_locked
                  ? "bg-rose-50/50 border-rose-100"
                  : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[13px] font-bold text-slate-500">
                  Bảo mật
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                    formData.is_locked
                      ? "bg-rose-100 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {formData.is_locked ? "Đã khóa" : "Bình thường"}
                </span>
              </div>

              {formData.is_locked && (
                <div className="mt-4 pt-3 border-t border-rose-100/50 space-y-1.5">
                  <p className="text-[12px] text-rose-600/80 font-medium">
                    <span className="font-bold">Lý do:</span>{" "}
                    {formData.block_reason || "Không rõ lý do"}
                  </p>
                  <p className="text-[12px] text-rose-600/80 font-medium">
                    <span className="font-bold">Thời hạn:</span>{" "}
                    {formatDate(formData.lock_until)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {error && (
          <div className="px-8 pb-2">
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 text-[13px] font-semibold px-4 py-2.5 rounded-xl text-center">
              {error}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-5 h-10 text-[13.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleSave}
            disabled={!isEditing}
            className={`px-6 h-10 text-[13.5px] font-bold rounded-xl transition-all ${
              isEditing
                ? "bg-slate-800 text-white hover:bg-slate-700 shadow-md shadow-slate-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
