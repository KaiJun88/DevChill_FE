/* eslint-disable no-unused-vars */

import { useEffect, useState, useTransition, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPublicMovies } from "../api/moviesPublicApi";
import SkeletonCard from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import { Star, MapPin, Calendar, Play, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoviesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  const filters = useMemo(() => {
    const get = (key) => searchParams.get(key) || "";
    return {
      page: Number(get("page")) || 1,
      keyword: get("keyword"),
      category: get("category"),
      country: get("country"),
      year: get("year"),
      lifecycle_status: get("lifecycle_status"),
      is_premium: get("is_premium") === "true",
      type: get("type"),
    };
  }, [searchParams]);

  const title = useMemo(() => {
    if (filters.keyword) return `Kết quả: "${filters.keyword}"`;
    if (filters.country) return `Điện ảnh ${filters.country.replace("-", " ")}`;
    if (filters.category)
      return `Thể loại ${filters.category.replace("-", " ")}`;
    if (filters.is_premium) return "Phim Độc Quyền VIP";
    if (filters.type === "movie") return "Phim Lẻ";
    if (filters.type === "series") return "Phim Bộ";
    return filters.lifecycle_status === "upcoming"
      ? "Siêu phẩm sắp ra mắt"
      : "Thư viện điện ảnh";
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(searchParams.entries());
        const res = await getPublicMovies({ ...params, limit: 12 });
        if (cancelled) return;
        const items = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        startTransition(() => {
          setMovies(items);
          setPagination(
            res?.pagination || {
              page: Number(params.page) || 1,
              limit: 12,
              total: items.length,
            },
          );
        });
      } catch (err) {
        console.error("Fetch movies error:", err);
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const totalPages = Math.ceil(
    (pagination.total || 0) / (pagination.limit || 12),
  );

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans selection:bg-blue-100 selection:text-blue-600">
      <div className="bg-white border-b border-slate-100 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">
                Collections
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-light text-slate-800 capitalize tracking-tight leading-none">
              {title} <span className="font-semibold text-blue-600">.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Khám phá không gian điện ảnh với{" "}
              <span className="text-slate-600">{pagination.total}</span> tác
              phẩm đặc sắc
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="relative min-h-125">
          <AnimatePresence>
            {loading && (
              <motion.div
                key="skeleton-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 bg-[#F8FAFC]"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {!loading && movies.length > 0 && (
              <motion.div
                key="movies-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8"
              >
                {movies.map((movie) => (
                  <motion.div
                    key={movie.id || movie.slug}
                    layout
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link
                      to={`/movies/${movie.slug}`}
                      className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                      <div className="relative aspect-2/3 overflow-hidden bg-slate-200">
                        <img
                          src={movie.poster_url}
                          alt={movie.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-1000 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                          {movie.country && (
                            <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-md shadow-sm border border-slate-100">
                              <span className="text-[9px] font-bold text-slate-700 uppercase tracking-tighter">
                                {movie.country}
                              </span>
                            </div>
                          )}
                          <div className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-md text-white text-[9px] font-medium flex items-center gap-1">
                            <Calendar size={8} /> {movie.year || "2024"}
                          </div>
                        </div>

                        {movie.is_premium && (
                          <div className="absolute top-2 right-2 bg-yellow-400 p-1.5 rounded-lg shadow-md">
                            <Star
                              size={10}
                              fill="white"
                              className="text-white"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                            <Play
                              fill="white"
                              size={16}
                              className="ml-0.5 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[13px] font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight">
                            {movie.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 truncate font-medium">
                            {movie.origin_name}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {movie.categories?.slice(0, 1).map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-[8px] font-bold text-slate-400 uppercase tracking-widest"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {!loading && movies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-300">
              <SearchX size={40} strokeWidth={1} />
              <p className="mt-4 text-sm font-medium">
                Không tìm thấy nội dung phù hợp
              </p>
            </div>
          )}
        </div>
        {!loading && totalPages >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 mb-6 flex flex-col items-center gap-6"
          >
            <div className="h-px w-24 bg-slate-200" />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-slate-800/90 backdrop-blur-xl text-white px-5 py-2 rounded-2xl text-[10px] font-bold shadow-xl flex items-center gap-3 border border-white/10 tracking-[0.2em]">
              <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
              UPDATING
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
