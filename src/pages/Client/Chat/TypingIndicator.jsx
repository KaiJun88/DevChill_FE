import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row items-center">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
        <Bot size={16} />
      </div>
      <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
    </div>
  );
}
