import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  PackageX,
  MessageSquareWarning,
  MessageCircle,
  Filter,
  ArrowUpDown,
  FilterX,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import SupportModal from "../../components/Admin/Support/SupportModal";

import {
  getAllSupportTicketsAdmin,
  getUnreadSupportCountAdmin,
} from "../../api/supportAdminApi";

export default function SupportAdminList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("created_at-desc");

  const [stats, setStats] = useState({
    unread: 0,
    total: 0,
    resolved: 0,
    inProgress: 0,
  });

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const isFilterActive =
    statusFilter !== "" || sortOption !== "created_at-desc" || keyword !== "";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Lấy tổng số vé chưa đọc (Chờ xử lý) toàn cục - API này đã chuẩn
      const unreadRes = await getUnreadSupportCountAdmin();
      const unreadCount =
        unreadRes?.data?.unread_count || unreadRes?.unread_count || 0;

      const [currentSort, currentOrder] = sortOption.split("-");

      // 2. Gọi API lấy danh sách vé kèm phân trang
      const res = await getAllSupportTicketsAdmin({
        page,
        limit,
        search: debouncedKeyword,
        status: statusFilter,
        sort_by: currentSort,
        order: currentOrder,
      });

      const ticketData = res?.data?.tickets || res?.tickets || res?.data || [];
      const totalItems =
        res?.data?.pagination?.total ||
        res?.pagination?.total ||
        ticketData.length;

      // 3. Lấy cục stats từ Backend trả về (Giống hệt bên Movie)
      const apiStats = res?.data?.stats || res?.stats || {};

      setTickets(ticketData);
      setTotal(totalItems);

      // FIX: Cập nhật Stats toàn cục dựa vào Backend thay vì đếm 5 item cục bộ
      setStats({
        unread: unreadCount, // Số lượng chờ xử lý từ API count riêng
        total: apiStats.total || totalItems,
        // Nếu Backend chưa kịp làm apiStats thì nó sẽ tạm đếm số ảo cục bộ để tránh lỗi UI
        resolved:
          apiStats.resolved !== undefined
            ? apiStats.resolved
            : ticketData.filter((t) => t.status === "resolved").length,
        inProgress:
          apiStats.in_progress !== undefined
            ? apiStats.in_progress
            : ticketData.filter((t) => t.status === "in_progress").length,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Lỗi tải danh sách hỗ trợ",
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedKeyword, statusFilter, sortOption]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleResetFilters = () => {
    setStatusFilter("");
    setSortOption("created_at-desc");
    setKeyword("");
    setPage(1);
  };

  const handleOpenDetail = (id) => {
    setSelectedTicketId(id);
    setModalOpen(true);
  };

  const csvData = tickets.map((t) => ({
    ID: t.id,
    Ma_Ve: t.ticket_code,
    Nguoi_Gui: t.user_name || "Khách vãng lai",
    Email_Lien_He: t.contact_email,
    Chu_De: t.category,
    Muc_Do: t.priority,
    Trang_Thai: t.status,
    Ngay_Tao: new Date(t.created_at).toLocaleString("vi-VN"),
  }));

  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "open":
        return {
          class: `${baseStyle} bg-amber-50 text-amber-600 border-amber-100`,
          text: "Chờ xử lý",
        };
      case "in_progress":
        return {
          class: `${baseStyle} bg-blue-50 text-blue-600 border-blue-100`,
          text: "Đang xử lý",
        };
      case "resolved":
        return {
          class: `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`,
          text: "Đã giải quyết",
        };
      case "closed":
        return {
          class: `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`,
          text: "Đã đóng",
        };
      default:
        return {
          class: `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`,
          text: statusState,
        };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return (
          <span className="text-rose-500 font-bold text-[12px] flex items-center justify-center gap-1">
            <AlertCircle size={12} /> Cao
          </span>
        );
      case "medium":
        return (
          <span className="text-amber-500 font-semibold text-[12px]">
            Trung bình
          </span>
        );
      case "low":
      default:
        return (
          <span className="text-slate-400 font-medium text-[12px]">Thấp</span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý Yêu cầu hỗ trợ
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Tiếp nhận, xử lý và phản hồi khiếu nại của người dùng 🎧
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                <MessageCircle size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng đơn
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.total}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 relative">
                <MessageSquareWarning size={20} strokeWidth={2.5} />
                {stats.unread > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Chờ xử lý
                </div>
                <div className="text-xl font-black text-slate-800">
                  {stats.unread}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Clock size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đang xử lý
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.inProgress}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <CheckCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Đã giải quyết
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.resolved}
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
                  placeholder="Mã vé, email hoặc username..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Ma_Ve",
                    "Nguoi_Gui",
                    "Email_Lien_He",
                    "Chu_De",
                    "Muc_Do",
                    "Trang_Thai",
                    "Ngay_Tao",
                  ]}
                  fileName="DanhSachHoTro"
                />
                <button
                  onClick={fetchTickets}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Làm mới
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
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 outline-none cursor-pointer shadow-sm font-medium text-slate-600"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="open">Chờ xử lý</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="closed">Đã đóng</option>
                </select>

                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg transition-all"
                  >
                    <FilterX size={14} strokeWidth={2.5} /> Xóa lọc
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
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 outline-none cursor-pointer shadow-sm font-semibold text-slate-700"
                >
                  <optgroup label="Thời gian tạo">
                    <option value="created_at-desc">
                      Ngày tạo: Gần đây nhất
                    </option>
                    <option value="created_at-asc">Ngày tạo: Cũ nhất</option>
                  </optgroup>
                  <optgroup label="Mức độ ưu tiên">
                    <option value="priority-desc">Ưu tiên: Giảm dần</option>
                    <option value="priority-asc">Ưu tiên: Tăng dần</option>
                  </optgroup>
                  <optgroup label="Trạng thái">
                    <option value="status-asc">Trạng thái (A-Z)</option>
                    <option value="status-desc">Trạng thái (Z-A)</option>
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
                      Mã Vé
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Người Gửi
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Chủ Đề
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Ưu Tiên
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Ngày Tạo
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Trạng Thái
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PackageX size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy yêu cầu hỗ trợ nào.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((t) => (
                      <tr
                        key={t.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 text-center font-semibold text-slate-400 text-[12px]">
                          #{t.id}
                        </td>
                        <td className="px-5 py-4 font-bold text-blue-600 text-[13px]">
                          {t.ticket_code}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-[13.5px] group-hover:text-blue-600 transition-colors">
                              {t.user_name || "Khách Vãng Lai"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {t.contact_email}
                            </span>
                          </div>
                        </td>
                        <td
                          className="px-5 py-4 font-semibold text-slate-600 text-[13px] max-w-50 truncate"
                          title={t.category}
                        >
                          {t.category}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {getPriorityBadge(t.priority)}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-slate-400 text-[12.5px]">
                          {new Date(t.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={getStatusBadge(t.status).class}>
                            {getStatusBadge(t.status).text}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleOpenDetail(t.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Xem chi tiết & Phản hồi"
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

      <SupportModal
        isOpen={isModalOpen}
        ticketId={selectedTicketId}
        onClose={() => setModalOpen(false)}
        onReload={fetchTickets}
      />
    </div>
  );
}
