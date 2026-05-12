import { Bot, Sparkles } from "lucide-react";

export default function FloatingButton({ isOpen, setIsOpen }) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`relative group animate-floating transition-transform duration-300 ${
        isOpen ? "scale-0 absolute" : "scale-100"
      }`}
    >
      <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

      <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl text-white transform group-hover:-translate-y-1 transition-all duration-300 border-2 border-white/10">
        <Sparkles
          size={16}
          className="absolute top-3 right-3 text-yellow-300"
        />
        <Bot size={30} className="text-white" />
      </div>
    </button>
  );
}
