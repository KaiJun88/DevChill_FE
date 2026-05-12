/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { showtimesApi } from "../../../api/showtimeApi";
import { getProfile } from "../../../api/userApi";
import { getAccessToken } from "../../../utils/auth";
import { updateWatchProgress } from "../../../api/watchHistoryApi";
import { ChevronLeft, Radio, ShieldAlert } from "lucide-react";
import ChatRoom from "./ChatRoom";
import RoomCinematic from "./RoomCinematic";
import RoomInfo from "./RoomInfo";

export default function PremiereRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPremiumLocked, setIsPremiumLocked] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);
  const lastSavedTimeRef = useRef(0);

  useEffect(() => {
    const initRoom = async () => {
      try {
        setLoading(true);

        let currentRoomData = null;
        const detailRes = await showtimesApi.getDetail(id).catch(() => null);
        if (detailRes?.success) {
          currentRoomData = detailRes.data;
          setRoomData(currentRoomData);
        }

        const token = getAccessToken() || localStorage.getItem("token");
        if (!token) {
          setPageError({
            type: "auth",
            title: "Yêu cầu đăng nhập",
            message: "Bạn cần đăng nhập để xem buổi công chiếu này.",
          });
          return setLoading(false);
        }

        const userProfile = await getProfile().catch(() => null);
        if (!userProfile) {
          setPageError({
            type: "auth",
            title: "Phiên làm việc hết hạn",
            message: "Vui lòng đăng nhập lại.",
          });
          return setLoading(false);
        }
        setCurrentUser(userProfile);

        const res = await showtimesApi.watchPremiere(id);

        if (res?.data) {
          currentRoomData = { ...currentRoomData, ...res.data };
          setRoomData(currentRoomData);
        }

        if (
          res.success === false &&
          res.message?.toLowerCase().includes("premium")
        )
          setIsPremiumLocked(true);
        else if (res.status === "live") {
          setStreamData(res.data);
          setIsScheduled(false);
          setIsEnded(false);
          setIsCancelled(false);
        } else if (res.status === "scheduled") setIsScheduled(true);
        else if (res.status === "ended") setIsEnded(true);
        else if (res.status === "cancelled") setIsCancelled(true);
      } catch (err) {
        if (err.response?.status === 403) setIsPremiumLocked(true);
        else
          setPageError({
            type: "error",
            title: "Lỗi kết nối",
            message: "Không thể tải dữ liệu phòng chiếu.",
          });
      } finally {
        setLoading(false);
      }
    };
    initRoom();
  }, [id]);

  useEffect(() => {
    if (loading || pageError || isPremiumLocked) return;

    const socketUrl = import.meta.env.VITE_API_URL;
    const socket = io(socketUrl, {
      transports: ["websocket"],
      upgrade: false,
    });

    setSocketInstance(socket);
    const roomName = `room_premiere_${id}`;

    socket.emit("join_premiere_room", { roomId: id, user: currentUser });

    socket.on("room_status_changed", async (data) => {
      if (data.roomId !== parseInt(id)) return;

      if (data.status === "cancelled") {
        setIsCancelled(true);
        setIsScheduled(false);
        setIsEnded(false);
      } else if (data.status === "ended") {
        setIsEnded(true);
        setIsScheduled(false);
        setIsCancelled(false);
      } else if (data.status === "live") {
        try {
          const res = await showtimesApi.watchPremiere(id);
          if (res.success && res.status === "live") {
            setIsScheduled(false);
            setIsCancelled(false);
            setIsEnded(false);
            setStreamData(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi fetch stream:", error);
        }
      }
    });

    return () => {
      socket.emit("leave_premiere_room", { roomId: id });
      socket.disconnect();
    };
  }, [id, loading, pageError, isPremiumLocked, currentUser]);
  const handleTimeUpdate = (currentTime, duration) => {
    if (
      !roomData?.movie_id ||
      !roomData?.episode_id ||
      !duration ||
      duration === 0 ||
      currentTime === 0
    )
      return;

    const timeDiff = Math.abs(currentTime - lastSavedTimeRef.current);

    if (timeDiff >= 10) {
      lastSavedTimeRef.current = currentTime;
      updateWatchProgress({
        movieId: roomData.movie_id,
        episodeId: roomData.episode_id,
        watchedDuration: currentTime,
        totalDuration: duration,
      }).catch((err) => console.error("Lỗi lưu tiến độ công chiếu:", err));
    }
  };

  if (loading)
    return (
      <div className="h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );

  if (pageError)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-4 font-sans">
        <div className="w-24 h-24 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-[32px] flex items-center justify-center mb-6">
          <ShieldAlert size={40} className="text-rose-500" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          {pageError.title}
        </h1>
        <p className="text-slate-500 mb-8 max-w-md text-center text-[15px] leading-relaxed">
          {pageError.message}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/showtimes")}
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-slate-900/20"
          >
            Về lịch chiếu
          </button>
          {pageError.type === "auth" && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl transition-all"
            >
              Đăng nhập ngay
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col overflow-hidden relative font-sans">
      <header className="h-18 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm">
        <button
          onClick={() => navigate("/showtimes")}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:scale-105 transition-all text-slate-600"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-slate-900 text-base font-bold tracking-tight">
            {roomData?.movie_name || "Phòng Công Chiếu Premium"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {!isEnded && !isScheduled && !isPremiumLocked && !isCancelled && (
            <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm shadow-rose-100">
              <Radio size={16} className="text-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Trực tiếp
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 lg:p-6 gap-6 max-w-400 mx-auto w-full">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scroll-hide rounded-[24px]">
          <RoomCinematic
            roomData={roomData}
            streamData={streamData}
            activeStreamIndex={activeStreamIndex}
            isPremiumLocked={isPremiumLocked}
            isCancelled={isCancelled}
            isEnded={isEnded}
            isScheduled={isScheduled}
            onTimeUpdate={handleTimeUpdate}
          />
          {!isPremiumLocked && !isCancelled && !isEnded && (
            <RoomInfo
              roomData={roomData}
              streamData={streamData}
              activeStreamIndex={activeStreamIndex}
              setActiveStreamIndex={setActiveStreamIndex}
              isScheduled={isScheduled}
            />
          )}
        </div>
        <ChatRoom
          currentUser={currentUser}
          roomData={roomData}
          socket={socketInstance}
          roomId={id}
        />
      </div>

      <style>{`.scroll-hide::-webkit-scrollbar { display: none; } .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}
