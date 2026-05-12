/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { getLifecycleStatus } from "../../utils/getLifecycleStatus";

export default function MovieGrid({ movies }) {
  if (!movies?.length)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="aspect-2/3 bg-slate-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
      {movies.map((movie) => {
        const status = getLifecycleStatus(movie.lifecycle_status);
        return (
          <motion.div
            key={movie.id || movie.slug}
            whileHover={{ y: -4 }}
            className="group flex flex-col h-full"
          >
            <Link to={`/movies/${movie.slug}`} className="flex flex-col flex-1">
              <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/40 transition-all duration-500 group-hover:shadow-md">
                <img
                  src={movie.poster_url || "/fallback.jpg"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={movie.name}
                  loading="lazy"
                />
                <div className="absolute top-2 left-2 z-20">
                  <span
                    className={`${status.color} backdrop-blur-md bg-opacity-90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider`}
                  >
                    {status.label}
                  </span>
                </div>
                {movie.is_premium && (
                  <div className="absolute top-2 right-2 bg-yellow-400/90 backdrop-blur-md p-1 rounded z-20">
                    <Star size={8} className="text-white fill-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0B1121]/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Play fill="#fff" size={12} className="ml-0.5 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex-1">
                <h3 className="font-semibold text-xs text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight">
                  {movie.name}
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5 font-normal truncate uppercase tracking-tighter">
                  {movie.origin_name || "Đang cập nhật"}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
