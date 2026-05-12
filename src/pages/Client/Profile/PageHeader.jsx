import { Link } from "react-router-dom";
import { Crown, Clock, Shield, Zap } from "lucide-react";

export default function PageHeader({ title, description, mySub, loading }) {
  return (
    <>
      {/* Header Tiêu đề động */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">
          {description}
        </p>
      </div>

      {/* Thẻ trạng thái Premium */}
      {!loading && (
        <div className="mb-8">
          {mySub && (mySub.current_plan || mySub.total_days_left > 0) ? (
            // Thẻ Dành Cho VIP
            <div className="p-[1.5px] bg-linear-to-r from-sky-400 to-blue-500 rounded-2xl shadow-md">
              <div className="bg-white/95 backdrop-blur-xl rounded-[15px] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100 shadow-inner shrink-0">
                    <Crown className="text-sky-500" size={26} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      Trạng thái gói
                    </p>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">
                      Thành viên VIP
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50/80 px-5 py-3 rounded-xl border border-slate-100">
                  <Clock className="text-sky-500 animate-pulse" size={22} />
                  <div className="text-right">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      Thời gian còn lại
                    </p>
                    <p className="text-xl font-black text-slate-900 leading-none mt-1">
                      {mySub.total_days_left}{" "}
                      <span className="text-sm font-semibold text-slate-500">
                        ngày
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Thẻ Dành Cho Tài Khoản Free
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:shadow-md hover:border-sky-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shrink-0">
                  <Shield className="text-slate-400" size={26} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                    Trạng thái gói
                  </p>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    Tài khoản Free
                  </h3>
                </div>
              </div>
              <Link
                to="/premium"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white font-bold text-sm transition-all active:scale-95 border border-sky-100 hover:shadow-lg hover:shadow-sky-500/30 whitespace-nowrap"
              >
                <Zap size={18} className="fill-current" />
                Nâng cấp Premium
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
