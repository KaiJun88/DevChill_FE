import { Send, Loader2 } from "lucide-react";

export default function ChatInput({
  message,
  setMessage,
  handleSendMessage,
  isTyping,
}) {
  return (
    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
      <form onSubmit={handleSendMessage} className="relative flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập yêu cầu của bạn..."
          disabled={isTyping}
          className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!message.trim() || isTyping}
          className="absolute right-2 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:hover:bg-slate-300 text-white rounded-xl transition-colors"
        >
          {isTyping ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} className="ml-0.5" />
          )}
        </button>
      </form>
    </div>
  );
}
