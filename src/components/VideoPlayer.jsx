/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === Infinity) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

export default function VideoPlayer({ url, startTime = 0, onTimeUpdate }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    let hls;
    const video = videoRef.current;

    const startVideo = () => {
      video.currentTime = startTime;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    if (url && Hls.isSupported()) {
      hls = new Hls({ startPosition: startTime });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, startVideo);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", startVideo);
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, [url, startTime]);

  useEffect(() => {
    const video = videoRef.current;
    const handleTimeUpdate = () => {
      if (!isDragging) setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      if (onTimeUpdate) onTimeUpdate(video.currentTime, video.duration || 0);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [isDragging]);

  // CẬP NHẬT: Xử lý kéo thả cho cả Chuột và Cảm ứng (Touch)
  useEffect(() => {
    const handleMove = (e) => {
      if (
        !isDragging ||
        !progressBarRef.current ||
        !videoRef.current ||
        duration === 0
      )
        return;

      // Ngăn hành vi cuộn trang khi đang kéo thanh tua trên điện thoại
      if (e.type === "touchmove") e.preventDefault();

      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = e.type.includes("touch")
        ? e.touches[0].clientX
        : e.clientX;
      let pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      let newTime = pos * duration;

      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    };
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      // Hỗ trợ cảm ứng
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      // Hỗ trợ cảm ứng
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, duration]);

  const togglePlay = () => {
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    setIsPlaying(!videoRef.current.paused);
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    let newTime = videoRef.current.currentTime + seconds;
    if (newTime > duration) newTime = duration;
    if (newTime < 0) newTime = 0;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // CẬP NHẬT: Gộp sự kiện Mouse và Touch khi bắt đầu tua phim
  const handleProgressStart = (e) => {
    setIsDragging(true);
    if (!progressBarRef.current || !videoRef.current || duration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    let pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    let newTime = pos * duration;

    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  // CẬP NHẬT: Hỗ trợ Fullscreen cho iPhone / iPad (iOS Safari)
  const handleFullscreen = () => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch((err) => console.log(err));
      } else if (wrapper.webkitRequestFullscreen) {
        /* Safari cho Mac/iPad */
        wrapper.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        /* Bắt buộc dành riêng cho iPhone (iOS) */
        video.webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleSpeedChange = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  // CẬP NHẬT: Thêm touchstart để trên di động ấn vào màn hình là Control Bar hiện lên
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying && !isDragging && !showSpeedMenu) setShowControls(false);
      }, 3000);
    };
    const wrapper = wrapperRef.current;

    wrapper.addEventListener("mousemove", resetTimer);
    wrapper.addEventListener("touchstart", resetTimer); // Thêm dòng này cho Mobile

    return () => {
      clearTimeout(timeout);
      wrapper.removeEventListener("mousemove", resetTimer);
      wrapper.removeEventListener("touchstart", resetTimer);
    };
  }, [isPlaying, isDragging, showSpeedMenu]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full bg-black group font-sans overflow-hidden"
      onMouseLeave={() => {
        if (isPlaying && !isDragging) {
          setShowControls(false);
          setShowSpeedMenu(false);
        }
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full cursor-pointer object-contain"
        onClick={togglePlay}
        playsInline
      />

      <div
        className={`absolute bottom-0 left-0 right-0 px-3 sm:px-5 pb-3 sm:pb-5 pt-20 bg-linear-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={progressBarRef}
          onMouseDown={handleProgressStart}
          onTouchStart={handleProgressStart} /* Thêm sự kiện chạm */
          className="w-full h-1.5 sm:h-2 bg-white/30 rounded-full mb-4 relative cursor-pointer group/bar"
        >
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          >
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full scale-0 group-hover/bar:scale-100 ${
                isDragging ? "scale-100" : ""
              } transition-transform shadow-md`}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-white relative">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={togglePlay}
              className="hover:text-blue-500 transition-colors p-1"
            >
              {isPlaying ? (
                <Pause fill="currentColor" size={24} />
              ) : (
                <Play fill="currentColor" size={24} />
              )}
            </button>
            <button
              onClick={() => skip(-10)}
              className="hover:text-blue-500 transition-colors hidden sm:block p-1"
            >
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => skip(10)}
              className="hover:text-blue-500 transition-colors hidden sm:block p-1"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={toggleMute}
              className="hover:text-blue-500 transition-colors sm:ml-2 p-1"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="text-[12px] sm:text-[13px] font-medium ml-1 sm:ml-2 text-white/90 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="hover:text-blue-500 transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10"
              >
                <Settings
                  size={20}
                  className={`${
                    showSpeedMenu ? "rotate-90 text-blue-500" : ""
                  } transition-transform duration-300`}
                />
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl py-2 w-32 shadow-2xl animate-fade-in-up">
                  <div className="px-4 py-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-white/10 mb-1">
                    Tốc độ
                  </div>
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`w-full text-left px-4 py-2 text-[13px] font-medium hover:bg-white/10 transition-colors flex justify-between items-center ${
                        playbackRate === speed ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {speed === 1 ? "Chuẩn" : `${speed}x`}
                      {playbackRate === speed && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded border border-white/20">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                HD
              </span>
            </div>
            <button
              onClick={handleFullscreen}
              className="hover:text-blue-500 transition-colors p-1"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
