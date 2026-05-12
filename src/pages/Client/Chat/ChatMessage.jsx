import { User, Bot, Play, Info } from "lucide-react";

export default function ChatMessage({
  msg,
  userName,
  isTyping,
  handleActionSend,
  navigate,
}) {
  return (
    <div
      className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
          msg.sender === "user"
            ? "bg-slate-200 text-slate-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[80%]`}
      >
        {msg.content && (
          <div
            className={`px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
              msg.sender === "user"
                ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                : "bg-white text-black border border-slate-200 rounded-2xl rounded-tl-sm"
            }`}
          >
            {msg.content}
          </div>
        )}

        {msg.options && (
          <div className="mt-3 flex flex-col items-start gap-2 pr-1 w-full">
            {msg.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleActionSend(opt)}
                disabled={isTyping}
                className="px-4 py-2 bg-white text-blue-600 text-[13px] font-semibold rounded-xl border border-blue-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md transition-all disabled:opacity-50 text-left w-fit"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {msg.type === "movies" && (
          <div className="mt-2 space-y-3 w-65 pr-1">
            {msg.watchedMovie && (
              <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-200 shadow-sm flex gap-3 mb-4">
                <img
                  src={
                    msg.watchedMovie.thumb_url ||
                    "https://placehold.co/100x150/png"
                  }
                  alt={msg.watchedMovie.movie_name}
                  className="w-12 h-16 object-cover rounded-md border border-blue-100"
                />
                <div className="flex flex-col flex-1 py-0.5 justify-center">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Play size={10} fill="currentColor" /> Phim{" "}
                    {userName !== "bạn" ? userName : "bạn"} vừa cày
                  </span>
                  <span className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-tight">
                    {msg.watchedMovie.movie_name}
                  </span>
                </div>
              </div>
            )}

            {msg.payload &&
              msg.payload.map((movie, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm"
                >
                  <img
                    src={
                      movie.thumb_url ||
                      movie.poster_url ||
                      "https://placehold.co/100x150/png"
                    }
                    alt={movie.name}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div className="flex flex-col flex-1 py-0.5 min-w-0">
                    <span
                      className="text-[14px] font-bold text-black line-clamp-1"
                      title={movie.name || movie.title}
                    >
                      {movie.name || movie.title}
                    </span>
                    <span className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {movie.year || "2024"} •{" "}
                      {movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
                    </span>

                    <div className="mt-auto flex gap-1.5 pt-2">
                      {movie.lifecycle_status === "upcoming" ? (
                        <button
                          disabled
                          className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-slate-200 text-slate-500 cursor-not-allowed text-[10px] font-bold rounded-md transition-colors"
                        >
                          <Info size={10} /> Sắp chiếu
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/movies/watch/${movie.slug}`)
                          }
                          className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-md transition-colors shadow-sm"
                        >
                          <Play size={10} fill="currentColor" /> Phát
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/movies/${movie.slug}`)}
                        className="flex-1 flex justify-center items-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-md transition-colors"
                      >
                        <Info size={10} /> Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
