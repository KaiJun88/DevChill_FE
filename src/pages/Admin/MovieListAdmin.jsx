/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Film,
  CheckCircle,
  AlertCircle,
  FileEdit,
  PlayCircle,
  Filter,
  ArrowUpDown,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import MoviesModal from "../../components/Admin/Movies/MoviesModal";

import { getAllMovies } from "../../api/moviesAdminApi";
const STATUS_LABELS = {
  draft: "Bản nháp",
  published: "Đã xuất bản",
  hidden: "Đã ẩn",
  active: "Hoạt động",
  expired: "Hết hạn",
};

const LIFECYCLE_LABELS = {
  upcoming: "Sắp chiếu",
  ongoing: "Đang phát",
  completed: "Hoàn thành",
};

const TYPE_LABELS = {
  movie: "Phim lẻ",
  series: "Phim bộ",
};

export default function MoviesListAdmin() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [lifecycleStatus, setLifecycleStatus] = useState("");
  const [isPremium, setIsPremium] = useState("");
  const [type, setType] = useState("");
  const [sortOption, setSortOption] = useState("id-desc");

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    hidden: 0,
  });
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("edit");
  const isFilterActive =
    keyword !== "" ||
    status !== "" ||
    lifecycleStatus !== "" ||
    isPremium !== "" ||
    type !== "" ||
    sortOption !== "id-desc";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchMovies = useCallback(async () => {
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
      if (status) queryParams.status = status;
      if (type) queryParams.type = type;
      if (lifecycleStatus) queryParams.lifecycle_status = lifecycleStatus;
      if (isPremium === "true") queryParams.is_premium = true;
      if (isPremium === "false") queryParams.is_premium = false;

      const res = await getAllMovies(queryParams);

      setMovies(res?.data || []);
      setTotal(res?.pagination?.total || 0);
      setStats(
        res?.stats || {
          total: 0,
          draft: 0,
          published: 0,
          hidden: 0,
        },
      );
    } catch (err) {
      toast.error("Lỗi tải danh sách phim");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedKeyword,
    status,
    lifecycleStatus,
    type,
    isPremium,
    sortOption,
  ]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  const handleResetFilters = () => {
    setKeyword("");
    setStatus("");
    setLifecycleStatus("");
    setIsPremium("");
    setType("");
    setSortOption("id-desc");
    setPage(1);
  };

  const csvData = movies.map((m) => ({
    ID: m.id,
    Tên: m.name,
    Năm: m.year || "-",
    Loại: TYPE_LABELS[m.type?.toLowerCase()] || m.type,
    Tập: m.episode_total,
    "Trạng thái": STATUS_LABELS[m.status?.toLowerCase()] || m.status,
    "Tiến độ":
      LIFECYCLE_LABELS[m.lifecycle_status?.toLowerCase()] || m.lifecycle_status,
  }));

  const handleOpenCreate = () => {
    setSelectedMovieId(null);
    setMode("create");
    setModalOpen(true);
  };

  const handleOpenDetail = (movie) => {
    setSelectedMovieId(movie.id);
    setMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMovieId(null);
  };

  const getStatusBadge = (status) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (status?.toLowerCase()) {
      case "published":
      case "active":
        return `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`;
      case "draft":
        return `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`;
      case "hidden":
      case "expired":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-100`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý phim
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Theo dõi, biên tập và điều phối nội dung phim ✨
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Film size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng phim
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <FileEdit size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Bản nháp
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.draft}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <CheckCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đã xuất bản
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.published}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang ẩn
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.hidden}
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
                  placeholder="Tìm kiếm phim..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Tên",
                    "Năm",
                    "Loại",
                    "Tập",
                    "Trạng thái",
                    "Tiến độ",
                  ]}
                  fileName="DanhSachPhim"
                />
                <button
                  onClick={fetchMovies}
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
                  Thêm mới
                </button>
              </div>
            </div>
            <div className="h-px w-full bg-slate-100 my-1"></div>
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 text-slate-400">
                  <Filter size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Lọc:
                  </span>
                </div>

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="hidden">Đã ẩn</option>
                </select>
                <select
                  value={lifecycleStatus}
                  onChange={(e) => {
                    setLifecycleStatus(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả tiến độ</option>
                  <option value="upcoming">Sắp chiếu</option>
                  <option value="ongoing">Đang phát</option>
                  <option value="completed">Hoàn thành</option>
                </select>

                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả loại</option>
                  <option value="movie">Phim lẻ </option>
                  <option value="series">Phim bộ</option>
                </select>

                <select
                  value={isPremium}
                  onChange={(e) => {
                    setIsPremium(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả gói</option>
                  <option value="true">Premium (VIP)</option>
                  <option value="false">Miễn phí (Free)</option>
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
                  <optgroup label="Cơ bản">
                    <option value="id-desc">ID: Mới thêm gần đây</option>
                    <option value="id-asc">ID: Cũ nhất</option>
                  </optgroup>
                  <optgroup label="Tập phim">
                    <option value="episode_total-desc">
                      Số tập: Nhiều nhất ➝ Ít nhất
                    </option>
                    <option value="episode_total-asc">
                      Số tập: Ít nhất ➝ Nhiều nhất
                    </option>
                  </optgroup>
                  <optgroup label="Năm sản xuất">
                    <option value="year-desc">Năm: Mới nhất ➝ Cũ nhất</option>
                    <option value="year-asc">Năm: Cũ nhất ➝ Mới nhất</option>
                  </optgroup>
                  <optgroup label="Tên phim">
                    <option value="name-asc">Tên: A ➝ Z</option>
                    <option value="name-desc">Tên: Z ➝ A</option>
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
                      Năm
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Loại
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Số tập
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Gói
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
                  {movies.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PlayCircle size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy phim nào khớp với điều kiện lọc.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    movies.map((m) => (
                      <tr
                        key={m.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-3 text-center font-semibold text-slate-400 text-[12px]">
                          #{m.id}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.poster_url}
                              alt={m.name}
                              className="w-10 h-14 object-cover rounded-md shadow-sm border border-slate-200/60"
                            />
                            <div className="font-bold text-slate-700 text-[13.5px] truncate max-w-50 group-hover:text-blue-600 transition-colors">
                              {m.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-center font-medium text-slate-500 text-[13px]">
                          {m.year || "-"}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-tight ${m.type === "movie" ? "text-orange-500" : "text-purple-500"}`}
                          >
                            {TYPE_LABELS[m.type?.toLowerCase()] || m.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center font-bold text-slate-600 text-[13px]">
                          {m.episode_total}
                        </td>
                        <td className="px-5 py-3 text-center">
                          {m.is_premium ? (
                            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                              VIP
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={getStatusBadge(m.status)}>
                              {STATUS_LABELS[m.status?.toLowerCase()] ||
                                m.status}
                            </span>
                            {m.lifecycle_status && (
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {LIFECYCLE_LABELS[
                                  m.lifecycle_status?.toLowerCase()
                                ] || m.lifecycle_status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleOpenDetail(m)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Xem & Chỉnh sửa"
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
            totalPages={Math.ceil(total / limit)}
            onPageChange={setPage}
            totalItems={total}
            itemsPerPage={limit}
          />
        </div>
      </div>
      {isModalOpen && (
        <MoviesModal
          movieId={selectedMovieId}
          mode={mode}
          onClose={handleCloseModal}
          onReload={fetchMovies}
        />
      )}
    </div>
  );
}
