/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, CheckCircle2, Zap, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { planApi } from "../../../api/planApi";

export default function PremiumPage() {
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, subData] = await Promise.all([
          planApi.getAllPlans(),
          planApi.getMySubscription().catch(() => null),
        ]);
        setPlans(plansData);
        setMySub(subData);
      } catch (error) {
        toast.error("Không thể tải danh sách gói. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] text-slate-500 font-medium text-sm">
        <span className="animate-pulse">Đang tải dữ liệu Premium...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4 bg-amber-50 border border-amber-200/60 shadow-sm">
            <Crown size={14} className="text-amber-500" />
            <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
              DevChill Premium
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-slate-900">
            Nâng tầm trải nghiệm giải trí
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">
            Chọn gói đăng ký phù hợp để tận hưởng các tính năng độc quyền và nội
            dung phim không giới hạn.
          </p>
        </div>
        {mySub && (mySub.current_plan || mySub.total_days_left > 0) && (
          <div className="max-w-2xl mx-auto mb-12 p-px bg-linear-to-r from-sky-400 to-blue-500 rounded-2xl shadow-md">
            <div className="bg-white/95 backdrop-blur-xl rounded-[15px] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center">
                  <Crown className="text-sky-500" size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Đang sử dụng
                  </p>
                  <h3 className="text-base font-bold text-slate-800">
                    Gói Premium (Cộng dồn)
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-100">
                <Clock className="text-sky-500 animate-pulse" size={18} />
                <div className="text-right">
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                    Còn lại
                  </p>
                  <p className="text-base font-black text-slate-800">
                    {mySub.total_days_left} ngày
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col h-full bg-white rounded-3xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                pkg.is_popular
                  ? "ring-[1.5px] ring-sky-500 shadow-[0_8px_30px_rgb(14,165,233,0.12)] z-10 scale-[1.03]"
                  : "border border-slate-200/80 shadow-sm hover:shadow-md"
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-sky-400 to-blue-500 text-white px-4 py-1 rounded-full text-[11px] font-black tracking-wider flex items-center gap-1 shadow-md">
                  <Zap size={12} className="fill-current" /> PHỔ BIẾN
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {Number(pkg.price).toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-slate-500 font-medium text-sm">
                    /{pkg.duration_days} ngày
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-3.5 mb-8">
                {pkg.description?.features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-slate-600 text-sm"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-sky-500 shrink-0 mt-0.5"
                    />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(`/premium/${pkg.id}`)}
                className={`w-full py-3 mt-auto rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                  pkg.is_popular
                    ? "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/25"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Đăng ký ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
