import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, link }) {
  // Tách chuỗi thành mảng để xử lý nháy từng ký tự
  const letters = typeof title === "string" ? title.split("") : [];

  return (
    <div className="flex items-start justify-between mb-12 group relative perspective-1000">
      <style>{`
        @keyframes float-premium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        /* Nháy từng chữ: Từ ĐEN (slate-950) sang XANH DƯƠNG */
        @keyframes neon-letter-run-light {
          0%, 100% { color: #020617; text-shadow: none; } /* Đen đậm */
          5%, 15% { color: #2563eb; text-shadow: 0 0 12px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.4); } /* Xanh dương */
        }
        /* Nháy full chữ: Chớp nháy liên tục ở cuối chu kỳ */
        @keyframes neon-flash-all-light {
          0%, 65% { opacity: 1; filter: none; }
          66%, 68% { opacity: 0.6; filter: none; }
          69%, 75% { opacity: 1; filter: drop-shadow(0 0 10px rgba(37,99,235,0.4)); }
          76%, 78% { opacity: 0.6; filter: none; }
          79%, 85% { opacity: 1; filter: drop-shadow(0 0 15px rgba(37,99,235,0.6)) brightness(1.2); }
          86%, 88% { opacity: 0.6; filter: none; }
          89%, 100% { opacity: 1; filter: none; }
        }
        .animate-float-premium {
          animation: float-premium 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }
        .neon-text-container-light {
          animation: neon-flash-all-light 5s infinite;
        }
        .neon-letter-light {
          color: #020617; /* Đen đậm mặc định */
          animation: neon-letter-run-light 5s infinite;
        }
      `}</style>
      <div className="flex flex-col items-center animate-float-premium relative ml-4">
        <div className="w-0.5 h-16 bg-linear-to-b from-transparent via-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6),inset_0_0_4px_#fff] -mt-1 z-10" />
        <div className="relative mt-2 backdrop-blur-2xl bg-white/85 border border-white/60 w-70 md:w-85 h-14 md:h-16 flex items-center justify-center text-center shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-shadow duration-500 rounded-2xl overflow-hidden group/title">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/60 rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60 rounded-br-2xl"></div>
          <div className="absolute top-0 -left-full w-[120%] h-full bg-linear-to-r from-transparent via-blue-100/40 to-transparent skew-x-[-25deg] group-hover/title:animate-[shimmer_2s_infinite]"></div>
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-[0.08em] md:tracking-[0.12em] relative z-10 neon-text-container-light flex justify-center whitespace-nowrap">
            {letters.map((char, index) => (
              <span
                key={index}
                className="neon-letter-light inline-block"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  marginRight: char === " " ? "0.4em" : "1px",
                }}
              >
                {char}
              </span>
            ))}
          </h2>
        </div>
      </div>
      {link && (
        <div
          className="flex flex-col items-center animate-float-premium mt-4 mr-4"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="w-[1.5px] h-12 bg-linear-to-b from-transparent via-blue-300 to-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] -mt-1 z-10" />

          <Link
            to={link}
            className="relative mt-2 backdrop-blur-xl bg-white/80 border border-white/80 px-5 py-2 hover:bg-blue-50/80 hover:border-blue-200 transition-all duration-300 flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.05)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 rounded-xl group/link overflow-hidden"
          >
            <span className="font-bold text-xs text-slate-700 group-hover/link:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1.5 relative z-10">
              Xem tất cả
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1.5 transition-transform duration-300 text-blue-500"
              />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
