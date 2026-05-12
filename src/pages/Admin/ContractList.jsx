/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Plus,
  Download,
  FileText,
  FileEdit,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowUpDown,
  PlayCircle,
  FilterX,
} from "lucide-react";
import { toast } from "react-toastify";

import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import ContractModal from "../../components/Admin/Contracts/ContractModal";

import {
  getContracts,
  createContract,
  updateContract,
  downloadContractFile,
} from "../../api/contractApi";

const STATUS_LABELS = {
  active: "Đang hiệu lực",
  draft: "Bản nháp",
  expired: "Hết hạn",
  cancelled: "Đã hủy",
};

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [sortOption, setSortOption] = useState("id-desc");
  const [selectedContract, setSelectedContract] = useState(null);
  const [isContractModalOpen, setContractModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    active: 0,
    expired: 0,
    cancelled: 0,
  });

  // Kiểm tra xem có bộ lọc nào đang được áp dụng không (không tính keyword)
  const isFilterActive = status !== "" || sortOption !== "id-desc";

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [keyword]);

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const [currentSort, currentOrder] = sortOption.split("-");
      const res = await getContracts({
        page,
        limit,
        name: debouncedKeyword,
        status: status,
        sort_by: currentSort,
        order: currentOrder,
      });
      const contractList = res?.data?.data || res?.data || [];

      setContracts(contractList);
      setTotal(res?.total || res?.data?.total || 0);
      setStats(
        res?.stats ||
          res?.data?.stats || {
            total: 0,
            draft: 0,
            active: 0,
            expired: 0,
            cancelled: 0,
          },
      );
    } catch (err) {
      toast.error("Lỗi tải danh sách hợp đồng");
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedKeyword, status, sortOption]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Hàm Reset toàn bộ Filters (Không clear ô tìm kiếm)
  const handleResetFilters = () => {
    setStatus("");
    setSortOption("id-desc");
    setPage(1);
  };

  const handleSaveContract = async (data) => {
    try {
      if (selectedContract?.id) {
        await updateContract(selectedContract.id, data);
        toast.success("Cập nhật hợp đồng thành công");
      } else {
        await createContract(data);
        toast.success("Tạo hợp đồng thành công");
      }
      await fetchContracts();
      setContractModalOpen(false);
      setSelectedContract(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleDownload = async (contract) => {
    if (!contract?.id) return;
    try {
      const blob = await downloadContractFile(contract.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        contract.name?.replace(/\s/g, "_") + ".pdf",
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Tải file thất bại");
    }
  };

  // Data xuất CSV
  const csvData = contracts.map((c) => ({
    ID: c.id,
    Tên: c.name,
    "Ngày bắt đầu": c.start_date || "-",
    "Ngày kết thúc": c.end_date || "-",
    "Trạng thái": STATUS_LABELS[c.status?.toLowerCase()] || c.status,
    File: c.file_url ? "Có" : "Không",
  }));

  const getStatusBadge = (status) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
    switch (status?.toLowerCase()) {
      case "active":
        return `${baseStyle} bg-emerald-50 text-emerald-600 border-emerald-100`;
      case "draft":
        return `${baseStyle} bg-slate-100 text-slate-500 border-slate-200`;
      case "expired":
        return `${baseStyle} bg-amber-50 text-amber-600 border-amber-100`;
      case "cancelled":
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
              Quản lý hợp đồng
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Theo dõi, chỉnh sửa và quản lý hợp đồng dễ dàng ✨
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <FileText size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng hợp đồng
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
                  Đang hiệu lực
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
                  Hết hạn / Hủy
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {stats.expired + stats.cancelled}
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
                  placeholder="Tìm kiếm hợp đồng..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Tên",
                    "Ngày bắt đầu",
                    "Ngày kết thúc",
                    "Trạng thái",
                    "File",
                  ]}
                  fileName="DanhSachHopDong"
                />
                <button
                  onClick={fetchContracts}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all shadow-sm"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Làm mới
                </button>
                <button
                  onClick={() => {
                    setSelectedContract(null);
                    setContractModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-200 rounded-xl transition-all"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Thêm mới
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-1"></div>

            {/* Hàng 2: Filters & Sắp xếp */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
              {/* Lọc */}
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
                  <option value="active">Đang hiệu lực</option>
                  <option value="expired">Hết hạn</option>
                  <option value="cancelled">Đã hủy</option>
                </select>

                {/* NÚT XÓA LỌC */}
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

              {/* Sắp xếp */}
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
                    <option value="id-desc">ID: Mới nhất</option>
                    <option value="id-asc">ID: Cũ nhất</option>
                  </optgroup>
                  <optgroup label="Tên hợp đồng">
                    <option value="name-asc">Tên: A ➝ Z</option>
                    <option value="name-desc">Tên: Z ➝ A</option>
                  </optgroup>
                  <optgroup label="Ngày tháng">
                    <option value="start_date-desc">
                      Ngày bắt đầu: Gần đây nhất
                    </option>
                    <option value="start_date-asc">
                      Ngày bắt đầu: Cũ nhất
                    </option>
                    <option value="end_date-desc">
                      Ngày kết thúc: Gần đây nhất
                    </option>
                    <option value="end_date-asc">Ngày kết thúc: Cũ nhất</option>
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
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-16">
                      ID
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Tên Hợp Đồng
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Bắt đầu
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Kết thúc
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Tập tin
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contracts.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <PlayCircle size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy hợp đồng nào khớp với điều kiện.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contracts.map((c) => (
                      <tr
                        key={c.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 font-semibold text-slate-400 text-[12px]">
                          #{c.id}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700 text-[13.5px] group-hover:text-blue-600 transition-colors">
                          {c.name}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-500 text-[13px] text-center">
                          {c.start_date || "-"}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-500 text-[13px] text-center">
                          {c.end_date || "-"}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={getStatusBadge(c.status)}>
                            {STATUS_LABELS[c.status?.toLowerCase()] || c.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {c.file_url ? (
                            <button
                              onClick={() => handleDownload(c)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md transition-colors mx-auto"
                            >
                              <Download size={14} strokeWidth={2.5} />
                              Tải File
                            </button>
                          ) : (
                            <span className="text-[12px] text-slate-300 italic font-medium">
                              Không có
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedContract(c);
                              setContractModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Xem chi tiết"
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

      {isContractModalOpen && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={() => {
            setContractModalOpen(false);
            setSelectedContract(null);
          }}
          contract={selectedContract}
          onSave={handleSaveContract}
          isEditMode={!selectedContract}
        />
      )}
    </div>
  );
}
