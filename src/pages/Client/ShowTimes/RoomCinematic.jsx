import { useNavigate } from "react-router-dom";
import PremierePlayer from "../../../components/PremierePlayer";
import RoomCountdown from "./RoomCountdown";
import {
  ShieldAlert,
  Film,
  CheckCircle2,
  Clock,
  Star,
  Monitor,
  ShieldCheck,
} from "lucide-react";

export default function RoomCinematic({
  roomData,
  streamData,
  activeStreamIndex,
  isPremiumLocked,
  isCancelled,
  isEnded,
  isScheduled,
  onTimeUpdate,
}) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full aspect-video bg-[#0B101A] rounded-[24px] overflow-hidden shadow-lg shrink-0 flex items-center justify-center transition-all duration-500">
      {isPremiumLocked ? (
        <>
          {roomData?.poster_url && (
            <img
              src={roomData.poster_url}
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md"
              alt="Poster"
            />
          )}
          <div className="absolute inset-0 bg-slate-900/60"></div>
          <div className="relative z-10 w-[90%] max-w-110 bg-[#F4F6F9] rounded-[24px] p-8 text-center shadow-2xl h-max animate-in zoom-in duration-300">
            <div className="w-13 h-13 bg-[#FFF8E7] rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Star size={26} className="text-[#F59E0B]" fill="currentColor" />
            </div>
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <h2 className="text-[20px] font-bold text-slate-800">
                Nâng cấp Premium để tiếp tục
              </h2>
              <span className="bg-[#FFF4D6] text-[#D97706] text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wide">
                PREMIUM
              </span>
            </div>
            <p className="text-slate-500 text-[14.5px] leading-relaxed mb-8 px-2">
              Phim này là nội dung độc quyền, chỉ dành riêng cho thành viên
              Premium. Hãy nâng cấp để tiếp tục thưởng thức.
            </p>
            <button
              onClick={() => navigate("/premium")}
              className="w-full py-3.5 bg-white border border-[#FCD34D] hover:bg-[#FFFDEB] text-slate-800 rounded-[14px] text-[15px] font-bold flex items-center justify-center gap-2.5 mb-3.5 transition-colors shadow-sm"
            >
              <Star size={18} className="text-[#F59E0B]" fill="currentColor" />{" "}
              Nâng cấp gói Premium
            </button>
            <button
              onClick={() => navigate("/showtimes")}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 rounded-[14px] text-[15px] font-semibold hover:bg-slate-50 transition-colors shadow-sm"
            >
              Trở về trang công chiếu
            </button>
          </div>
        </>
      ) : isCancelled ? (
        <>
          {roomData?.poster_url && (
            <img
              src={roomData.poster_url}
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
              alt="Poster"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0B101A] via-[#0B101A]/70 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
            <div className="w-12 h-12 bg-rose-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
              <ShieldAlert size={24} className="text-rose-500" />
            </div>
            <h2 className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight">
              Công chiếu đã hủy
            </h2>
            <p className="text-white/60 max-w-sm text-center text-[14px] mb-8 drop-shadow-md">
              Rất tiếc, suất chiếu này đã bị hủy bởi hệ thống. Cảm ơn bạn đã
              quan tâm đến tác phẩm.
            </p>
            <button
              onClick={() => navigate("/showtimes")}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2"
            >
              <Film size={18} />
              Trở về lịch chiếu
            </button>
          </div>
        </>
      ) : isEnded ? (
        <>
          {roomData?.poster_url && (
            <img
              src={roomData.poster_url}
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
              alt="Poster"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0B101A] via-[#0B101A]/70 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight">
              Công chiếu kết thúc
            </h2>
            <p className="text-white/60 max-w-sm text-center text-[14px] mb-8 drop-shadow-md">
              Cảm ơn bạn đã theo dõi! Suất chiếu này đã khép lại. Hẹn gặp lại
              bạn ở những buổi công chiếu tiếp theo trên DevChill.
            </p>
            <button
              onClick={() => navigate("/showtimes")}
              className="px-8 py-3.5 bg-[#2556E8] hover:bg-blue-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
            >
              <Film size={18} />
              Xem lịch chiếu khác
            </button>
          </div>
        </>
      ) : isScheduled ? (
        <>
          {roomData?.poster_url && (
            <img
              src={roomData.poster_url}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              alt="Poster"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0B101A] via-[#0B101A]/70 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-500">
            <div className="w-10 h-10 bg-[#2556E8]/20 backdrop-blur-md rounded-full flex items-center justify-center mb-3 border border-[#2556E8]/30">
              <Clock size={18} className="text-[#60A5FA]" />
            </div>
            <h2 className="text-2xl md:text-[32px] font-bold text-white mb-2 tracking-tight">
              Sắp công chiếu
            </h2>
            <p className="text-white/70 max-w-sm text-center text-[13px] md:text-[14px] drop-shadow-md">
              Buổi công chiếu đang được đếm ngược. Hãy chuẩn bị sẵn sàng, hệ
              thống sẽ tự động phát khi đến giờ!
            </p>
            <RoomCountdown targetDate={roomData?.start_time} />
          </div>
        </>
      ) : (
        streamData?.streams?.[activeStreamIndex]?.link_m3u8 && (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
            <PremierePlayer
              url={streamData.streams[activeStreamIndex].link_m3u8}
              startTime={streamData.current_offset || 0}
              onTimeUpdate={onTimeUpdate}
            />
          </div>
        )
      )}
    </div>
  );
}
