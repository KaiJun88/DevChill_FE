/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { X, Receipt, CheckCircle2, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { getPaymentByIdAdmin } from "../../../api/paymentAdminApi";

export default function PaymentModal({ isOpen, paymentId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchDetail();
    }
  }, [isOpen, paymentId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getPaymentByIdAdmin(paymentId);
      setData(res?.data || res);
    } catch (err) {
      toast.error(err?.message || "Lỗi tải chi tiết giao dịch");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "---";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusInfo = (statusState) => {
    const baseStyle =
      "inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-[#FCFDFE] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Receipt size={20} className="text-blue-500" />
            Chi tiết giao dịch #{paymentId}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        {loading || !data ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Đang tải dữ liệu...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Thông tin nội bộ
                </h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                  <DetailRow
                    label="Khách hàng"
                    value={data.username || `User #${data.user_id}`}
                    highlight
                  />
                  <DetailRow label="Gói mua" value={data.plan_name || "---"} />
                  <DetailRow
                    label="Số tiền"
                    value={formatCurrency(data.amount)}
                    highlight
                    textClass="text-blue-600"
                  />
                  <DetailRow
                    label="Trạng thái"
                    value={
                      <span className={getStatusInfo(data.status).class}>
                        {getStatusInfo(data.status).text}
                      </span>
                    }
                  />
                  {data.failure_reason && data.status !== "success" && (
                    <DetailRow
                      label="Lý do hệ thống"
                      value={data.failure_reason}
                      textClass="text-rose-600 italic text-[12px]"
                    />
                  )}
                  <DetailRow
                    label="Ngày tạo"
                    value={formatDate(data.created_at)}
                  />
                  <DetailRow
                    label="Ngày thanh toán"
                    value={formatDate(data.paid_at)}
                  />

                  {data.verified_by_admin && (
                    <>
                      <div className="w-full h-px bg-slate-100 my-2"></div>
                      <DetailRow
                        label="Admin xác nhận"
                        value={`Admin ID: ${data.verified_by_admin}`}
                      />
                      <DetailRow
                        label="Ghi chú"
                        value={data.note || "---"}
                        textClass="text-amber-600 italic"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <FileText size={14} /> Dữ liệu cổng thanh toán (VNPAY)
                </h4>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                  <DetailRow
                    label="Mã ngân hàng"
                    value={data.vnp_bank_code || "---"}
                  />
                  <DetailRow
                    label="Mã giao dịch (VNP)"
                    value={data.vnp_transaction_no || "---"}
                    highlight
                  />
                  <DetailRow
                    label="Mã đối soát (TxnRef)"
                    value={data.vnp_txn_ref || "---"}
                  />
                  <DetailRow
                    label="Mã phản hồi"
                    value={
                      <span
                        className={
                          data.vnp_response_code === "00"
                            ? "text-emerald-600 font-bold"
                            : "text-rose-600 font-bold"
                        }
                      >
                        {data.vnp_response_code || "---"}
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end px-8 py-5 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="px-6 h-10 text-[13.5px] font-bold rounded-xl transition-all bg-slate-800 text-white hover:bg-slate-700 shadow-md shadow-slate-200"
          >
            Đóng
          </button>
        </div>
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
    <span className="font-medium text-slate-500 w-1/3">{label}</span>
    <span
      className={`text-right flex-1 ${
        highlight ? "font-bold text-slate-800" : "font-semibold"
      } ${textClass} wrap-break-word`}
    >
      {value}
    </span>
  </div>
);
