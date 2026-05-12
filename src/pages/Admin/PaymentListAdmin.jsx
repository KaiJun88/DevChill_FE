import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  PackageX,
  CreditCard,
  DollarSign,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import PaymentModal from "../../components/Admin/Payments/PaymentModal";
import VerifyModal from "../../components/Admin/Payments/VerifyModal";

import { getAllPaymentsAdmin } from "../../api/paymentAdminApi";

export default function PaymentListAdmin() {
  const [allPayments, setAllPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOption, setSortOption] = useState("created_at-desc");

  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    revenue: 0,
  });

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [paymentToVerify, setPaymentToVerify] = useState(null);
  const isFilterActive =
    statusFilter !== "" || sortOption !== "created_at-desc";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPaymentsAdmin({});
      const data = res?.data || res || [];
      setAllPayments(data);

      const successList = data.filter((p) => p.status === "success");
      const revenue = successList.reduce((sum, p) => sum + Number(p.amount), 0);

      setStats({
        total: data.length,
        success: successList.length,
        pending: data.filter(
          (p) => p.status === "pending" || p.status === "failed",
        ).length,
        revenue: revenue,
      });
    } catch (err) {
      toast.error(err?.message || "Lỗi tải danh sách giao dịch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    let result = [...allPayments];
    if (debouncedKeyword) {
      const lowerKw = debouncedKeyword.toLowerCase();
      result = result.filter(
        (p) =>
          (p.transaction_code &&
            String(p.transaction_code).toLowerCase().includes(lowerKw)) ||
          (p.vnp_transaction_no &&
            String(p.vnp_transaction_no).toLowerCase().includes(lowerKw)) ||
          (p.username && String(p.username).toLowerCase().includes(lowerKw)),
      );
    }
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    const [key, order] = sortOption.split("-");
    result.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (key === "amount") {
        return order === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }
      valA = valA ? String(valA).toLowerCase() : "";
      valB = valB ? String(valB).toLowerCase() : "";

      if (order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    setFilteredPayments(result);
    setTotal(result.length);

    const startIndex = (page - 1) * limit;
    setPayments(result.slice(startIndex, startIndex + limit));
  }, [allPayments, debouncedKeyword, statusFilter, sortOption, page]);
  const handleResetFilters = () => {
    setStatusFilter("");
    setSortOption("created_at-desc");
    setPage(1);
  };

  const csvData = filteredPayments.map((p) => ({
    ID: p.id,
    Khach_hang: p.username,
    Goi: p.plan_name,
    So_tien: p.amount,
    Ma_GD: p.transaction_code,
    Phuong_thuc: p.payment_method,
    Trang_thai: p.status,
    Ngay_tao: new Date(p.created_at).toLocaleString("vi-VN"),
  }));

  const handleOpenDetail = (id) => {
    setSelectedPaymentId(id);
    setDetailModalOpen(true);
  };

  const handleOpenVerify = (payment) => {
    setPaymentToVerify(payment);
    setVerifyModalOpen(true);
  };

  const getStatusBadge = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (statusState?.toLowerCase()) {
      case "success":
        return {
          class: `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`,
          text: "Thành công",
        };
      case "failed":
        return {
          class: `${baseStyle} bg-rose-50 text-rose-600 border-rose-100`,
          text: "Thất bại",
        };
      case "pending":
        return {
          class: `${baseStyle} bg-amber-50 text-amber-600 border-amber-100`,
          text: "Đang xử lý",
        };
      case "cancelled":
        return {
          class: `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`,
          text: "Đã huỷ",
        };
      case "expired":
        return {
          class: `${baseStyle} bg-orange-50 text-orange-600 border-orange-100`,
          text: "Hết hạn",
        };
      default:
        return {
          class: `${baseStyle} bg-slate-50 text-slate-500 border-slate-100`,
          text: statusState,
        };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý Giao dịch
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Kiểm tra, đối soát và xác nhận giao dịch hệ thống 💳
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <DollarSign size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Doanh thu
                </div>
                <div className="text-xl font-black text-slate-800">
                  {formatCurrency(stats.revenue)}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng giao dịch
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
                  Thành công
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.success}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <AlertCircle size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Thất bại / Chờ
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.pending}
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
                  placeholder="Mã GD hoặc username..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Khach_hang",
                    "Goi",
                    "So_tien",
                    "Ma_GD",
                    "Phuong_thuc",
                    "Trang_thai",
                    "Ngay_tao",
                  ]}
                  fileName="DanhSachGiaoDich"
                />
                <button
                  onClick={fetchPayments}
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
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="success">Thành công</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="failed">Thất bại</option>
                  <option value="cancelled">Đã huỷ</option>
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
                    <option value="created_at-desc">
                      Ngày tạo: Mới nhất ➝ Cũ nhất
                    </option>
                    <option value="created_at-asc">
                      Ngày tạo: Cũ nhất ➝ Mới nhất
                    </option>
                  </optgroup>
                  <optgroup label="Giá trị">
                    <option value="amount-desc">Số tiền: Cao ➝ Thấp</option>
                    <option value="amount-asc">Số tiền: Thấp ➝ Cao</option>
                  </optgroup>
                  <optgroup label="Khách hàng">
                    <option value="username-asc">Username: A ➝ Z</option>
                    <option value="username-desc">Username: Z ➝ A</option>
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
                      Username
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Gói
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Số tiền
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Mã Giao Dịch
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Ngày tạo
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
                  {payments.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PackageX size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy giao dịch nào.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr
                        key={p.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 text-center font-semibold text-slate-400 text-[12px]">
                          #{p.id}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700 text-[13.5px] group-hover:text-blue-600 transition-colors">
                          {p.username || `User #${p.user_id}`}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600 text-[13px]">
                          {p.plan_name || "---"}
                        </td>
                        <td className="px-5 py-4 text-center font-bold text-blue-600 text-[13px]">
                          {formatCurrency(p.amount)}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-slate-500 text-[12.5px]">
                          {p.vnp_transaction_no || p.transaction_code || "---"}
                        </td>
                        <td className="px-5 py-4 text-center font-medium text-slate-400 text-[12.5px]">
                          {new Date(p.created_at).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className={getStatusBadge(p.status).class}>
                              {getStatusBadge(p.status).text}
                            </span>
                            {p.status !== "success" && p.failure_reason && (
                              <span
                                className="text-[9px] text-rose-500 mt-1 max-w-32 truncate"
                                title={p.failure_reason}
                              >
                                {p.failure_reason}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {p.status !== "success" && (
                              <button
                                onClick={() => handleOpenVerify(p)}
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                                title="Xác nhận thủ công"
                              >
                                <ShieldCheck size={18} strokeWidth={2.5} />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenDetail(p.id)}
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

      <PaymentModal
        isOpen={isDetailModalOpen}
        paymentId={selectedPaymentId}
        onClose={() => setDetailModalOpen(false)}
      />
      {isVerifyModalOpen && (
        <VerifyModal
          isOpen={isVerifyModalOpen}
          payment={paymentToVerify}
          onClose={() => setVerifyModalOpen(false)}
          onReload={fetchPayments}
        />
      )}
    </div>
  );
}
