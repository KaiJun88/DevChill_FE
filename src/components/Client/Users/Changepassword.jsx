import { useState } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { changePasswordSchema } from "../../../schemas/auth";
import { toast } from "react-toastify";

export default function ChangePassword({ isOpen, onClose, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  if (!isOpen) return null;

  const validateForm = (updatedField = {}) => {
    const formData = {
      oldPassword,
      newPassword,
      confirmPassword,
      ...updatedField,
    };

    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (touched[field] || formData[field].trim() !== "") {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const handleChange = (field, value, setValue) => {
    setValue(value);
    validateForm({ [field]: value });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleSubmit = async () => {
    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    validateForm();

    const result = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = Object.fromEntries(
        result.error.issues.map((err) => [err.path[0], err.message]),
      );
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await onSubmit(result.data);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTouched({});

      toast.success(res?.message || "Đổi mật khẩu thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    value,
    fieldName,
    placeholder,
    showPassword,
    setShowPassword,
    setValue,
  ) => (
    <div className="relative w-full min-h-14">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(fieldName, e.target.value, setValue)}
        onBlur={() => handleBlur(fieldName)}
        className={`
          w-full px-5 py-3.5 rounded-xl
          bg-white border text-gray-800 text-sm
          placeholder-gray-400 outline-none transition-all pr-12
          ${
            errors[fieldName]
              ? "border-red-400 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
          }
        `}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>

      <div className="min-h-4">
        {errors[fieldName] && (
          <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
        )}
      </div>
    </div>
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-6 pb-4 border-b border-gray-200 relative">
          <h2 className="text-gray-900 text-xl font-bold">Đổi mật khẩu</h2>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition"
          >
            <FiX className="text-2xl" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-5">
          {renderPasswordInput(
            oldPassword,
            "oldPassword",
            "Mật khẩu cũ",
            showOldPassword,
            setShowOldPassword,
            setOldPassword,
          )}

          {renderPasswordInput(
            newPassword,
            "newPassword",
            "Mật khẩu mới",
            showNewPassword,
            setShowNewPassword,
            setNewPassword,
          )}

          {renderPasswordInput(
            confirmPassword,
            "confirmPassword",
            "Xác nhận mật khẩu mới",
            showConfirmPassword,
            setShowConfirmPassword,
            setConfirmPassword,
          )}
        </div>
        <div className="px-8 pb-8 pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
}
