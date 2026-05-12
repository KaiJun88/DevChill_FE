/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  X,
  Pencil,
  Crown,
  Tag,
  Clock,
  CheckCircle2,
  Power,
} from "lucide-react";
import { toast } from "react-toastify";
import { getPlanById, createPlan, updatePlan } from "../../../api/planAdminApi";

export default function PlanModal({ isOpen, planId, mode, onClose, onReload }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    is_popular: false,
    status: "active",
  });
  const [featuresText, setFeaturesText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Thêm state quản lý lỗi

  useEffect(() => {
    if (isOpen) {
      setErrors({}); // Reset lỗi khi mở modal
      if (mode === "create") {
        setFormData({
          name: "",
          price: "",
          duration_days: "",
          is_popular: false,
          status: "active",
        });
        setFeaturesText("");
        setIsEditing(true);
      } else if (mode === "edit" && planId) {
        fetchPlanDetails();
        setIsEditing(false);
      }
    }
  }, [isOpen, planId, mode]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      const res = await getPlanById(planId);
      const plan = res?.data || res;
      setFormData(plan);
      setFeaturesText(plan?.description?.features?.join("\n") || "");
    } catch (err) {
      toast.error(err?.message || "Lỗi khi lấy chi tiết gói");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên gói dịch vụ.";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Vui lòng nhập giá tiền hợp lệ (> 0).";
    }
    if (!formData.duration_days || Number(formData.duration_days) <= 0) {
      newErrors.duration_days = "Vui lòng nhập thời hạn hợp lệ (> 0).";
    }
    if (!featuresText || !featuresText.trim()) {
      newErrors.features = "Vui lòng nhập ít nhất 1 tính năng.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSave = async () => {
    // Gọi hàm kiểm tra hợp lệ trước khi xử lý
    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    try {
      const featuresArray = featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f !== "");

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        duration_days: Number(formData.duration_days),
        is_popular:
          formData.is_popular === true || formData.is_popular === "true",
        description: { features: featuresArray },
      };

      if (mode === "create") {
        await createPlan(payload);
        toast.success("Tạo gói mới thành công!");
      } else {
        await updatePlan(planId, payload);
        toast.success("Cập nhật gói thành công!");
      }
      onReload();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Lưu thất bại");
    }
  };

  if (!isOpen) return null;

  const formatDate = (d) => {
    if (!d) return "Chưa có";
    return new Date(d).toLocaleString("vi-VN");
  };

  const inputStyle =
    "w-full px-4 py-2.5 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border";
  const activeInputStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10";
  const errorInputStyle =
    "!border-rose-400 focus:!border-rose-500 focus:!ring-rose-500/10 bg-rose-50/30"; // Style khi có lỗi
  const disabledStyle =
    "bg-slate-50 border-transparent text-slate-500 cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Crown size={20} className="text-amber-500" />
            {mode === "create" ? "Tạo gói dịch vụ mới" : "Chi tiết gói dịch vụ"}
          </h3>

          <div className="flex items-center gap-2">
            {mode === "edit" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                  isEditing
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Pencil size={14} strokeWidth={2.5} />
                {isEditing ? "Đang sửa" : "Chỉnh sửa"}
              </button>
            )}
            {mode === "edit" && (
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Đang tải chi tiết...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                  <Tag size={14} /> Tên gói{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  value={formData.name || ""}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null }); // Xóa lỗi khi gõ
                  }}
                  placeholder="VD: VIP 1 Tháng..."
                  className={`${inputStyle} h-11 ${
                    isEditing ? activeInputStyle : disabledStyle
                  } ${errors.name ? errorInputStyle : ""}`}
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                    Giá tiền (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price || ""}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (errors.price) setErrors({ ...errors, price: null });
                    }}
                    placeholder="VD: 49000"
                    className={`${inputStyle} h-11 ${
                      isEditing ? activeInputStyle : disabledStyle
                    } ${errors.price ? errorInputStyle : ""}`}
                  />
                  {errors.price && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                    <Clock size={14} /> Thời hạn (Ngày){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration_days || ""}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        duration_days: e.target.value,
                      });
                      if (errors.duration_days)
                        setErrors({ ...errors, duration_days: null });
                    }}
                    placeholder="VD: 30"
                    className={`${inputStyle} h-11 ${
                      isEditing ? activeInputStyle : disabledStyle
                    } ${errors.duration_days ? errorInputStyle : ""}`}
                  />
                  {errors.duration_days && (
                    <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                      {errors.duration_days}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1">
                  Độ phổ biến
                </label>
                <select
                  value={formData.is_popular || false}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_popular: e.target.value === "true",
                    })
                  }
                  className={`${inputStyle} h-11 cursor-pointer appearance-none ${
                    isEditing ? activeInputStyle : disabledStyle
                  }`}
                >
                  <option value={false}>Gói thường</option>
                  <option value={true}>🔥 Gói phổ biến (Popular)</option>
                </select>
              </div>
            </div>

            <div className="space-y-5 flex flex-col">
              <div className="flex-1 flex flex-col">
                <label className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1">
                  <CheckCircle2 size={14} /> Các tính năng (Mỗi dòng 1 tính
                  năng) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={featuresText}
                  disabled={!isEditing}
                  onChange={(e) => {
                    setFeaturesText(e.target.value);
                    if (errors.features)
                      setErrors({ ...errors, features: null });
                  }}
                  placeholder="Full HD, 4K&#10;Không quảng cáo&#10;Xem Công Chiếu Thả Ga"
                  className={`${inputStyle} flex-1 min-h-35 resize-none ${
                    isEditing ? activeInputStyle : disabledStyle
                  } ${errors.features ? errorInputStyle : ""}`}
                />
                {errors.features && (
                  <p className="text-[11px] font-medium text-rose-500 mt-1.5 pl-1 italic">
                    {errors.features}
                  </p>
                )}
              </div>

              {mode === "edit" && (
                <div
                  className={`p-4 border rounded-2xl transition-colors ${
                    formData.status === "inactive"
                      ? "bg-rose-50/50 border-rose-100"
                      : "bg-white border-slate-100 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-bold text-slate-500">
                      Trạng thái hiện tại
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                        formData.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-100 text-rose-600 border border-rose-200"
                      }`}
                    >
                      {formData.status === "active"
                        ? "Đang hoạt động"
                        : "Bị vô hiệu hóa"}
                    </span>
                  </div>
                  <div className="w-full h-px bg-slate-100 my-3"></div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-semibold text-slate-400">
                      Ngày tạo
                    </span>
                    <span className="font-bold text-slate-600">
                      {formatDate(formData.created_at)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-5 h-10 text-[13.5px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-all"
          >
            Đóng
          </button>
          {(isEditing || mode === "create") && (
            <button
              onClick={handleSave}
              className="px-6 h-10 text-[13.5px] font-bold rounded-xl transition-all bg-slate-800 text-white hover:bg-slate-700 shadow-md shadow-slate-200"
            >
              {mode === "create" ? "Tạo gói mới" : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
