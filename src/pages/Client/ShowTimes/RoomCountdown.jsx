import { useEffect, useState } from "react";

export default function RoomCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });
  const [isWaitingSignal, setIsWaitingSignal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ h: "00", m: "00", s: "00" });
        setIsWaitingSignal(true);
        return;
      }
      setTimeLeft({
        h: Math.floor(diff / 3600000)
          .toString()
          .padStart(2, "0"),
        m: Math.floor((diff % 3600000) / 60000)
          .toString()
          .padStart(2, "0"),
        s: Math.floor((diff % 60000) / 1000)
          .toString()
          .padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex flex-col items-center gap-2">
          <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2A3040]/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
            <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {timeLeft.h}
            </span>
          </div>
          <span className="text-[#8B95A5] text-[10px] font-bold uppercase tracking-widest">
            Giờ
          </span>
        </div>

        <div className="text-white/40 text-2xl font-medium mb-6">:</div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2A3040]/90 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
            <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {timeLeft.m}
            </span>
          </div>
          <span className="text-[#8B95A5] text-[10px] font-bold uppercase tracking-widest">
            Phút
          </span>
        </div>

        <div className="text-white/40 text-2xl font-medium mb-6">:</div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-15 h-16 md:w-18 md:h-19 bg-[#2556E8] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(37,86,232,0.4)]">
            <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {timeLeft.s}
            </span>
          </div>
          <span className="text-[#2556E8] text-[10px] font-bold uppercase tracking-widest">
            Giây
          </span>
        </div>
      </div>

      {isWaitingSignal && (
        <div className="mt-6 flex items-center gap-2 text-white/80 text-sm animate-pulse">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Đang kết nối luồng phát trực tiếp...
        </div>
      )}
    </div>
  );
}
