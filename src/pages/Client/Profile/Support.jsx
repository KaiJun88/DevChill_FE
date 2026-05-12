/* eslint-disable no-unused-vars */

import { useState, useEffect, useCallback } from "react";
import {
  Send,
  History,
  CheckCircle2,
  Clock,
  FileImage,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import { getAccessToken } from "../../../utils/auth";
import {
  createTicketClient,
  getMyTicketsClient,
} from "../../../api/supportUserApi";
import SupportClientModal from "../../../components/Client/Support/SupportClientModal";

export default function Support() {
  const token = getAccessToken();
  const [activeTab, setActiveTab] = useState("create");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Tài khoản");
  const [description, setDescription] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 10;
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMyTickets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getMyTicketsClient();
      setTickets(res?.data || res || []);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === "history" && token) fetchMyTickets();
  }, [activeTab, fetchMyTickets, token]);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!description.trim())
      return toast.warning("Vui lòng nhập nội dung cần hỗ trợ!");

    try {
      setLoading(true);
      await createTicketClient({
        category,
        description,
        attachments: previewImages,
      });
      toast.success("Đã gửi yêu cầu thành công!");
      setDescription("");
      setPreviewImages([]);
      setActiveTab("history");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi gửi yêu cầu!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      return toast.warning("Chỉ tải lên tối đa 3 ảnh!");
    }
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });
    try {
      const base64Images = await Promise.all(promises);
      setPreviewImages([...previewImages, ...base64Images]);
    } catch (error) {
      toast.error("Lỗi khi đọc ảnh!");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "open":
        return { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700" };
      case "in_progress":
        return { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" };
      case "resolved":
        return {
          label: "Đã giải quyết",
          color: "bg-emerald-100 text-emerald-700",
        };
      default:
        return { label: "Đã đóng", color: "bg-slate-100 text-slate-600" };
    }
  };

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((t) =>
          filterStatus === "pending"
            ? ["open", "in_progress"].includes(t.status)
            : ["resolved", "closed"].includes(t.status),
        );

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const paginatedTickets = filteredTickets.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const handleTabChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  if (!token)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Vui lòng đăng nhập để sử dụng tính năng này!
      </div>
    );

  return (
    <main className="flex-1 w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 lg:p-8 flex flex-col h-200">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-lg font-extrabold text-slate-900">
          Trung Tâm Hỗ Trợ 🎧
        </h3>
        {activeTab === "history" && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">
              Trang {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg border transition-all ${currentPage === 0 ? "bg-slate-50 text-slate-300 border-slate-100" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500 shadow-sm"}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className={`p-2 rounded-lg border transition-all ${currentPage === totalPages - 1 ? "bg-slate-50 text-slate-300 border-slate-100" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500 shadow-sm"}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-2xl w-fit mb-6 shrink-0">
        <button
          onClick={() => setActiveTab("create")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "create" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Send size={16} /> Gửi yêu cầu
        </button>
        <button
          onClick={() => {
            setActiveTab("history");
            setCurrentPage(0);
          }}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "history" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <History size={16} /> Lịch sử của tôi
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {activeTab === "create" && (
          <div className="max-w-3xl overflow-y-auto hidden-scrollbar pr-2 h-full">
            <div className="bg-blue-50/70 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6 flex gap-3">
              <CheckCircle2
                className="text-blue-500 shrink-0 mt-0.5"
                size={18}
              />
              <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                Đội ngũ quản trị viên sẽ kiểm tra và phản hồi sớm nhất trong
                vòng 12-24 giờ. Thông báo sẽ được gửi trực tiếp vào chuông của
                bạn.
              </p>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-5 pb-10">
              <div>
                <label className="block text-[12.5px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chủ đề hỗ trợ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-sm text-[14px] font-medium cursor-pointer"
                >
                  <option value="Tài khoản">
                    Vấn đề Tài khoản / Đăng nhập
                  </option>
                  <option value="Thanh toán">
                    Thanh toán / Nạp gói Premium
                  </option>
                  <option value="Lỗi kỹ thuật">
                    Lỗi kỹ thuật / Không xem được phim
                  </option>
                  <option value="Khác">Góp ý / Vấn đề khác</option>
                </select>
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Vui lòng mô tả rõ sự cố bạn đang gặp phải..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all shadow-sm text-[14px] min-h-30 resize-none"
                />
              </div>

              <div>
                <label className="text-[12.5px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileImage size={16} /> Ảnh đính kèm (Tối đa 3)
                </label>
                <div className="flex gap-4 flex-wrap">
                  {previewImages.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewImages(
                            previewImages.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {previewImages.length < 3 && (
                    <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer">
                      <span className="text-2xl leading-none">+</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
              >
                {loading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={18} />
                )}
                Gửi Yêu Cầu Hỗ Trợ
              </button>
            </form>
          </div>
        )}
        {activeTab === "history" && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex gap-2 mb-4 shrink-0">
              <button
                onClick={() => handleTabChange("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filterStatus === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => handleTabChange("pending")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filterStatus === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => handleTabChange("resolved")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${filterStatus === "resolved" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
              >
                Đã hoàn tất
              </button>
            </div>

            <div className="flex-1 overflow-y-auto hidden-scrollbar pb-6">
              {paginatedTickets.length === 0 ? (
                <div className="h-full min-h-100 flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <ShieldAlert size={36} className="text-slate-300 mb-3" />
                  <h4 className="text-slate-700 font-bold">Chưa có dữ liệu</h4>
                  <p className="text-slate-500 text-sm">
                    Danh sách mục này hiện đang trống.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
                  {paginatedTickets.map((ticket) => {
                    const statusUI = getStatusInfo(ticket.status);
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setIsModalOpen(true);
                        }}
                        className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300 gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white`}
                          >
                            <MessageSquare size={18} />
                          </div>
                          <div className="overflow-hidden">
                            <h3 className="text-sm font-extrabold text-slate-900 truncate pr-2">
                              #{ticket.ticket_code} - {ticket.category}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${statusUI.color}`}
                              >
                                {statusUI.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-[12px] text-right shrink-0">
                          <div className="flex items-center justify-end gap-1.5 text-slate-500">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Ngày tạo:
                            </span>
                            <span className="text-slate-700 font-medium">
                              {new Date(ticket.created_at).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-blue-600 group-hover:underline">
                            Xem chi tiết &gt;
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <SupportClientModal
        isOpen={isModalOpen}
        ticketId={selectedTicketId}
        onClose={() => setIsModalOpen(false)}
        onReload={fetchMyTickets}
      />
    </main>
  );
}
