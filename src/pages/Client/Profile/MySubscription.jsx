import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  History,
  Crown,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function MySubscription() {
  const { subData, loading } = useOutletContext();
  const [activeTab, setActiveTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const now = new Date();
  const allPlans = subData?.all_details || [];

  const activePlans = allPlans.filter(
    (plan) => new Date(plan.end_date) >= now || plan.status === "active",
  );

  const expiredPlans = allPlans.filter(
    (plan) => new Date(plan.end_date) < now && plan.status !== "active",
  );

  const displayList = activeTab === "active" ? activePlans : expiredPlans;
  const totalPages = Math.ceil(displayList.length / ITEMS_PER_PAGE);
  const paginatedItems = displayList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0); 
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <main className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 lg:p-8 flex flex-col h-180">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-lg font-extrabold text-slate-900">
          Chi tiết các gói
        </h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">
              Trang {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === 0
                  ? "bg-slate-50 text-slate-300 border-slate-100"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500 shadow-sm"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === totalPages - 1
                  ? "bg-slate-50 text-slate-300 border-slate-100"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500 shadow-sm"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 size={32} className="text-blue-500 animate-spin mb-3" />
          <p className="text-slate-500 text-sm font-medium">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-2xl w-fit mb-6 shrink-0">
            <button
              onClick={() => handleTabChange("active")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "active"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CheckCircle2 size={16} /> Đang chạy ({activePlans.length})
            </button>
            <button
              onClick={() => handleTabChange("expired")}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === "expired"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <History size={16} /> Đã kết thúc ({expiredPlans.length})
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {displayList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <History size={32} className="text-slate-300 mb-3" />
                <h4 className="text-slate-700 font-bold">
                  Chưa có giao dịch nào
                </h4>
                <p className="text-slate-500 text-sm">
                  Mục này hiện đang trống.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
                {paginatedItems.map((plan, index) => (
                  <div
                    key={`${plan.id}-${index}`}
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          activeTab === "active"
                            ? "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {activeTab === "active" ? (
                          <Crown size={20} />
                        ) : (
                          <XCircle size={20} />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-sm font-extrabold text-slate-900 truncate">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                              activeTab === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {activeTab === "active" ? "Kích hoạt" : "Hết hạn"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-[12px] text-right shrink-0">
                      <div className="flex items-center justify-end gap-1.5 text-slate-500">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Bắt đầu:
                        </span>
                        <span className="text-slate-700 font-medium">
                          {formatDate(plan.start_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-slate-500">
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Kết thúc:
                        </span>
                        <span className="text-slate-700 font-medium">
                          {formatDate(plan.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
