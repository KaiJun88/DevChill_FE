import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicMovies } from "../api/moviesPublicApi";
import { Star } from "lucide-react";

export default function CategoryMovies() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const unwrap = (res) => res?.data?.data ?? res?.data ?? [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getPublicMovies({
          category: slug,
          page: 1,
          limit: 24,
        });

        const data = unwrap(res);
        setMovies(data);
        if (data?.length > 0 && data[0]?.category_name) {
          setCategoryName(data[0].category_name);
        } else {
          setCategoryName(slug.replaceAll("-", " "));
        }
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Đang tải phim thể loại...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-10">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold capitalize">{categoryName}</h1>
        <p className="text-sm text-gray-500 mt-1">{movies.length} phim</p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {movies.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-20">
            Không có phim trong thể loại này
          </div>
        )}
        {movies.map((movie) => (
          <Link
            key={movie.id || movie.slug}
            to={`/movies/${movie.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition"
          >
            <img
              src={movie.poster_url || "/fallback.jpg"}
              className="h-64 w-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="p-3">
              <h3 className="text-sm font-medium truncate group-hover:text-red-500 transition">
                {movie.name}
              </h3>

              {movie.year && (
                <p className="text-xs text-gray-500 mt-1">{movie.year}</p>
              )}
            </div>

            {movie.is_premium && (
              <div className="absolute top-3 right-3 bg-yellow-400 p-1.5 rounded-full shadow">
                <Star size={14} className="text-black" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
