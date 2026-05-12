import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showtimesApi } from "../../../api/showtimeApi";
import {
  CalendarDays,
  Crown,
  Clock,
  Film,
  Timer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const getLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CountdownTag = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setTimeLeft("Đang bắt đầu");
        clearInterval(timer);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");

      if (h > 0) setTimeLeft(`Sắp chiếu: ${h}h ${m}p ${s}s`);
      else setTimeLeft(`Sắp chiếu: ${m}p ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 bg-blue-50/80 px-2.5 py-1.5 rounded-md text-blue-600 w-max border border-blue-100/50 shadow-sm">
      <Timer size={13} className="animate-pulse" />
      <span className="text-[11px] font-bold uppercase tracking-wider tabular-nums">
        {timeLeft}
      </span>
    </div>
  );
};

export default function ShowtimesSchedule() {
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString(new Date()),
  );
  const [weekOffset, setWeekOffset] = useState(0);

  const getWeekDays = (offset) => {
    const curr = new Date();
    const first =
      curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
    const todayStr = getLocalDateString(new Date());

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(first + i + offset * 7);
      const dateStr = getLocalDateString(date);
      return {
        dateStr,
        dayName: date.getDay() === 0 ? "Chủ Nhật" : `Thứ ${date.getDay() + 1}`,
        shortDate: `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`,
        isToday: dateStr === todayStr,
      };
    });
  };

  const weekDays = getWeekDays(weekOffset);

  const fetchShowtimes = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await showtimesApi.getAllPublic();
      if (res.success) setShowtimes(res.data);
    } catch (error) {
      console.error("Lỗi tải lịch chiếu", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
    const interval = setInterval(() => fetchShowtimes(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredShowtimes = showtimes.filter(
    (item) => getLocalDateString(new Date(item.start_time)) === selectedDate,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
      <div className="max-w-5xl mx-auto px-5 pt-16">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-14 h-14 bg-white rounded-[18px] shadow-sm border border-slate-100 flex items-center justify-center mb-5 text-blue-600">
            <CalendarDays size={26} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Lịch Phát Sóng
          </h1>
          <p className="text-slate-500 font-medium text-[15px] max-w-md">
            Khám phá các khung giờ công chiếu nội dung độc quyền và phim bộ mới
            nhất.
          </p>
        </div>

        <div className="relative flex items-center justify-center gap-4 mb-10 w-full max-w-200 mx-auto">
          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
              weekOffset === 0
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-sm"
            }`}
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <div className="flex overflow-x-auto gap-3 py-2 scroll-hide scroll-smooth flex-1 justify-start md:justify-center px-1">
            {weekDays.map((day) => {
              const isActive = selectedDate === day.dateStr;
              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`relative flex flex-col items-center justify-center min-w-22.5 h-22.5 rounded-[22px] transition-all duration-300 border ${
                    isActive
                      ? "bg-blue-50 border-blue-200 shadow-sm transform -translate-y-1"
                      : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  }`}
                >
                  <span
                    className={`text-[12px] font-semibold mb-1 ${isActive ? "text-blue-500" : "text-slate-400"}`}
                  >
                    {day.dayName}
                  </span>
                  <span
                    className={`text-xl font-bold tracking-tight ${isActive ? "text-blue-700" : "text-slate-700"}`}
                  >
                    {day.shortDate}
                  </span>

                  {day.isToday && !isActive && (
                    <div className="absolute -top-2.5 bg-slate-800 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      Hôm nay
                    </div>
                  )}
                  {isActive && day.isToday && (
                    <div className="absolute -top-2.5 bg-amber-400 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      Hôm nay
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setWeekOffset(1)}
            disabled={weekOffset === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
              weekOffset === 1
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:shadow-sm"
            }`}
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200 shadow-sm flex flex-col items-center">
            <Film size={44} className="text-slate-300 mb-4" strokeWidth={1.5} />
            <p className="text-slate-800 font-bold text-lg">
              Không có lịch chiếu
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Hôm nay không có nội dung nào được lên lịch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredShowtimes.map((movie) => {
              const isLive = movie.status === "live";
              return (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/showtimes/${movie.id}`)}
                  className="group bg-white rounded-[28px] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex gap-5"
                >
                  <div className="w-32 h-44 rounded-[20px] overflow-hidden shrink-0 relative bg-slate-100">
                    <img
                      src={movie.poster_url}
                      alt={movie.movie_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {movie.movie_is_premium && (
                      <div className="absolute top-2 left-2 bg-linear-to-r from-amber-400 to-orange-500 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md border border-white/20">
                        <Crown
                          size={12}
                          className="text-white"
                          strokeWidth={2}
                        />
                        <span className="text-[10px] font-bold text-white tracking-wide">
                          VIP
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col py-2 pr-2 justify-between flex-1">
                    <div>
                      <div className="mb-3">
                        {isLive ? (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                            </span>
                            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
                              Đang phát
                            </span>
                          </div>
                        ) : (
                          <CountdownTag targetDate={movie.start_time} />
                        )}
                      </div>
                      <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {movie.movie_name}
                      </h3>
                      <p className="text-[13px] text-slate-500 font-medium">
                        {movie.episode_name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3 bg-slate-50 w-max px-3 py-1.5 rounded-xl border border-slate-100 text-slate-500">
                      <Clock size={14} />
                      <span className="text-[13px] font-bold text-slate-700">
                        {new Date(movie.start_time).toLocaleTimeString(
                          "vi-VN",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
