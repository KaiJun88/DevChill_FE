import { Bot, Sparkles, RefreshCw, X } from "lucide-react";

export default function ChatHeader({ handleClearChat, setIsOpen }) {
  return (
    <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center justify-between relative overflow-hidden shrink-0">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl"></div>

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
          <Bot size={22} className="text-white" />
        </div>
        <div>
          <h3 className="text-slate-800 font-bold text-[15px] tracking-wide flex items-center gap-1.5">
            DevChill AI <Sparkles size={14} className="text-blue-500" />
          </h3>
          <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Trực tuyến
          </span>
        </div>
      </div>

      <div className="flex gap-2 relative z-10">
        <button
          onClick={handleClearChat}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-blue-100 hover:text-blue-700 transition-all"
          title="Làm mới cuộc trò chuyện"
        >
          <RefreshCw size={15} />
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:bg-blue-100 hover:text-red-500 transition-all"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
