import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { searchMovies } from "../api/moviesPublicApi";

export default function SearchBox() {
  const [search, setSearch] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const timerRef = useRef(null);
  const skipSyncRef = useRef(false);

  useEffect(() => {
    if (skipSyncRef.current) {
      skipSyncRef.current = false;
      return;
    }
    const params = new URLSearchParams(location.search);
    setSearch(params.get("keyword") || "");
  }, [location.search]);

  useEffect(() => {
    const q = search.trim();

    if (q.length < 2) {
      setSuggests([]);
      setShowSuggest(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    setShowSuggest(true);

    timerRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMovies({ keyword: q, limit: 5 });
        const data = res?.data?.data ?? res?.data ?? [];

        setSuggests(data);
      } catch (err) {
        console.error("search error:", err);
        setSuggests([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [search]);

  const executeSearch = (keyword) => {
    if (!keyword) return;
    skipSyncRef.current = true;
    const params = new URLSearchParams(location.search);
    params.set("keyword", keyword);
    params.set("page", "1");
    navigate(`/movies?${params.toString()}`);
    setShowSuggest(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(search.trim());
  };

  const clearSearch = () => {
    skipSyncRef.current = true;
    setSearch("");
    setSuggests([]);
    setShowSuggest(false);
    const params = new URLSearchParams(location.search);
    params.delete("keyword");
    params.set("page", "1");
    navigate(`/movies?${params.toString()}`);
  };

  const handleSelectMovie = (movie) => {
    skipSyncRef.current = true;
    setSearch("");
    setSuggests([]);
    setShowSuggest(false);
    navigate(`/movies/${movie.slug}`);
  };

  return (
    <div className="relative w-72">
      <form
        onSubmit={handleSearch}
        className="flex items-center h-10 px-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400/40 focus-within:border-blue-400"
      >
        {loading ? (
          <FaSpinner className="text-blue-500 text-sm mr-2 animate-spin" />
        ) : (
          <FaSearch className="text-gray-400 text-sm mr-2" />
        )}

        <input
          type="text"
          placeholder="Tìm phim, diễn viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search.trim().length >= 2 && setShowSuggest(true)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </form>
      {showSuggest && search.trim().length >= 2 && (
        <div className="absolute top-12 left-0 w-full bg-white shadow-lg border border-gray-100 rounded-md overflow-hidden z-50 transform origin-top transition-all duration-200">
          {suggests.length > 0 ? (
            <div
              className={`flex flex-col transition-opacity duration-200 ${
                loading ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              {suggests.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                >
                  <img
                    src={
                      movie.thumb_url ||
                      movie.poster_url ||
                      "https://via.placeholder.com/40x60"
                    }
                    alt={movie.name}
                    className="w-10 h-14 object-cover rounded bg-gray-200 shrink-0 shadow-sm"
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-sm text-gray-700 font-medium line-clamp-2 leading-tight">
                      {movie.name}
                    </span>
                  </div>
                </div>
              ))}

              <div
                onClick={() => executeSearch(search.trim())}
                className="p-2.5 bg-gray-50/80 text-center text-sm text-blue-600 hover:bg-blue-50 cursor-pointer font-medium transition-colors"
              >
                Xem tất cả kết quả
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              {loading ? "Đang tìm kiếm..." : `Không tìm thấy "${search}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
