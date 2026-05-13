import { Link } from "react-router-dom";
import { Play } from "lucide-react";

export default function Top10WeeklySection({ movies }) {
  if (!movies || movies.length === 0) return null;
  const isScrollable = movies.length > 4;
  const displayMovies = isScrollable ? [...movies, ...movies] : movies;

  const titleText = "Top 10 Trong Tuần";
  const letters = titleText.split("");

  return (
    <section className="w-full overflow-hidden relative py-8">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Marquee (giữ nguyên logic cuộn) */
          .my-marquee-track {
            width: max-content;
            animation: scroll-marquee 40s linear infinite;
            will-change: transform;
          }
          .my-marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes scroll-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1.75rem)); }
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
        `,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex flex-col items-start perspective-1000">
          <div className="flex flex-col items-center animate-float-premium relative ml-4 w-fit">
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
        </div>
      </div>

      <div className="relative flex overflow-hidden w-full group">
        <div
          className={`flex gap-10 md:gap-14 pl-4 md:pl-10 pb-12 pt-8 items-end ${isScrollable ? "my-marquee-track" : "overflow-x-auto scrollbar-hide w-full"}`}
        >
          {displayMovies.map((movie, idx) => (
            <Link
              to={`/movies/${movie.slug}`}
              key={`${movie.id}-${idx}`}
              className="relative flex items-end justify-end w-42.5 md:w-55 aspect-4/3 shrink-0 group/card outline-none"
            >
              <span
                className="absolute -left-3.75 md:-left-6.25 -bottom-2.5 md:-bottom-5 text-[100px] md:text-[140px] font-black leading-none text-[#F0F6FC] z-0 select-none drop-shadow-md tracking-tighter opacity-40 translate-x-4 origin-bottom-right transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:opacity-100 group-hover/card:-translate-x-4 group-hover/card:-translate-y-2 group-hover/card:-rotate-6 group-hover/card:scale-105"
                style={{
                  WebkitTextStroke: "3px #2563EB",
                  textShadow: "4px 4px 0px rgba(37,99,235,0.2)",
                }}
              >
                {(idx % movies.length) + 1}
              </span>
              <div className="relative w-32.5 md:w-40 aspect-2/3 rounded-xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10 border border-white/80 origin-bottom-left transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/card:translate-x-2 group-hover/card:-translate-y-6 group-hover/card:rotate-3 group-hover/card:scale-105 group-hover/card:shadow-2xl bg-slate-200">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.6)] scale-75 group-hover/card:scale-100 transition-transform duration-500">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500 ease-out">
                  <h3 className="text-white font-bold text-xs md:text-sm line-clamp-2 text-center drop-shadow-md leading-tight">
                    {movie.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
