import { useEffect, useState, useRef } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { watchMovie, getPublicMovieBySlug } from "../api/moviesPublicApi";
import {
  getEpisodeProgress,
  updateWatchProgress,
} from "../api/watchHistoryApi";
import {
  ChevronLeft,
  Play,
  MonitorPlay,
  ListVideo,
  ShieldAlert,
  Disc2,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";

export default function WatchMovie() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const ep = Number(searchParams.get("ep") || 1);
  const serverId = searchParams.get("server");

  const [data, setData] = useState(null);
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const lastSavedTimeRef = useRef(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [watchRes, movieRes] = await Promise.all([
          watchMovie(slug, { ep, server: serverId }),
          getPublicMovieBySlug(slug),
        ]);

        const watchPayload = watchRes?.data?.data || watchRes?.data;
        const moviePayload = movieRes?.data?.data || movieRes?.data;
        let savedTime = 0;
        if (!watchPayload?.locked && watchPayload?.episode?.id) {
          try {
            const progRes = await getEpisodeProgress(watchPayload.episode.id);
            if (progRes?.success && progRes?.watchedDuration) {
              savedTime = progRes.watchedDuration;
            }
          } catch (err) {
            console.error("Lỗi lấy tiến độ (có thể chưa đăng nhập):", err);
          }
        }
        setStartTime(savedTime);
        lastSavedTimeRef.current = savedTime;

        setData(watchPayload);
        setMovieDetail(moviePayload);

        if (!watchPayload?.locked) {
          const streams = watchPayload?.streams || [];
          const defaultStream =
            streams.find((s) => String(s.id) === String(serverId)) ||
            watchPayload.currentStream ||
            streams[0] ||
            null;
          setSelectedStream(defaultStream);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [slug, ep, serverId]);
  const handleTimeUpdate = (currentTime, duration) => {
    if (
      !data?.episode?.id ||
      !movieDetail?.id ||
      !duration ||
      duration === 0 ||
      currentTime === 0
    )
      return;
    const timeDiff = Math.abs(currentTime - lastSavedTimeRef.current);
    if (timeDiff >= 10) {
      lastSavedTimeRef.current = currentTime;
      updateWatchProgress({
        movieId: movieDetail.id,
        episodeId: data.episode.id,
        watchedDuration: currentTime,
        totalDuration: duration,
      }).catch((err) => console.error("Lỗi lưu tiến độ ngầm:", err));
    }
  };

  if (!data || !movieDetail) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-400 tracking-tight">
            Đang tải dữ liệu phòng chiếu...
          </span>
        </div>
      </div>
    );
  }
  if (movieDetail.lifecycle_status === "upcoming") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <CalendarClock size={32} className="text-blue-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
          Phim chưa công chiếu
        </h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm text-center leading-relaxed">
          Nội dung này sắp ra mắt và chưa có video chính thức. Hacker vui lòng
          quay lại sau nhé!
        </p>
        <button
          onClick={() => navigate(`/movies/${slug}`)}
          className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium shadow-md hover:bg-black transition-all active:scale-95"
        >
          Trở về trang thông tin
        </button>
      </div>
    );
  }

  if (data.locked) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 font-sans">
        <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <ShieldAlert size={32} className="text-yellow-500" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
          Nội dung Premium
        </h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm text-center leading-relaxed">
          {data.message ||
            "Bạn cần nâng cấp tài khoản Premium để trải nghiệm tập phim này."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium shadow-md hover:bg-black transition-all active:scale-95"
        >
          Trở về trang thông tin
        </button>
      </div>
    );
  }

  const { episode, episodes = [], streams = [] } = data;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans pb-24">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-4 lg:px-0">
          <button
            onClick={() => navigate(`/movies/${slug}`)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="flex-1 text-center truncate px-4 flex flex-col items-center justify-center">
            <h1 className="text-[15px] font-semibold tracking-tight text-gray-900 truncate max-w-md">
              {movieDetail.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                {episode.name}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-[11px] font-semibold text-blue-500 uppercase tracking-widest">
                Đang phát
              </span>
            </div>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 lg:px-0 mt-6 lg:mt-8">
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-gray-900/5 group">
          {loading && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="w-10 h-10 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {selectedStream?.link_m3u8 ? (
            <VideoPlayer
              key={selectedStream?.link_m3u8}
              url={selectedStream?.link_m3u8}
              startTime={startTime}
              onTimeUpdate={handleTimeUpdate}
            />
          ) : selectedStream?.link_embed ? (
            <iframe
              src={selectedStream.link_embed}
              className="w-full h-full"
              allowFullScreen
              title="Movie Player"
            />
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <div className="mb-6 px-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Nội dung phát
              </p>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  Danh sách tập phim
                </h2>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
                  {episodes.length} Tập
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
              {episodes.map((epItem) => {
                const isActive = epItem.episode_number === ep;
                return (
                  <div
                    key={epItem.id}
                    onClick={() =>
                      setSearchParams({
                        ep: epItem.episode_number,
                        server: serverId,
                      })
                    }
                    className={`group flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-200 border bg-white ${
                      isActive
                        ? "border-blue-400 shadow-sm ring-4 ring-blue-50"
                        : "border-gray-200/70 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative w-28 h-16 sm:w-32 sm:h-20 shrink-0 rounded-[10px] overflow-hidden bg-gray-100">
                      <img
                        src={movieDetail.poster_url}
                        alt={epItem.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isActive ? "scale-105" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                      {isActive ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-5 h-5 bg-blue-500/80 rounded-full flex items-center justify-center animate-pulse">
                            <Disc2
                              size={20}
                              className="text-white animate-spin-slow shadow-lg rounded-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play fill="white" className="text-white" size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 ml-4">
                      <h4
                        className={`text-sm font-semibold truncate tracking-tight transition-colors ${
                          isActive
                            ? "text-blue-600"
                            : "text-gray-900 group-hover:text-blue-500"
                        }`}
                      >
                        {epItem.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        Tập {epItem.episode_number}{" "}
                        <span className="mx-1 text-gray-300">•</span> HD
                      </p>
                    </div>
                    {isActive && (
                      <div className="ml-4 pr-3 flex items-center gap-1.5 text-blue-500">
                        <span className="text-[11px] font-semibold hidden sm:inline">
                          Đang xem
                        </span>
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/70 shadow-sm">
              <div className="flex items-center gap-2 mb-5 text-gray-900">
                <MonitorPlay size={18} className="text-gray-400" />
                <h3 className="text-sm font-bold tracking-tight uppercase">
                  Hệ thống Server
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {streams.map((s) => {
                  const isServerActive = selectedStream?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStream(s);
                        setSearchParams({ ep, server: s.id });
                      }}
                      className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between border ${
                        isServerActive
                          ? "bg-gray-50 border-gray-300 text-gray-900 shadow-sm"
                          : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      <span className="truncate">{s.server_name}</span>
                      {isServerActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  Trải nghiệm xem bị gián đoạn? Vui lòng chọn một <b>Server</b>{" "}
                  khác bên trên để có tốc độ tốt hơn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `,
        }}
      />
    </div>
  );
}
