import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, Mail, Lock } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "../api/authApi";
import { setTokens, setMe } from "../utils/auth";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-4 py-3 rounded-lg text-base outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium";

const inputStyle = {
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(209,213,219,1)",
};

const gradBtn =
  "w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-[0.98]";

const gradStyle = {
  background: "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
  boxShadow: "0 4px 20px rgba(59,130,246,0.25)",
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess(data) {
      // 1. Lấy token mới và refresh token (Dùng data?.accessToken nếu backend đã đổi tên biến, hoặc data?.token nếu chưa)
      const accessToken = data?.accessToken || data?.token;
      const refreshToken = data?.refreshToken;
      const user = data?.user;

      // 2. Kiểm tra có đủ CẢ 2 token không
      if (accessToken && refreshToken) {
        // 3. Gọi hàm lưu CẢ 2 token vào localStorage
        setTokens(accessToken, refreshToken);

        // 4. (Tùy chọn) Lưu thông tin user nếu cần
        if (user) {
          setMe(user);
        }

        qc.invalidateQueries({ queryKey: ["me"] });

        toast.success(`Chào mừng ${user?.username || "bạn"} quay lại!`);

        if (user?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        toast.error("Đăng nhập thất bại: Thiếu token xác thực");
      }
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Đăng nhập thất bại");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const isLoading = mutation.isPending || isSubmitting;
  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-50 border-r border-gray-200">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 flex flex-col justify-center h-full px-16">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500 shadow-sm">
              <Film size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-gray-900">DevChill</span>
          </Link>

          <h1 className="text-4xl font-black text-gray-900 leading-snug mb-4">
            Trải nghiệm điện ảnh
            <br />
            <span className="text-blue-600">thông minh hơn</span>
          </h1>

          <p className="text-base text-gray-500 mb-10 max-w-lg">
            AI gợi ý phim cá nhân hóa, công chiếu realtime và kho phim đỉnh
            nhất.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-lg">
            {[
              { val: "10K+", label: "Phim" },
              { val: "88K+", label: "Người dùng" },
              { val: "92%", label: "AI chính xác" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl text-center bg-white border border-gray-200 shadow-sm"
              >
                <p className="text-2xl font-black text-blue-600">{s.val}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-8 relative bg-white">
        <div className="fixed bottom-8 right-8 z-50">
          <style>
            {`
      @keyframes float-soft {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .animate-float-soft {
        animation: float-soft 3s ease-in-out infinite;
      }
    `}
          </style>
          <div className="animate-float-soft">
            <Link
              to="/guest-support"
              className="flex items-center gap-2.5 px-5 py-3 bg-blue-50/90 backdrop-blur-md border border-blue-200 text-blue-700 rounded-full shadow-xl shadow-blue-500/10 hover:shadow-2xl hover:scale-105 hover:bg-white transition-all duration-300 group"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:scale-110 transition-transform"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>

              <span className="font-extrabold text-[14px] tracking-tight">
                Hỗ Trợ 24/7
              </span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">DevChill</span>
          </div>

          <div className="rounded-2xl p-8 backdrop-blur-xl bg-white border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 mb-1">
              Đăng nhập
            </h2>
            <p className="text-xl text-gray-500 mb-8">
              Chào mừng trở lại với DevChill!
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  EMAIL
                </label>

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                  <input
                    type="email"
                    {...register("email")}
                    className={`${inputBase} pl-10 ${
                      errors.email ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="example@gmail.com"
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  MẬT KHẨU
                </label>

                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />

                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`${inputBase} pl-10 pr-10 ${
                      errors.password ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={gradBtn}
                style={gradStyle}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => toast.info("Đang phát triển Google Login!")}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-blue-200 rounded-lg shadow-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Đang phát triển Facebook Login!")}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-blue-200 rounded-lg shadow-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    className="w-6 h-6 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("Đang phát triển GitHub Login!")}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-blue-200 rounded-lg shadow-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg
                    className="w-5 h-5 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
