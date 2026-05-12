import { useState } from "react";
import { ShieldCheck, X, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { verifyPaymentAdmin } from "../../../api/paymentAdminApi";

export default function VerifyModal({ isOpen, payment, onClose, onReload }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  if (!isOpen || !payment) return null;

  const handleVerify = async () => {
    if (!note.trim()) {
      toast.warning("Vui lòng nhập lý do xác nhận!");
      return;
    }
    try {
      setLoading(true);
      await verifyPaymentAdmin(payment.id, { note });
      toast.success("Xác nhận giao dịch & cộng gói thành công!");
      onReload();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Lỗi khi xác nhận giao dịch");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-emerald-500 p-6 flex flex-col items-center justify-center text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mb-3 shadow-lg">
            <ShieldCheck size={28} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold">Xác nhận thủ công</h3>
          <p className="text-emerald-100 text-[13px] font-medium mt-1">
            Mã giao dịch: #{payment.id}
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex gap-3 text-amber-700">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p className="text-[12.5px] font-medium leading-relaxed">
              Hành động này sẽ ép buộc đổi trạng thái thành <b>Success</b> và
              tiến hành kích hoạt gói <b>{payment.plan_name}</b> cho user{" "}
              <b>{payment.username}</b>.
            </p>
          </div>

          <div>
            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2 block pl-1">
              Lý do xác nhận (Bắt buộc)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: User đã chuyển khoản nhưng IPN từ VNPAY bị lỗi..."
              className="w-full px-4 py-3 text-[13.5px] font-medium rounded-xl outline-none transition-all duration-200 border bg-white border-slate-200 text-slate-700 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 min-h-25 resize-none"
            />
          </div>
        </div>
        <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 h-10 text-[13.5px] font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-all"
          >
            Hủy
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex items-center gap-2 px-6 h-10 text-[13.5px] font-bold rounded-xl transition-all bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
