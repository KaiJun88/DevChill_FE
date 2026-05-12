import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Crown,
  CheckCircle,
  AlertCircle,
  PackageX,
  ToggleLeft,
  ToggleRight,
  Filter,
  ArrowUpDown,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import PlanModal from "../../components/Admin/Plans/PlanModal";
import ConfirmToggleModal from "../../components/Admin/Plans/ConfirmToggleModal";

import { getAllPlansAdmin, togglePlanStatus } from "../../api/planAdminApi";

const STATUS_LABELS = {
  active: "Đang bán",
  inactive: "Ngừng bán",
};

export default function PlanListAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("id-desc");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    popular: 0,
  });

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("edit");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [planToToggle, setPlanToToggle] = useState(null);
  const [toggling, setToggling] = useState(false);
  const isFilterActive = statusFilter !== "" || sortOption !== "id-desc";
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);
  const fetchPlans = useCallback(async () => {
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

      const res = await getAllPlansAdmin(queryParams);

      const data = res?.data || [];
      const totalItems = res?.pagination?.total ?? 0;

      setPlans(data);
      setTotal(totalItems);

      // Lấy chuẩn dữ liệu thống kê từ Backend trả về cho toàn page
      const backendStats = res?.stats || {};
      setStats({
        total: Number(backendStats.total) || totalItems,
        active: Number(backendStats.active) || 0,
        inactive: Number(backendStats.inactive) || 0,
        popular: Number(backendStats.popular) || 0,
      });
    } catch (err) {
      toast.error(err?.message || "Lỗi tải danh sách gói dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedKeyword, statusFilter, sortOption]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Hàm Reset toàn bộ Filters (Không clear ô tìm kiếm)
  const handleResetFilters = () => {
    setStatusFilter("");
    setSortOption("id-desc");
    setPage(1);
  };

  const csvData = plans.map((p) => ({
    ID: p.id,
    "Tên gói": p.name,
    "Giá (VNĐ)": p.price,
    "Thời hạn (ngày)": p.duration_days,
    "Phổ biến": p.is_popular ? "Có" : "Không",
    "Trạng thái": STATUS_LABELS[p.status?.toLowerCase()] || p.status,
  }));

  const handleOpenCreate = () => {
    setSelectedPlanId(null);
    setMode("create");
    setModalOpen(true);
  };

  const handleOpenDetail = (plan) => {
    setSelectedPlanId(plan.id);
    setMode("edit");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPlanId(null);
  };

  const handleToggleClick = (plan) => {
    setPlanToToggle(plan);
    setIsConfirmOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!planToToggle) return;
    try {
      setToggling(true);
      await togglePlanStatus(planToToggle.id);
      toast.success(
        `Đã ${planToToggle.status === "active" ? "khóa" : "kích hoạt"} gói thành công`,
      );
      setIsConfirmOpen(false);
      fetchPlans();
    } catch (err) {
      toast.error(err?.message || "Lỗi khi thay đổi trạng thái");
    } finally {
      setToggling(false);
    }
  };

  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "active":
        return `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`;
      case "inactive":
        return `${baseStyle} bg-rose-50 text-rose-600 border-rose-100`;
      default:
        return `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý gói dịch vụ
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Thiết lập giá, thời hạn và tính năng cho các gói Premium 💎
            </p>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Crown size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng số gói
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <CheckCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang bán
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.active}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Ngừng bán
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.inactive}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <Crown size={20} fill="currentColor" strokeWidth={1} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Phổ biến
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.popular}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setKeyword("");
                    }
                  }}
                  placeholder="Tìm kiếm tên gói..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Tên gói",
                    "Giá (VNĐ)",
                    "Thời hạn (ngày)",
                    "Phổ biến",
                    "Trạng thái",
                  ]}
                  fileName="DanhSachGoiVIP"
                />
                <button
                  onClick={fetchPlans}
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

            {/* Lọc và Sắp xếp */}
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
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
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
                    <option value="id-desc">ID: Mới nhất ➝ Cũ nhất</option>
                    <option value="id-asc">ID: Cũ nhất ➝ Mới nhất</option>
                  </optgroup>
                  <optgroup label="Giá trị & Thời hạn">
                    <option value="price-asc">Giá: Thấp ➝ Cao</option>
                    <option value="price-desc">Giá: Cao ➝ Thấp</option>
                    <option value="duration_days-asc">
                      Thời hạn: Ngắn ➝ Dài
                    </option>
                    <option value="duration_days-desc">
                      Thời hạn: Dài ➝ Ngắn
                    </option>
                  </optgroup>
                  <optgroup label="Alphabet">
                    <option value="name-asc">Tên gói: A ➝ Z</option>
                    <option value="name-desc">Tên gói: Z ➝ A</option>
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
                      Tên gói
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Giá (VNĐ)
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Thời hạn
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Tùy chọn
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
                  {plans.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PackageX size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy gói dịch vụ nào.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    plans.map((p) => (
                      <tr
                        key={p.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 text-center font-semibold text-slate-400 text-[12px]">
                          #{p.id}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700 text-[13.5px] truncate max-w-50 group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-blue-600 text-[13px]">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-slate-500 text-[13px]">
                          {p.duration_days} ngày
                        </td>
                        <td className="px-5 py-4 text-center">
                          {p.is_popular && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100 text-[10px] font-black uppercase tracking-wide">
                              <Crown size={12} fill="currentColor" /> Hot
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={getStatusBadge(p.status)}>
                            {STATUS_LABELS[p.status?.toLowerCase()] || p.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleToggleClick(p)}
                              className={`p-2 rounded-lg transition-all ${
                                p.status === "active"
                                  ? "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                  : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50"
                              }`}
                              title={
                                p.status === "active" ? "Khóa gói" : "Kích hoạt"
                              }
                            >
                              {p.status === "active" ? (
                                <ToggleRight size={18} strokeWidth={2.5} />
                              ) : (
                                <ToggleLeft size={18} strokeWidth={2.5} />
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenDetail(p)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                              title="Chi tiết"
                            >
                              <Eye size={18} strokeWidth={2.5} />
                            </button>
                          </div>
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

      <ConfirmToggleModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmToggleStatus}
        isLoading={toggling}
        title="Xác nhận thay đổi?"
        type={planToToggle?.status === "active" ? "danger" : "success"}
        confirmText="Xác nhận ngay"
        content={
          <p>
            Bạn có chắc chắn muốn{" "}
            {planToToggle?.status === "active"
              ? "ngừng kinh doanh"
              : "kích hoạt lại"}{" "}
            gói
            <span className="font-bold text-slate-700">
              {" "}
              {planToToggle?.name}
            </span>{" "}
            không?
          </p>
        }
      />

      <PlanModal
        isOpen={isModalOpen}
        planId={selectedPlanId}
        mode={mode}
        onClose={handleCloseModal}
        onReload={fetchPlans}
      />
    </div>
  );
}
