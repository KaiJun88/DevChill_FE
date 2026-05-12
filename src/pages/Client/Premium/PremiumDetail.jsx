/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { planApi } from "../../../api/planApi";

export default function PremiumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const fetchPlanDetail = async () => {
      try {
        const data = await planApi.getPlanById(id);
        setPlan(data);
      } catch (error) {
        toast.error("Không tìm thấy thông tin gói này!");
        navigate("/premium");
      } finally {
        setLoading(false);
      }
    };
    fetchPlanDetail();
  }, [id, navigate]);

  const handleCheckout = async () => {
    // Check này vẫn giữ để đảm bảo logic nghiệp vụ an toàn
    if (!isAgreed) return;

    if (paymentMethod === "momo") {
      toast.warning("Cổng Momo đang bảo trì, vui lòng chọn VNPay!");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await planApi.createPayment(plan.id);

      if (res && res.vnpUrl) {
        window.location.href = res.vnpUrl;
      } else {
        toast.error("Lỗi: Không nhận được đường dẫn thanh toán.");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ. Vui lòng thử lại!");
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-500 text-sm">
        Đang chuẩn bị giao dịch...
      </div>
    );
  if (!plan) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <button
          onClick={() => navigate("/premium")}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 mb-6 text-sm font-semibold transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row border border-slate-100">
          {/* CỘT TRÁI (DARK) */}
          <div className="p-8 md:w-[45%] bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700/50 rounded-full text-[10px] font-bold tracking-widest mb-5 text-sky-400">
                THÔNG TIN ĐƠN HÀNG
              </span>
              <h2 className="text-2xl font-extrabold mb-3 leading-tight">
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-1.5 mb-8">
                <span className="text-4xl font-black text-sky-400">
                  {Number(plan.price).toLocaleString("vi-VN")}đ
                </span>
                <span className="text-slate-400 text-sm font-medium">
                  /{plan.duration_days} ngày
                </span>
              </div>

              <div className="space-y-3.5">
                <p className="text-sm font-semibold text-slate-300 mb-1">
                  Đặc quyền bao gồm:
                </p>
                {plan.description?.features?.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-slate-200 text-sm"
                  >
                    <CheckCircle2 size={18} className="text-sky-400 shrink-0" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex gap-3 relative z-10">
              <ShieldCheck className="text-sky-400 shrink-0" size={20} />
              <p className="text-slate-400 text-xs leading-relaxed">
                Thanh toán an toàn. Thời gian sẽ được{" "}
                <strong className="text-white">cộng dồn</strong> nếu bạn có sẵn
                gói Active.
              </p>
            </div>
          </div>

          {/* CỘT PHẢI (THANH TOÁN) */}
          <div className="p-8 md:w-[55%] flex flex-col justify-center bg-white">
            <h3 className="text-xl font-bold text-slate-800 mb-5">
              Cổng thanh toán
            </h3>

            <div className="space-y-3 mb-6">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${paymentMethod === "vnpay" ? "border-sky-500 bg-sky-50/50 shadow-sm" : "border-slate-200 hover:border-sky-200"}`}
              >
                <input
                  type="radio"
                  value="vnpay"
                  checked={paymentMethod === "vnpay"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-sky-500 accent-sky-500"
                />
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    VNPay / Thẻ ATM
                  </p>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    Quét mã QR cực nhanh
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-[1.5px] cursor-pointer transition-all ${paymentMethod === "momo" ? "border-pink-500 bg-pink-50/50 shadow-sm" : "border-slate-200 hover:border-pink-200"}`}
              >
                <input
                  type="radio"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-pink-500 accent-pink-500"
                />
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                  <span className="font-black text-pink-600 text-lg">M</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Ví Momo</p>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Đang bảo trì
                  </p>
                </div>
              </label>
            </div>

            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-sky-500 accent-sky-500"
                />
                <span className="text-[13px] text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors">
                  Tôi đồng ý với các{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Điều khoản
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Chính sách
                  </Link>{" "}
                  của DevChill.
                </span>
              </label>
            </div>
            <div className="relative group/btn w-full">
              {!isAgreed && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-slate-800 text-white text-[11px] font-semibold rounded-lg opacity-0 invisible group-hover/btn:visible group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle size={14} className="text-amber-400" />
                    Vui lòng bấm đồng ý để tiếp tục thanh toán
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !isAgreed}
                className={`w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.98]
                  ${!isAgreed ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-sky-500 hover:bg-sky-600 shadow-sky-500/20"}
                  ${isProcessing ? "opacity-70" : ""}`}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
