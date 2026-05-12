/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getWatchHistory,
  deleteHistoryItem,
  clearAllHistory,
} from "../../../api/watchHistoryApi";
import {
  History,
  Clock,
  PlayCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Trash2,
  X,
} from "lucide-react";

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const formatLastWatched = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WatchHistory() {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const ITEMS_PER_PAGE = 8;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getWatchHistory(currentPage, ITEMS_PER_PAGE);
      if (response.success) {
        setHistoryList(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi tải lịch sử xem:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleDeleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await deleteHistoryItem(id);
      if (res.success) {
        toast.success("Đã xóa khỏi lịch sử xem");
        setHistoryList((prev) => prev.filter((item) => item.id !== id));
        if (historyList.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      toast.error("Không thể xóa lịch sử lúc này");
    }
  };
  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim? Hành động này không thể hoàn tác.",
      )
    )
      return;

    setIsDeletingAll(true);
    try {
      const res = await clearAllHistory();
      if (res.success) {
        toast.success("Đã dọn dẹp toàn bộ lịch sử");
        setHistoryList([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error("Lỗi khi xóa lịch sử");
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <main className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 lg:p-8 flex flex-col h-200 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
              <History size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Lịch sử xem phim
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Tiếp tục xem những bộ phim bạn đang theo dõi
              </p>
            </div>
          </div>
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isDeletingAll}
              className="sm:hidden p-2 text-rose-500 bg-rose-50 rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-colors"
            >
              {isDeletingAll ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={isDeletingAll}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-100"
            >
              {isDeletingAll ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Xóa tất cả
            </button>
          )}

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                Trang {currentPage} / {totalPages}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    currentPage === 1
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm hover:shadow"
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    currentPage === totalPages
                      ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm hover:shadow"
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-semibold tracking-wide">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {historyList.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 rounded-3xl border-2 border-slate-100 border-dashed">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <MonitorPlay size={36} className="text-slate-300" />
              </div>
              <h4 className="text-slate-800 font-extrabold text-lg mb-2">
                Chưa có lịch sử xem
              </h4>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Bạn chưa xem bộ phim nào gần đây. Hãy khám phá kho phim và bắt
                đầu trải nghiệm ngay nhé!
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-max">
                {historyList.map((item) => {
                  const progressPercentage = Math.min(item.progress || 0, 100);

                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        navigate(`/movies/watch/${item.movie_slug}`)
                      }
                      className="group flex flex-col sm:flex-row items-center p-3 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer gap-4 relative"
                    >
                      <button
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 hover:bg-rose-500 text-slate-400 hover:text-white rounded-full shadow-sm backdrop-blur-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 border border-slate-100 hover:border-rose-500"
                        title="Xóa khỏi lịch sử"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                      <div className="relative w-full sm:w-44 aspect-video shrink-0 rounded-xl overflow-hidden bg-slate-200 shadow-sm">
                        <img
                          src={item.thumb_url || "/default-thumbnail.jpg"}
                          alt={item.movie_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-blue-600/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg backdrop-blur-sm">
                            <PlayCircle size={24} className="fill-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-extrabold px-2 py-1 rounded-md tracking-wider uppercase">
                          Tập {item.episode_number}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 w-full flex flex-col py-1 pr-6 sm:pr-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="text-base font-extrabold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {item.movie_name}
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 truncate mt-1">
                              {item.episode_name ||
                                `Tập ${item.episode_number}`}
                            </p>
                          </div>

                          <div className="hidden sm:flex flex-col items-end shrink-0 gap-1 opacity-60 group-hover:opacity-100 transition-opacity pr-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400">
                              {
                                formatLastWatched(item.last_watched_at).split(
                                  " ",
                                )[0]
                              }
                            </span>
                          </div>
                        </div>

                        {/* Timeline / Progress Bar */}
                        <div className="mt-auto w-full pt-2">
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">
                              Đã xem {Math.round(progressPercentage)}%
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 tabular-nums pr-2 sm:pr-0">
                              {formatDuration(item.watched_duration)}{" "}
                              <span className="mx-0.5 text-slate-300">/</span>{" "}
                              {formatDuration(item.total_duration)}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="h-full bg-blue-500 rounded-full relative"
                              style={{ width: `${progressPercentage}%` }}
                            >
                              <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
