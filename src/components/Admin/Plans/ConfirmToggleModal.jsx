import { ShieldAlert } from "lucide-react";

export default function ConfirmToggleModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận thao tác?",
  content,
  confirmText = "Xác nhận",
  cancelText = "Quay lại",
  isLoading = false,
  type = "danger", // 'danger' (đỏ) | 'success' (xanh)
}) {
  if (!isOpen) return null;

  const isDanger = type === "danger";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div
          className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
            isDanger
              ? "bg-rose-50 text-rose-500"
              : "bg-emerald-50 text-emerald-500"
          }`}
        >
          <ShieldAlert size={28} />
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>

        <div className="text-slate-500 text-[14px] leading-relaxed mb-8">
          {content}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all text-[13.5px] disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all text-[13.5px] shadow-lg disabled:opacity-50 ${
              isDanger
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
            }`}
          >
            {isLoading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
