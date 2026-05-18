import { useState, useEffect } from "react";
import { Lock, Unlock, X, Loader2 } from "lucide-react";

export default function LockModal({
  isOpen,
  onClose,
  user,
  onConfirm,
  loading,
}) {
  const [reason, setReason] = useState("");
  const [lockUntil, setLockUntil] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason("");
      setLockUntil("");
      setIsPermanent(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isLocked = user.is_locked;
  const baseInputStyle =
    "w-full px-4 py-3 text-[14px] text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4";

  const focusRing = isLocked
    ? "focus:border-emerald-400 focus:ring-emerald-500/10"
    : "focus:border-rose-400 focus:ring-rose-500/10";

  const labelStyle =
    "text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-105 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <div className="px-8 pt-10 pb-6 text-center">
          <div
            className={`w-16 h-16 mx-auto flex items-center justify-center rounded-2xl mb-4 shadow-sm ${
              isLocked
                ? "bg-emerald-50 text-emerald-500 ring-4 ring-emerald-50/50"
                : "bg-rose-50 text-rose-500 ring-4 ring-rose-50/50"
            }`}
          >
            {isLocked ? (
              <Unlock size={28} strokeWidth={2} />
            ) : (
              <Lock size={28} strokeWidth={2} />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          </h3>

          <p className="text-[14px] text-slate-500 mt-2">
            {isLocked
              ? "Xác nhận mở khóa hoạt động cho"
              : "Bạn đang thực hiện khóa tài khoản"}{" "}
            <span className="font-bold text-slate-700">{user.username}</span>
          </p>
        </div>
        <div className="px-8 py-2 space-y-5">
          <div>
            <label className={labelStyle}>
              Lý do {isLocked ? "mở khóa" : "khóa"}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Nhập lý do ${isLocked ? "mở khóa" : "khóa"}...`}
              rows={3}
              className={`${baseInputStyle} ${focusRing} resize-none`}
            />
          </div>

          {!isLocked && (
            <div className="space-y-4 pt-1">
              {!isPermanent && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <label className={labelStyle}>Thời hạn khóa (Đến ngày)</label>
                  <input
                    type="date"
                    value={lockUntil}
                    onChange={(e) => setLockUntil(e.target.value)}
                    className={`${baseInputStyle} ${focusRing} cursor-pointer`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6 pt-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-12 text-[14px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded-2xl transition-all"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => {
              if (isLocked) {
                onConfirm(user.id);
              } else {
                onConfirm(user.id, {
                  block_reason: reason,
                  lock_until: isPermanent ? null : lockUntil,
                });
              }
            }}
            disabled={loading}
            className={`flex-1 h-12 text-[14px] font-bold rounded-2xl text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
              isLocked
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200/50"
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-200/50"
            } ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : isLocked ? (
              "Xác nhận Mở khóa"
            ) : (
              "Xác nhận Khóa"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
