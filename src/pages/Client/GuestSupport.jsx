/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Send,
  CheckCircle2,
  FileImage,
  X,
  Headphones,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { createTicketClient } from "../../api/supportUserApi";

export default function GuestSupport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [category, setCategory] = useState("Tài khoản");
  const [description, setDescription] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      return toast.warning("Chỉ tải lên tối đa 3 ảnh đính kèm!");
    }

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64Images = await Promise.all(promises);
      setPreviewImages([...previewImages, ...base64Images]);
    } catch (error) {
      toast.error("Lỗi khi đọc ảnh!");
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!guestEmail || !guestEmail.trim()) {
      newErrors.guestEmail = "Vui lòng nhập Email liên hệ.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        newErrors.guestEmail = "Email không hợp lệ (VD: abc@gmail.com).";
      }
    }

    if (!description || !description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả chi tiết sự cố.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      await createTicketClient({
        guest_email: guestEmail.trim(),
        category,
        description: description.trim(),
        attachments: previewImages,
      });

      toast.success("Gửi yêu cầu thành công! Vui lòng kiểm tra Email.");
      setGuestEmail("");
      setDescription("");
      setPreviewImages([]);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
          <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Headphones size={32} strokeWidth={2.5} className="rotate-3" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Trung Tâm Hỗ Trợ Khách Hàng
          </h2>
          <p className="mt-2 text-[14.5px] text-slate-500 font-medium">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Vui lòng để lại thông tin!
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow-[0_20px_60px_rgba(0,0,0,0.05)] sm:rounded-[2rem] sm:px-10 border border-slate-100 animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-8 duration-700 ease-out fill-mode-both delay-150">
          <div className="bg-blue-50/70 border-l-4 border-blue-500 p-4 rounded-r-xl mb-8 flex gap-3">
            <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={18} />
            <p className="text-[13px] text-slate-800 font-medium leading-relaxed">
              Bạn đang sử dụng tư cách Khách Vãng Lai. Mọi phản hồi từ hệ thống
              sẽ được gửi trực tiếp đến{" "}
              <strong className="text-blue-700">Email</strong> bạn cung cấp dưới
              đây.
            </p>
          </div>

          <form onSubmit={handleSubmitTicket} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-[12.5px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Email liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => {
                    setGuestEmail(e.target.value);
                    if (errors.guestEmail)
                      setErrors({ ...errors, guestEmail: null });
                  }}
                  placeholder="VD: nguyenvana@gmail.com"
                  className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-[14px] text-slate-900 font-medium ${
                    errors.guestEmail
                      ? "border-red-400! bg-red-50/30"
                      : "border-slate-200"
                  }`}
                />
                {errors.guestEmail && (
                  <p className="text-[11px] font-medium text-red-500 mt-1.5 pl-1 italic">
                    {errors.guestEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Chủ đề hỗ trợ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-[14px] text-slate-900 font-bold cursor-pointer"
                >
                  <option value="Tài khoản">
                    Vấn đề Tài khoản / Đăng nhập
                  </option>
                  <option value="Thanh toán">
                    Thanh toán / Nạp gói Premium
                  </option>
                  <option value="Lỗi kỹ thuật">
                    Lỗi kỹ thuật / Không xem phim được
                  </option>
                  <option value="Khác">Góp ý / Vấn đề khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-bold text-slate-900 uppercase tracking-wider mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors({ ...errors, description: null });
                }}
                placeholder="Vui lòng mô tả rõ sự cố bạn đang gặp phải để chúng tôi hỗ trợ tốt nhất..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm text-[14px] text-slate-900 min-h-35 resize-none font-medium ${
                  errors.description
                    ? "border-red-400! bg-red-50/30"
                    : "border-slate-200"
                }`}
              />
              {errors.description && (
                <p className="text-[11px] font-medium text-red-500 mt-1.5 pl-1 italic">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[12.5px] font-bold text-slate-900 uppercase tracking-wider mb-3 items-center gap-2">
                <FileImage
                  size={16}
                  className="text-slate-500 inline-block mr-1"
                />{" "}
                Ảnh đính kèm (Tối đa 3)
              </label>
              <div className="flex gap-4 flex-wrap">
                {previewImages.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewImages(
                          previewImages.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {previewImages.length < 3 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer">
                    <span className="text-2xl leading-none font-light">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-[15px] transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={18} />
                )}
                Gửi Yêu Cầu Hỗ Trợ
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 text-center animate-in fade-in duration-700 delay-300 fill-mode-both">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
