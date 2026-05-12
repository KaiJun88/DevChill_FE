/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import {
  X,
  Pencil,
  Clapperboard,
  Calendar,
  Film,
  Video,
  Info,
  Filter,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getShowtimeByIdAdmin,
  createShowtimeAdmin,
  updateShowtimeAdmin,
} from "../../../api/showtimeAdminApi";
import { getAllMovies, getMovieById } from "../../../api/moviesAdminApi";

export default function ShowtimeModal({
  isOpen,
  showtimeId,
  mode,
  onClose,
  onReload,
}) {
  const [formData, setFormData] = useState({
    movie_id: "",
    episode_id: "",
    start_time: "",
    status: "scheduled",
    is_premiere: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [moviesList, setMoviesList] = useState([]);
  const [episodesList, setEpisodesList] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [isOriginallyLive, setIsOriginallyLive] = useState(false);

  const [filters, setFilters] = useState({
    type: "",
    is_premium: "",
    lifecycle_status: "",
  });

  const hasFilter = useMemo(() => {
    return Object.values(filters).some((value) => value !== "");
  }, [filters]);

  const formatDateTimeForInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      fetchMovies();
      if (mode === "create") {
        setFormData({
          movie_id: "",
          episode_id: "",
          start_time: "",
          status: "scheduled",
          is_premiere: true,
        });
        setIsOriginallyLive(false);
        setEpisodesList([]);
        setIsEditing(true);
      } else if (mode === "edit" && showtimeId) {
        fetchShowtimeDetails();
        setIsEditing(false);
      }
    }
  }, [isOpen, showtimeId, mode]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await getAllMovies({ limit: 500 });
      setMoviesList(res.data || []);
    } catch (err) {
      toast.error("Không tải được danh sách phim");
    } finally {
      setLoading(false);
    }
  };

  const fetchShowtimeDetails = async () => {
    try {
      setLoading(true);
      const res = await getShowtimeByIdAdmin(showtimeId);
      const data = res?.data || res;
      setIsOriginallyLive(data.status === "live");
      setFormData({
        ...data,
        start_time: formatDateTimeForInput(data.start_time),
      });
    } catch (err) {
      toast.error("Lỗi khi lấy chi tiết suất chiếu");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = useMemo(() => {
    return moviesList.filter((movie) => {
      const matchType = !filters.type || movie.type === filters.type;
      const matchPremium =
        !filters.is_premium || String(movie.is_premium) === filters.is_premium;
      const matchStatus =
        !filters.lifecycle_status ||
        movie.lifecycle_status === filters.lifecycle_status;
      return matchType && matchPremium && matchStatus;
    });
  }, [moviesList, filters]);

  const resetFilters = () =>
    setFilters({ type: "", is_premium: "", lifecycle_status: "" });

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!formData.movie_id) {
        setEpisodesList([]);
        return;
      }
      try {
        setLoadingEpisodes(true);
        const res = await getMovieById(formData.movie_id);
        const movieDetail = res.data;
        setEpisodesList(movieDetail?.episodes || []);
      } catch (error) {
        console.error("Lỗi lấy tập:", error);
      } finally {
        setLoadingEpisodes(false);
      }
    };
    fetchEpisodes();
  }, [formData.movie_id]);

  const handleSave = async () => {
    if (!formData.movie_id || !formData.episode_id || !formData.start_time) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const payload = {
        movie_id: Number(formData.movie_id),
        episode_id: Number(formData.episode_id),
        start_time: new Date(formData.start_time).toISOString(),
        status: formData.status,
        is_premiere: String(formData.is_premiere) === "true",
      };

      if (mode === "create") {
        await createShowtimeAdmin(payload);
        toast.success("Tạo thành công!");
      } else {
        await updateShowtimeAdmin(showtimeId, payload);
        toast.success("Cập nhật thành công!");
      }
      onReload();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lưu thất bại");
    }
  };

  if (!isOpen) return null;

  const inputBase =
    "w-full px-3 py-2 text-[13px] font-medium rounded-xl border transition-all outline-none";
  const editableStyle =
    "bg-white border-slate-200 text-slate-700 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5";
  const lockedStyle =
    "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clapperboard
              size={20}
              className={
                isOriginallyLive
                  ? "text-rose-500 animate-pulse"
                  : "text-blue-500"
              }
            />
            {mode === "create"
              ? "Tạo Lịch Công Chiếu"
              : isOriginallyLive
                ? "Suất Chiếu Trực Tiếp"
                : "Chi Tiết Suất Chiếu"}
          </h3>
          <div className="flex items-center gap-2">
            {mode === "edit" && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isEditing ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <Pencil size={14} /> {isEditing ? "Đang sửa" : "Chỉnh sửa"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {isOriginallyLive && isEditing && (
            <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3 text-amber-700 text-[12px] shadow-sm">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>
                Suất chiếu <strong>đang Live</strong>. Bạn chỉ có thể cập nhật
                Trạng thái để kết thúc hoặc hủy phiên chiếu.
              </p>
            </div>
          )}
          <div
            className={`p-4 rounded-2xl border transition-all space-y-3 ${isEditing && !isOriginallyLive ? "bg-slate-50 border-slate-100" : "bg-slate-50/50 border-transparent opacity-60"}`}
          >
            <div className="flex items-center justify-between min-h-5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Filter size={12} /> Bộ lọc nhanh
              </span>
              {hasFilter && isEditing && !isOriginallyLive && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                  <FilterX size={12} /> Xóa lọc
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={filters.type}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className={`${inputBase} h-9 text-xs ${isEditing && !isOriginallyLive ? "bg-white border-slate-200" : "bg-transparent border-transparent cursor-not-allowed"}`}
              >
                <option value="">Loại phim</option>
                <option value="movie">Phim lẻ</option>
                <option value="series">Phim bộ</option>
              </select>
              <select
                value={filters.is_premium}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFilters({ ...filters, is_premium: e.target.value })
                }
                className={`${inputBase} h-9 text-xs ${isEditing && !isOriginallyLive ? "bg-white border-slate-200" : "bg-transparent border-transparent cursor-not-allowed"}`}
              >
                <option value="">Phim Premium/Thường</option>
                <option value="true">Premium</option>
                <option value="false">Thường</option>
              </select>
              <select
                value={filters.lifecycle_status}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFilters({ ...filters, lifecycle_status: e.target.value })
                }
                className={`${inputBase} h-9 text-xs ${isEditing && !isOriginallyLive ? "bg-white border-slate-200" : "bg-transparent border-transparent cursor-not-allowed"}`}
              >
                <option value="">Trạng thái</option>
                <option value="upcoming">Sắp chiếu</option>
                <option value="ongoing">Đang chiếu</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                <Film size={14} /> Phim ({filteredMovies.length})
              </label>
              <select
                value={formData.movie_id}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    movie_id: e.target.value,
                    episode_id: "",
                  })
                }
                className={`${inputBase} ${isEditing && !isOriginallyLive ? editableStyle : lockedStyle} h-11`}
              >
                <option value="">-- Chọn phim --</option>
                {filteredMovies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    [{movie.year}] {movie.name} {movie.is_premium ? "💎" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                <Video size={14} /> Tập Phim
              </label>
              <select
                value={formData.episode_id}
                disabled={!isEditing || isOriginallyLive || !formData.movie_id}
                onChange={(e) =>
                  setFormData({ ...formData, episode_id: e.target.value })
                }
                className={`${inputBase} ${isEditing && !isOriginallyLive && formData.movie_id ? editableStyle : lockedStyle} h-11`}
              >
                <option value="">
                  {loadingEpisodes ? "Đang tải..." : "-- Chọn tập --"}
                </option>
                {episodesList.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.name || `Tập ${ep.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                <Calendar size={14} /> Giờ Bắt Đầu
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                className={`${inputBase} ${isEditing && !isOriginallyLive ? editableStyle : lockedStyle} h-11`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">
                Chế Độ Chiếu
              </label>
              <select
                value={formData.is_premiere}
                disabled={!isEditing || isOriginallyLive}
                onChange={(e) =>
                  setFormData({ ...formData, is_premiere: e.target.value })
                }
                className={`${inputBase} ${isEditing && !isOriginallyLive ? editableStyle : lockedStyle} h-11`}
              >
                <option value={true}>🔥 Công Chiếu Trực Tiếp (Live)</option>
                <option value={false}>Lịch Nháp</option>
              </select>
            </div>
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 ml-1">
                Trạng Thái Hiện Tại
              </label>
              <select
                value={formData.status}
                disabled={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={`${inputBase} ${isEditing ? "bg-white border-blue-400 ring-4 ring-blue-50" : lockedStyle} h-11 text-blue-600 font-bold`}
              >
                <option value="scheduled">Sắp chiếu</option>
                <option value="live">Đang Live</option>
                <option value="ended">Đã kết thúc</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 px-8 py-5 border-t bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Đóng
          </button>
          {(isEditing || mode === "create") && (
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 rounded-xl shadow-lg transition-all active:scale-95"
            >
              {mode === "create" ? "Tạo Lịch" : "Lưu thay đổi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
