/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Play } from "lucide-react";

export default function PremiumExclusiveSection({ movies }) {
  const [queue, setQueue] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (movies?.length) {
      setQueue(movies.slice(0, 5));
    }
  }, [movies]);

  useEffect(() => {
    if (queue.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setQueue((prev) => {
        const next = [...prev];
        const first = next.shift();
        next.push(first);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [queue.length, isHovered]);

  if (!queue?.length) return null;
  const smoothTransition = { type: "spring", bounce: 0, duration: 0.7 };

  const titleText = "Phim Độc Quyền";
  const letters = titleText.split("");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 my-12"
    >
      <style>{`
        /* Progress Bar (logic giữ nguyên 100%) */
        @keyframes premiumProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* CSS Header VIP Light Theme (Đồng bộ) */
        @keyframes float-premium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        /* Đen -> Xanh */
        @keyframes neon-letter-run-light {
          0%, 100% { color: #020617; text-shadow: none; }
          5%, 15% { color: #2563eb; text-shadow: 0 0 12px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.4); }
        }
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
          color: #020617;
          animation: neon-letter-run-light 5s infinite;
        }
      `}</style>

      <div className="flex items-start justify-between mb-10 group relative perspective-1000">
        <div className="flex flex-col items-center animate-float-premium relative ml-4 w-fit">
          <div className="w-0.5 h-16 bg-linear-to-b from-transparent via-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6),inset_0_0_4px_#fff] -mt-1 z-10" />
          <div className="relative mt-2 backdrop-blur-2xl bg-white/85 border border-white/60 w-70 md:w-85 h-14 md:h-16 flex items-center justify-center text-center shadow-[0_8px_30px_rgba(37,99,235,0.1)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.2)] transition-shadow duration-500 rounded-2xl overflow-hidden group/title">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400/60 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/60 rounded-br-2xl"></div>
            <div className="absolute top-0 -left-full w-[120%] h-full bg-linear-to-r from-transparent via-blue-100/40 to-transparent skew-x-[-25deg] group-hover/title:animate-[shimmer_2s_infinite]"></div>

            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black uppercase tracking-[0.08em] md:tracking-[0.12em] relative z-10 neon-text-container-light flex items-center justify-center whitespace-nowrap gap-2 md:gap-3">
              <Crown
                size={22}
                className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] animate-pulse"
              />
              <div className="flex">
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
              </div>
            </h2>
          </div>
        </div>

        <div
          className="hidden sm:flex flex-col items-center animate-float-premium mt-4 mr-4"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="w-[1.5px] h-12 bg-linear-to-b from-transparent via-blue-300 to-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] -mt-1 z-10" />

          <Link
            to="/movies?is_premium=true"
            className="relative mt-2 backdrop-blur-xl bg-white/80 border border-white/80 px-5 py-2 hover:bg-blue-50/80 hover:border-blue-200 transition-all duration-300 flex items-center gap-2 shadow-[0_4px_15px_rgba(37,99,235,0.05)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 rounded-xl group/link overflow-hidden"
          >
            <span className="font-bold text-xs text-slate-700 group-hover/link:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-1.5 relative z-10">
              Khám phá
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1.5 transition-transform duration-300 text-blue-500"
              />
            </span>
          </Link>
        </div>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {queue.map((movie, index) => {
          const isHero = index === 0;

          return (
            <motion.div
              layout
              key={movie.id}
              transition={smoothTransition}
              className={`relative overflow-hidden group flex flex-col justify-end will-change-transform
                ${
                  isHero
                    ? "col-span-2 lg:col-span-4 h-64 lg:h-85 rounded-[1.5rem] bg-slate-900 shadow-xl shadow-blue-900/20 border border-blue-200/20 z-10"
                    : "col-span-1 h-24 lg:h-32 rounded-xl bg-slate-800 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-400/50 border border-transparent transition-all duration-300 ease-out z-0"
                }`}
            >
              <Link
                to={`/movies/${movie.slug}`}
                className="absolute inset-0 z-40"
              />
              <motion.img
                layout
                transition={smoothTransition}
                src={movie.thumb_url || movie.poster_url}
                alt={movie.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-[#040b16] via-[#040b16]/50 to-transparent z-10 pointer-events-none"
              />
              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute inset-0 bg-linear-to-t from-[#040b16]/95 via-black/40 to-transparent z-10 pointer-events-none group-hover:from-blue-950/90 transition-colors duration-500"
              />
              <motion.div
                initial={false}
                animate={{ opacity: isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-5 lg:p-8 w-full z-20 pointer-events-none flex flex-col items-start"
              >
                {isHero && (
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-100 border border-blue-400/30 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">
                      <Crown
                        size={11}
                        className="text-yellow-500"
                        strokeWidth={2.5}
                      />
                      Đỉnh Cao
                    </span>
                  </div>
                )}
                <h3 className="text-white text-2xl lg:text-4xl font-black mb-2.5 leading-tight tracking-tight drop-shadow-lg">
                  {movie.name}
                </h3>
                <p
                  className="text-blue-100/80 text-xs lg:text-sm max-w-xl font-normal mb-5 tracking-wide leading-relaxed hidden md:block drop-shadow-md"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {movie.content ||
                    "Tác phẩm điện ảnh độc quyền với chất lượng vượt trội. Trải nghiệm ngay thước phim đẳng cấp nhất."}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white text-blue-600 px-5 py-2.5 rounded-full text-xs font-bold pointer-events-auto transition-transform duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  <Play fill="currentColor" size={12} />
                  Trải nghiệm VIP
                </div>
              </motion.div>

              <motion.div
                initial={false}
                animate={{ opacity: !isHero ? 1 : 0 }}
                className="absolute bottom-0 left-0 p-2.5 lg:p-3 w-full z-20 pointer-events-none"
              >
                {!isHero && (
                  <>
                    <div className="flex items-center gap-1 mb-1">
                      <Crown
                        size={10}
                        className="text-yellow-500 drop-shadow-md"
                      />
                      <span className="text-[8px] font-bold text-blue-300 uppercase tracking-widest drop-shadow-md">
                        Premium
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-[11px] lg:text-xs line-clamp-2 leading-snug group-hover:text-blue-300 transition-colors">
                      {movie.name}
                    </h4>
                  </>
                )}
              </motion.div>
              {isHero && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10 z-30 backdrop-blur-sm">
                  <div
                    key={`progress-${movie.id}`}
                    className={`h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-[premiumProgress_5s_linear_forwards] ${
                      isHovered ? "[animation-play-state:paused]" : ""
                    }`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
