/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  X,
  MessageSquare,
  User,
  Clock,
  ShieldAlert,
  Send,
  FileImage,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getSupportTicketByIdAdmin,
  replySupportTicketAdmin,
} from "../../../api/supportAdminApi";

export default function SupportModal({ isOpen, ticketId, onClose, onReload }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyStatus, setReplyStatus] = useState("in_progress");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchDetail();
    }
  }, [isOpen, ticketId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getSupportTicketByIdAdmin(ticketId);
      const ticketData = res?.data || res;
      setData(ticketData);
      setReplyStatus(
        ticketData.status === "open" ? "in_progress" : ticketData.status,
      );
      setReplyContent("");
      setPreviewImages([]);
      if (ticketData.status === "open") {
        window.dispatchEvent(
          new CustomEvent("support_ticket_viewed", { detail: ticketId }),
        );
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Lỗi tải chi tiết hỗ trợ",
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 3) {
      return toast.warning("Chỉ tải lên tối đa 3 ảnh đính kèm!");
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

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() && previewImages.length === 0) {
      toast.warning("Vui lòng nhập nội dung phản hồi hoặc đính kèm ảnh!");
      return;
    }
    const finalContent =
      replyContent.trim() === "" ? "Đã gửi tệp đính kèm." : replyContent;

    try {
      setIsSubmitting(true);
      await replySupportTicketAdmin(ticketId, {
        content_response: finalContent,
        status: replyStatus,
        attachments: previewImages,
      });

      toast.success("Đã gửi phản hồi thành công!");
      window.dispatchEvent(new Event("support_ticket_updated"));
      if (onReload) onReload();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err?.message || "Lỗi khi gửi phản hồi",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                Chi tiết vé #{data?.ticket_code || ticketId}
              </h3>
              <p className="text-[12px] text-slate-500 font-medium">
                Chủ đề: {data?.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {loading || !data ? (
          <div className="p-20 text-center text-slate-400 font-medium flex flex-col items-center gap-3">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <div className="w-full md:w-1/3 border-r border-slate-100 bg-slate-50/50 p-6 overflow-y-auto hidden-scrollbar">
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <User size={14} /> Thông tin khách hàng
              </h4>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm mb-6">
                <DetailRow
                  label="Người gửi"
                  value={data.user_name || "Khách Vãng Lai"}
                  highlight
                />
                <DetailRow label="Email liên hệ" value={data.contact_email} />
                <DetailRow
                  label="Độ ưu tiên"
                  value={
                    <span
                      className={
                        data.priority === "high"
                          ? "text-rose-500 font-bold"
                          : "text-slate-600"
                      }
                    >
                      {data.priority.toUpperCase()}
                    </span>
                  }
                />
                <DetailRow
                  label="Ngày tạo"
                  value={formatDate(data.created_at)}
                />
              </div>

              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldAlert size={14} /> Nội dung yêu cầu
              </h4>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-[14px] text-slate-700 leading-relaxed wrap-break-word whitespace-pre-wrap">
                {data.description}
              </div>
              {data.attachments && data.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Ảnh đính kèm
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {data.attachments.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                      >
                        <img
                          src={url}
                          alt="attachment"
                          className="w-20 h-20 object-cover rounded-xl border border-slate-200 hover:opacity-80 transition-opacity"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="w-full md:w-2/3 flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 hidden-scrollbar">
                <div className="flex items-center justify-center">
                  <span className="bg-slate-100 text-slate-400 text-[11px] font-bold uppercase px-3 py-1 rounded-full">
                    Lịch sử phản hồi
                  </span>
                </div>

                {!data.responses || data.responses.length === 0 ? (
                  <div className="text-center text-slate-400 text-[13px] italic py-10">
                    Chưa có phản hồi nào từ Quản trị viên.
                  </div>
                ) : (
                  data.responses.map((res) => (
                    <div
                      key={res.id}
                      className={`flex w-full ${res.is_admin_reply ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${res.is_admin_reply ? "bg-blue-50 border border-blue-100 rounded-tr-sm" : "bg-slate-50 border border-slate-100 rounded-tl-sm"}`}
                      >
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <span className="font-bold text-[13px] text-slate-700">
                            {res.is_admin_reply
                              ? "Quản Trị Viên (DevChill)"
                              : res.sender_name || "Khách hàng"}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                            <Clock size={12} /> {formatDate(res.created_at)}
                          </span>
                        </div>
                        <div className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap wrap-break-word">
                          {res.content_response}
                        </div>
                        {res.attachments && res.attachments.length > 0 && (
                          <div className="mt-3 flex gap-2">
                            {res.attachments.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img
                                  src={url}
                                  alt="att"
                                  className="w-16 h-16 object-cover rounded-lg border border-slate-200 hover:opacity-80"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 bg-slate-50/80 border-t border-slate-100 shrink-0">
                <form onSubmit={handleReplySubmit}>
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                        Cập nhật Trạng thái vé
                      </label>
                      <select
                        value={replyStatus}
                        onChange={(e) => setReplyStatus(e.target.value)}
                        className="w-full px-4 py-2.5 text-[13px] bg-white border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-slate-700 font-semibold outline-none cursor-pointer transition-all shadow-sm"
                      >
                        <option value="in_progress">Đang xử lý</option>
                        <option value="resolved">
                          Đã giải quyết (Resolved)
                        </option>
                        <option value="closed">Đóng vé (Closed)</option>
                      </select>
                    </div>
                    <div className="flex-1"></div>
                  </div>

                  <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                    Nội dung gửi cho khách hàng
                  </label>
                  <div className="relative mb-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Nhập nội dung phản hồi. Hệ thống sẽ tự động gửi email thông báo cho khách..."
                      className="w-full px-4 py-3 text-[14px] bg-white border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-slate-700 outline-none transition-all shadow-sm min-h-25 resize-none pr-16"
                    />
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        (!replyContent.trim() && previewImages.length === 0)
                      }
                      className="absolute bottom-3 right-3 p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-200 flex items-center justify-center"
                      title="Gửi phản hồi"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Send size={16} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <FileImage size={14} /> Ảnh đính kèm (Tối đa 3)
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {previewImages.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm"
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
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      {previewImages.length < 3 && (
                        <label className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer bg-slate-50/50">
                          <span className="text-xl leading-none font-light">
                            +
                          </span>
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
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DetailRow = ({
  label,
  value,
  highlight,
  textClass = "text-slate-600",
}) => (
  <div className="flex justify-between items-start text-[13px]">
    <span className="font-medium text-slate-500 w-[40%] shrink-0">{label}</span>
    <span
      className={`text-right flex-1 wrap-break-word ${highlight ? "font-bold text-slate-800" : "font-semibold"} ${textClass}`}
    >
      {value}
    </span>
  </div>
);
