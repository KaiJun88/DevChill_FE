import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-[8rem] font-extrabold text-blue-400">
        {" "}
        DevChill 404
      </h1>
      <div className="w-48 h-48 my-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
      </div>
      <p className="text-xl md:text-2xl mb-6 text-blue-400 text-center">
        Oops! Trang bạn tìm không tồn tại.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-green-400 hover:bg-green-200 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-200"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
