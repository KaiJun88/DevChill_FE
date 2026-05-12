/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicMovieBySlug } from "../api/moviesPublicApi";
import { getProfile } from "../api/userApi";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { getAccessToken } from "../utils/auth";
import { getLifecycleStatus } from "../utils/getLifecycleStatus";
import { Lock, Crown } from "lucide-react";

export default function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const EP_PER_PAGE = 10;

  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedServer, setSelectedServer] = useState(null);

  const [showTrailer, setShowTrailer] = useState(false);

  const token = getAccessToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieRes = await getPublicMovieBySlug(slug);
        const data = movieRes?.data?.data || movieRes?.data;

        setMovie(data);

        if (token) {
          try {
            const profileRes = await getProfile();
            setProfile(profileRes?.data || profileRes);
          } catch (err) {
            console.error(err);
          }
        }

        if (data?.episodes?.length) {
          setSelectedEpisode(data.episodes[0]);
          setSelectedServer(data.episodes[0]?.streams?.[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        Not found
      </div>
    );
  }

  const isPremiumUser = profile?.is_premium === true;
  const isPremiumMovie = movie.is_premium === true;

  const handleWatch = () => {
    if (!token) {
      toast.warning("Bạn cần đăng nhập để xem phim");
      navigate("/login");
      return;
    }

    if (isPremiumMovie && !isPremiumUser) {
      toast.error("Phim này yêu cầu tài khoản Premium 👑");
      return;
    }

    navigate(`/movies/watch/${movie.slug}`);
  };

  const isUpcoming = movie.lifecycle_status === "upcoming";
  const episodes = movie.episodes || [];
  const totalPages = Math.ceil(episodes.length / EP_PER_PAGE);
  const start = (currentPage - 1) * EP_PER_PAGE;
  const currentEpisodes = episodes.slice(start, start + EP_PER_PAGE);

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const id = url.split("v=")[1];
    return `https://www.youtube.com/embed/${id}`;
  };

  const { label, color } = getLifecycleStatus(movie.lifecycle_status);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={movie.poster_url}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-white via-white/70 to-transparent" />

        {/* PREMIUM BADGE */}
        {isPremiumMovie && (
          <div className="absolute top-6 left-6 z-20">
            <span
              className={`px-4 py-2 text-xs rounded-full font-semibold shadow flex items-center gap-2 ${
                isPremiumUser
                  ? "bg-yellow-400 text-black"
                  : "bg-black text-white"
              }`}
            >
              {isPremiumUser ? (
                <>
                  <Crown size={14} /> Premium
                </>
              ) : (
                <>
                  <Lock size={14} /> Premium
                </>
              )}
            </span>
          </div>
        )}

        {/* LIFECYCLE */}
        <div className="absolute top-6 right-6 z-20">
          <span
            className={`px-4 py-2 text-xs rounded-full font-semibold shadow text-white ${color}`}
          >
            {label}
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {movie.name}
          </h1>
          <p className="text-gray-500 mt-2">{movie.origin_name}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowTrailer(true)}
              className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            >
              ▶ Trailer
            </button>

            {!isUpcoming && (
              <div className="relative group">
                <button
                  onClick={handleWatch}
                  className={`px-5 py-2 rounded-xl transition flex items-center gap-2 ${
                    isPremiumMovie && !isPremiumUser
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:opacity-90"
                  }`}
                >
                  {isPremiumMovie && !isPremiumUser && <Lock size={16} />}
                  {isPremiumMovie && !isPremiumUser ? "Premium" : "Xem phim"}
                </button>

                {isPremiumMovie && !isPremiumUser && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    opacity-0 group-hover:opacity-100 transition pointer-events-none"
                  >
                    <div className="bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
                      <Lock size={12} />
                      Nâng cấp Premium để xem phim này
                    </div>
                    <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <img
              src={movie.poster_url}
              className="rounded-2xl shadow-md w-full"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{movie.content}</p>

              <div className="flex flex-wrap gap-2">
                {movie.categories?.map((c) => (
                  <span
                    key={c.id}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-full"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-400">Năm</p>
                <p className="font-semibold">{movie.year}</p>
              </div>

              <div>
                <p className="text-gray-400">Thời lượng</p>
                <p className="font-semibold">{movie.duration} phút</p>
              </div>

              <div>
                <p className="text-gray-400">Số tập</p>
                <p className="font-semibold">{movie.episode_total}</p>
              </div>

              <div>
                <p className="text-gray-400">Quốc gia</p>
                <p className="font-semibold">
                  {movie.countries?.map((c) => c.name).join(", ")}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-gray-400">Diễn viên</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {movie.people?.map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isUpcoming && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Danh sách tập</h2>

            <div className="flex flex-wrap gap-2">
              {currentEpisodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEpisode(ep);
                    setSelectedServer(ep.streams?.[0]);
                  }}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    selectedEpisode?.id === ep.id
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {ep.name}
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* TRAILER */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[90%] max-w-4xl">
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-video">
                <iframe
                  src={getYoutubeEmbed(movie.trailer_url)}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTrailer(false)}
                className="px-4 py-2 bg-white rounded-lg hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
