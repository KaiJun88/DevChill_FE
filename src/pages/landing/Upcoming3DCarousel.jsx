/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Upcoming3DCarousel({ movies }) {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => setRotation((prev) => prev - 72), 4000);
    return () => clearInterval(timer);
  }, [isHovered]);

  if (!movies?.length) return null;

  const displayMovies = movies.slice(0, 5);
  const radius = window.innerWidth < 768 ? 140 : 200;

  return (
    <motion.div
      animate={{ rotateY: rotation }}
      transition={{ type: "spring", stiffness: 40, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-32 md:w-40 h-48 md:h-60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayMovies.map((movie, idx) => {
        const angle = idx * 72;
        return (
          <div
            key={movie.id}
            className="absolute inset-0 bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-white/5"
            style={{
              transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              backfaceVisibility: "hidden",
            }}
          >
            <Link
              to={`/movies/${movie.slug}`}
              className="block h-full relative group"
            >
              <img
                src={movie.poster_url}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                alt={movie.name}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/40 to-transparent p-3">
                <h4 className="text-white font-bold text-[10px] md:text-xs truncate">
                  {movie.name}
                </h4>
              </div>
            </Link>
          </div>
        );
      })}
    </motion.div>
  );
}
