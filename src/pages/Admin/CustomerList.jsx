/* eslint-disable no-useless-catch */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Users,
  Star,
  ShieldAlert,
  UserX,
  Filter,
  ArrowUpDown,
  UserCheck,
  FilterX, // Thêm icon FilterX
} from "lucide-react";
import ExportCSV from "../../components/common/ExportCSV";
import Pagination from "../../components/Admin/Pagination";
import CustomerModal from "../../components/Admin/Users/CustomerModal";
import LockModal from "../../components/Admin/Users/LockModal";
import {
  getUsers,
  updateUser,
  lockUser,
  unlockUser,
} from "../../api/adUserApi";
import { toast } from "react-toastify";

export default function CustomerList() {
  const [users, setUsers] = useState([]);
  const [loadingLock, setLoadingLock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("id-desc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isLockModalOpen, setLockModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isFilterActive =
    searchTerm !== "" || statusFilter !== "all" || sortOption !== "id-desc";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers({
        page: 1,
        limit: 100,
        search: "",
      });
      const userList =
        res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
      setUsers(userList);
    } catch {
      toast.error("Lỗi tải dữ liệu");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    let result = users.filter((u) => {
      const matchSearch =
        u.username?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword);

      let matchStatus = true;
      if (statusFilter === "active") matchStatus = u.is_active;
      if (statusFilter === "inactive") matchStatus = !u.is_active;
      if (statusFilter === "locked") matchStatus = u.is_locked;

      return matchSearch && matchStatus;
    });
    const [key, order] = sortOption.split("-");
    result.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (key === "id") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      valA = valA ? String(valA).toLowerCase() : "";
      valB = valB ? String(valB).toLowerCase() : "";

      if (order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [users, searchTerm, statusFilter, sortOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortOption]);

  const itemsPerPage = 5;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage),
  );

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleSaveCustomer = async (data) => {
    try {
      await updateUser(selectedUser.id, {
        email: data.email,
        password: data.password || undefined,
        is_premium: data.is_premium,
        role: data.role,
      });

      toast.success("Cập nhật thành công");
      await fetchUsers();
      setCustomerModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      throw err;
    }
  };

  const handleLockConfirm = async (userId, data) => {
    try {
      setLoadingLock(true);
      if (!data) {
        await unlockUser(userId);
        toast.success("Đã mở khóa");
      } else {
        await lockUser(userId, data);
        toast.success("Đã khóa tài khoản");
      }
      await fetchUsers();
      setLockModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setLoadingLock(false);
    }
  };

  // Hàm Reset toàn bộ Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortOption("id-desc");
    setCurrentPage(1);
  };

  const badge = (style) =>
    `inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style}`;

  const getGenderText = (gender) => {
    if (gender === "male") return "Nam";
    if (gender === "female") return "Nữ";
    if (gender === "other") return "Khác";
    return "Không rõ";
  };

  const csvData = filteredUsers.map((u) => ({
    ID: u.id,
    Tên: u.username,
    Email: u.email,
    Giới_tính: getGenderText(u.gender),
    Gói: u.is_premium ? "Premium" : "Free",
    Trạng_thái: u.is_active ? "Active" : "Inactive",
    Khóa: u.is_locked ? "Locked" : "Normal",
  }));

  return (
    <div className="flex min-h-screen bg-[#FCFDFE]">
      <div className="flex flex-col relative w-full min-h-full bg-[#FCFDFE]">
        <div className="space-y-5 flex-1 w-full">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Quản lý khách hàng
            </h1>
            <p className="text-[14px] text-slate-500 font-medium">
              Theo dõi và quản lý tài khoản người dùng một cách chuyên nghiệp 🚀
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50/70 flex items-center justify-center text-blue-500">
                <Users size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Tổng users
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-amber-50/70 flex items-center justify-center text-amber-500">
                <Star size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Premium
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => u.is_premium).length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50/70 flex items-center justify-center text-emerald-500">
                <UserCheck size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Hoạt động
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => u.is_active).length}
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4 transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-rose-50/70 flex items-center justify-center text-rose-500">
                <ShieldAlert size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-slate-400 text-[11px] font-semibold mb-0.5 uppercase tracking-wider">
                  Bị khóa
                </div>
                <div className="text-2xl font-black text-slate-800">
                  {users.filter((u) => u.is_locked).length}
                </div>
              </div>
            </div>
          </div>

          {/* Công cụ & Bộ lọc */}
          <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-[0_4_40px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-80">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm username, email..."
                  className="w-full pl-10 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <ExportCSV
                  data={csvData}
                  fields={[
                    "ID",
                    "Tên",
                    "Email",
                    "Giới_tính",
                    "Gói",
                    "Trạng_thái",
                    "Khóa",
                  ]}
                  fileName="DanhSachKhachHang"
                />
                <button
                  onClick={fetchUsers}
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
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-600 font-medium outline-none cursor-pointer transition-all shadow-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Chưa kích hoạt</option>
                  <option value="locked">Bị khóa</option>
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

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2 text-slate-400 border-l border-slate-200 pl-3">
                  <ArrowUpDown size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Sắp xếp:
                  </span>
                </div>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 text-[12px] bg-white border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 text-slate-700 font-semibold outline-none cursor-pointer transition-all shadow-sm"
                >
                  <optgroup label="Cơ bản">
                    <option value="id-desc">ID: Mới nhất ➝ Cũ nhất</option>
                    <option value="id-asc">ID: Cũ nhất ➝ Mới nhất</option>
                  </optgroup>
                  <optgroup label="Alphabet">
                    <option value="username-asc">Tên: A ➝ Z</option>
                    <option value="username-desc">Tên: Z ➝ A</option>
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
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-16 text-center">
                      ID
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Khách hàng
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                      Giới tính
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Gói
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">
                      Tình trạng
                    </th>
                    <th className="px-5 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.length === 0 && !loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-20 bg-white">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Users size={36} className="text-slate-200" />
                          <span className="text-[14px] font-medium text-slate-500">
                            Không tìm thấy khách hàng nào.
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-blue-50/40 odd:bg-white even:bg-slate-50/60 transition-colors duration-200 border-b border-slate-50 last:border-0"
                      >
                        <td className="px-5 py-4 text-center font-semibold text-slate-400 text-[12px]">
                          #{user.id}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700 text-[13.5px] group-hover:text-blue-600 transition-colors">
                              {user.username}
                            </span>
                            <span className="text-[12px] text-slate-400 font-medium mt-0.5">
                              {user.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-500 text-[13px]">
                          {getGenderText(user.gender)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={badge(
                              user.is_premium
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-slate-50 text-slate-500 border-slate-100",
                            )}
                          >
                            {user.is_premium ? "Premium" : "Free"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={badge(
                              user.is_active
                                ? "bg-blue-50 text-blue-500 border-blue-100"
                                : "bg-slate-50 text-slate-500 border-slate-100",
                            )}
                          >
                            {user.is_active ? "Hoạt động" : "Chưa kích hoạt"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={badge(
                              user.is_locked
                                ? "bg-rose-50 text-rose-500 border-rose-100"
                                : "bg-emerald-50 text-emerald-500 border-emerald-100",
                            )}
                          >
                            {user.is_locked ? "Bị khóa" : "Bình thường"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setCustomerModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} strokeWidth={2.5} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setLockModalOpen(true);
                              }}
                              className={`p-2 rounded-lg transition-all ${user.is_locked ? "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"}`}
                              title={
                                user.is_locked ? "Mở khóa" : "Khóa tài khoản"
                              }
                            >
                              {user.is_locked ? (
                                <Unlock size={18} strokeWidth={2.5} />
                              ) : (
                                <Lock size={18} strokeWidth={2.5} />
                              )}
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveCustomer}
      />

      <LockModal
        isOpen={isLockModalOpen}
        onClose={() => {
          setLockModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleLockConfirm}
        loading={loadingLock}
      />
    </div>
  );
}
