import React from "react";
import { Star } from "lucide-react";

export default function DevChillApp() {
  return (
    <div className="relative min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-125 h-125 bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-[20%] -right-[10%] w-100 h-100 bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
      </div>
      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-medium tracking-widest uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          New Version Available
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-6 leading-[1.1]">
          Trải nghiệm <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            DevChill
          </span>{" "}
          ở tầm cao mới.
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed font-light">
          Xem phim chất lượng cao, đồng bộ hóa thông minh trên mọi thiết bị. Tải
          ứng dụng ngay hôm nay để bắt đầu hành trình giải trí không giới hạn.
        </p>
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] active:scale-95 group">
              <svg
                className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.523 15.3414c-.5511 0-.9993.4486-.9993.9997 0 .5511.4482.9997.9993.9997.5511 0 .9993-.4486.9993-.9997 0-.5511-.4482-.9997-.9993-.9997zm-11.046 0c-.5511 0-.9993.4486-.9993.9997 0 .5511.4482.9997.9993.9997.5511 0 .9993-.4486.9993-.9997 0-.5511-.4482-.9997-.9993-.9997zm11.4045-6.0065l1.6163-2.799c.1408-.2439.0573-.5549-.1866-.6957-.2439-.1408-.5549-.0573-.6957.1866l-1.6423 2.8439c-1.3195-.5896-2.7938-.9206-4.3432-.9206s-3.0237.331-4.3432.9206L6.4651 6.0275c-.1408-.2439-.4518-.3274-.6957-.1866-.2439.1408-.3274.4518-.1866.6957l1.6163 2.799C4.103 10.9351 2.0234 13.7297 2.0234 17h19.9532c0-3.2703-2.0796-6.0649-5.1821-7.6651z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-70 uppercase tracking-wider">
                  Download for
                </div>
                <div className="text-sm font-semibold">Android</div>
              </div>
            </button>

            <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-95 group">
              <svg
                className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.89 1.22-2.11 1.09-3.33-1.04.04-2.3.7-3.05 1.57-.67.77-1.26 2.02-1.11 3.21 1.15.09 2.34-.56 3.07-1.45z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] opacity-70 uppercase tracking-wider">
                  Download for
                </div>
                <div className="text-sm font-semibold">iOS</div>
              </div>
            </button>
          </div>
        </div>
        <div className="mt-16 w-full flex justify-center">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-[#FDFDFD] z-40">
                  TP
                </div>
                <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-[#FDFDFD] z-30">
                  LA
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-[#FDFDFD] z-20">
                  HG
                </div>
                <div className="w-8 h-8 rounded-full bg-[#64748B] text-white flex items-center justify-center text-xs font-semibold ring-2 ring-[#FDFDFD] z-10">
                  CL
                </div>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-[#FFC107] fill-[#FFC107]"
                    />
                  ))}
                </div>
                <div className="text-[13px] font-medium text-slate-500 mt-0.5">
                  4.9 · 50K+ đánh giá
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col items-start">
              <div className="text-xl font-bold text-slate-900 leading-tight">
                2M+
              </div>
              <div className="text-[13px] font-medium text-slate-500">
                Người dùng
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col items-start">
              <div className="text-xl font-bold text-slate-900 leading-tight">
                10K+
              </div>
              <div className="text-[13px] font-medium text-slate-500">
                Bộ phim
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200"></div>
            <div className="flex flex-col items-start">
              <div className="text-xl font-bold text-slate-900 leading-tight">
                4K
              </div>
              <div className="text-[13px] font-medium text-slate-500">
                Chất lượng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
