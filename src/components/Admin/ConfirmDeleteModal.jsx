import { FaExclamationTriangle } from 'react-icons/fa';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName = 'mục này' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col text-center">
        <div className="px-6 py-6 pb-2">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 mx-auto flex items-center justify-center mb-4">
            <FaExclamationTriangle size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Xác nhận xóa?
          </h3>
          <p className="text-gray-400">
            Bạn có chắc chắn muốn xóa <span className="text-white font-semibold">{itemName}</span>? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="p-6 flex gap-3 mt-2">
          <button 
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors font-medium"
          >
            Hủy
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-medium shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}
