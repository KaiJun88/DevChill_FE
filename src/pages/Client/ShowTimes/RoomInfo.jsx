import { MonitorPlay } from "lucide-react";

export default function RoomInfo({
  roomData,
  streamData,
  activeStreamIndex,
  setActiveStreamIndex,
  isScheduled,
}) {
  return (
    <div className="mt-6 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      {!isScheduled && (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MonitorPlay size={18} className="text-slate-600" />
            <h3 className="font-bold text-slate-800 uppercase text-[14px]">
              Hệ thống Servers
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {streamData?.streams?.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveStreamIndex(i)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-[16px] border transition-all duration-200 ${
                  activeStreamIndex === i
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold text-[14px]">
                  {s.server_name}
                </span>
                {activeStreamIndex === i && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#60a5fa]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-slate-100 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {roomData?.movie_name}
        </h2>
        <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-[13px] font-semibold w-max mb-6">
          {roomData?.episode_name}
        </div>

        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
          <div className="w-1 h-4 bg-rose-500 rounded-full"></div> Nội dung phim
        </h3>
        <p
          className="text-slate-600 text-[14.5px] leading-relaxed mb-8"
          dangerouslySetInnerHTML={{ __html: roomData?.description }}
        ></p>

        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Diễn viên
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {roomData?.actors?.map((a) => (
            <span
              key={a.id}
              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[13.5px] font-medium text-slate-700 cursor-default"
            >
              {a.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
