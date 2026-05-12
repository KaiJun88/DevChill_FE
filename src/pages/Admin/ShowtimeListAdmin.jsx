import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Radio,
  CalendarClock,
  CheckSquare,
  Clapperboard,
  PackageX,
  Filter,
  ArrowUpDown,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import ShowtimeModal from "../../components/Admin/Showtimes/ShowtimeModal";

import { getAllShowtimesAdmin } from "../../api/showtimeAdminApi";

const STATUS_LABELS = {
  scheduled: "Sắp chiếu",
  live: "Đang chiếu",
  ended: "Đã kết thúc",
  cancelled: "Đã hủy",
};

export default function ShowtimeListAdmin() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("start_time-desc");

  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    live: 0,
    ended: 0,
  });

  const [selectedId, setSelectedId] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [isModalOpen, setModalOpen] = useState(false);

  const isFilterActive =
    keyword !== "" || statusFilter !== "" || sortOption !== "start_time-desc";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchShowtimes = useCallback(async () => {
    try {
      setLoading(true);
      const [currentSort, currentOrder] = sortOption.split("-");

      const queryParams = {
        page,
        limit,
        sort_by: currentSort,
        order: currentOrder,
      };

      if (debouncedKeyword) queryParams.keyword = debouncedKeyword;
      if (statusFilter) queryParams.status = statusFilter;

      const res = await getAllShowtimesAdmin(queryParams);

      setShowtimes(res?.data || []);
      const totalItems = res?.pagination?.total || 0;
      setTotal(totalItems);
      const backendStats = res?.stats || {};
      setStats({
        total: Number(backendStats.total) || totalItems,
        scheduled: Number(backendStats.scheduled) || 0,
        live: Number(backendStats.live) || 0,
        ended: Number(backendStats.ended) || 0,
      });
    } catch (err) {
      toast.error(err?.message || "Lỗi tải danh sách công chiếu");
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedKeyword, statusFilter, sortOption]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (id) => {
    setModalMode("edit");
    setSelectedId(id);
    setModalOpen(true);
  };

  const handleResetFilters = () => {
    setKeyword("");
    setStatusFilter("");
    setSortOption("start_time-desc");
    setPage(1);
  };

  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "live":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-200 animate-pulse`;
      case "scheduled":
        return `${baseStyle} bg-amber-50 text-amber-600 border-amber-200`;
      case "ended":
        return `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`;
      case "cancelled":
        return `${baseStyle} bg-red-50 text-red-600 border-red-100`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const csvData = showtimes.map((s) => ({
    ID: s.id,
    Phim: s.movie_name,
    Tập: s.episode_name || (s.episode_number ? `Tập ${s.episode_number}` : "-"),
    "Thời gian bắt đầu": s.start_time
      ? new Date(s.start_time).toLocaleString("vi-VN")
      : "-",
    "Thời gian kết thúc": s.end_time
      ? new Date(s.end_time).toLocaleString("vi-VN")
      : "-",
    "Trạng thái": STATUS_LABELS[s.status?.toLowerCase()] || s.status,
  }));

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          <div className="flex justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Quản lý Công Chiếu
              </h1>
              <p className="text-[14px] text-slate-500 font-medium">
                Sắp xếp lịch Công chiếu, đồng bộ thời gian xem cho toàn hệ thống
                🎬
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Clapperboard size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng suất chiếu
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50/70 flex items-center justify-center text-amber-500">
                <CalendarClock size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Sắp chiếu
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.scheduled}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-rose-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Radio size={20} strokeWidth={2.5} className="animate-pulse" />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang chiếu (LIVE)
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.live}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <CheckSquare size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đã kết thúc
                </div>
                <div className="text-xl font-black text-slate-800">
                  {stats.ended}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-80">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm tên phim, tập phim..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Phim",
                    "Tập",
                    "Thời gian bắt đầu",
                    "Thời gian kết thúc",
                    "Trạng thái",
                  ]}
                  fileName="DanhSachCongChieu"
                />
                <button
                  onClick={fetchShowtimes}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Làm mới
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 rounded-xl transition-all"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Tạo suất chiếu
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-1"></div>

            {/* Filters & Sắp xếp */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 text-slate-400">
                  <Filter size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Lọc:
                  </span>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="scheduled">Sắp chiếu</option>
                  <option value="live">Đang chiếu</option>
                  <option value="ended">Đã kết thúc</option>
                  <option value="cancelled">Đã hủy</option>
                </select>

                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:text-rose-600 rounded-lg transition-all shadow-sm"
                    title="Xóa tất cả bộ lọc"
                  >
                    <FilterX size={14} strokeWidth={2.5} />
                    Xóa lọc
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 text-slate-400 border-l border-slate-200 pl-3">
                  <ArrowUpDown size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Sắp xếp:
                  </span>
                </div>

                <select
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-700 font-semibold outline-none cursor-pointer transition-all shadow-sm"
                >
                  <optgroup label="Thời gian">
                    <option value="start_time-desc">
                      Bắt đầu chiếu: Mới nhất ➝ Cũ nhất
                    </option>
                    <option value="start_time-asc">
                      Bắt đầu chiếu: Cũ nhất ➝ Mới nhất
                    </option>
                  </optgroup>
                  <optgroup label="Thông tin">
                    <option value="id-desc">ID: Mới thêm gần đây</option>
                    <option value="id-asc">ID: Cũ nhất</option>
                    <option value="movie_name-asc">Tên phim: A ➝ Z</option>
                    <option value="movie_name-desc">Tên phim: Z ➝ A</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden relative min-h-100">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-all duration-300">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-blue-500" size={28} />
                  <span className="text-[13px] font-medium text-slate-600">
                    Đang tải dữ liệu...
                  </span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center w-16">
                      ID
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Phim
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Tập
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Thời gian bắt đầu
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Thời gian kết thúc
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showtimes.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PackageX size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy suất chiếu nào khớp với điều kiện.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    showtimes.map((s) => (
                      <tr
                        key={s.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 text-center font-semibold text-slate-400 text-[12px]">
                          #{s.id}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700 text-[13.5px] group-hover:text-blue-600 transition-colors">
                          {s.movie_name}
                          {s.is_premiere && (
                            <span className="ml-2 text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide inline-block transform -translate-y-px">
                              Công chiếu
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-500 text-center text-[13px]">
                          {s.episode_name ||
                            (s.episode_number
                              ? `Tập ${s.episode_number}`
                              : "-")}
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-emerald-600 text-[13px]">
                          {formatDate(s.start_time)}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-slate-400 text-[12.5px]">
                          {formatDate(s.end_time)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={getStatusBadge(s.status)}>
                            {STATUS_LABELS[s.status?.toLowerCase()] || s.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleOpenEdit(s.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Chi tiết & Chỉnh sửa"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 py-3 flex justify-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / limit) || 1}
            onPageChange={setPage}
            totalItems={total}
            itemsPerPage={limit}
          />
        </div>
      </div>

      <ShowtimeModal
        isOpen={isModalOpen}
        showtimeId={selectedId}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onReload={fetchShowtimes}
      />
    </div>
  );
}
