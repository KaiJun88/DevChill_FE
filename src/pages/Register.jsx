import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film, Mail, Lock, User } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth";

import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api/authApi";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-4 py-3 rounded-lg text-base outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 font-medium";

const inputStyle = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(209,213,219,1)",
};

const gradBtn =
  "w-full py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70";

const gradStyle = {
  background: "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
  boxShadow: "0 4px 20px rgba(59,130,246,0.25)",
};

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      verify: false,
    },
  });

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess(data, variables) {
      toast.success(data.message || "Đã gửi OTP, kiểm tra email!");
      navigate("/verify-otp", { state: { email: variables.email } });
    },
    onError(err) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Đăng ký thất bại",
      );
    },
  });

  const onSubmit = (data) => {
    if (mutation.isPending) return;
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
            Tham gia ngay
            <br />
            <span className="text-blue-600">cộng đồng DevChill</span>
          </h1>

          <p className="text-base text-gray-500 mb-10 max-w-lg">
            Tạo tài khoản để trải nghiệm AI gợi ý phim và kho nội dung cực chất.
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
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-black text-gray-900 mb-1">Đăng ký</h2>
            <p className="text-xl text-gray-500 mb-8">Tạo tài khoản DevChill</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  USERNAME
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                  <input
                    {...register("username")}
                    disabled={isLoading}
                    className={`${inputBase} pl-10 ${
                      errors.username ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="yourname"
                  />
                </div>

                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  EMAIL
                </label>

                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
                  <input
                    type="email"
                    {...register("email")}
                    disabled={isLoading}
                    className={`${inputBase} pl-10 ${
                      errors.email ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="name@email.com"
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
                    disabled={isLoading}
                    className={`${inputBase} pl-10 pr-10 ${
                      errors.password ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
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
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block font-semibold">
                  XÁC NHẬN MẬT KHẨU
                </label>

                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    disabled={isLoading}
                    className={`${inputBase} pl-10 pr-10 ${
                      errors.confirmPassword ? "border border-red-500" : ""
                    }`}
                    style={inputStyle}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setConfirmShowPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("verify")}
                  disabled={isLoading}
                  className="w-4 h-4 accent-blue-500 cursor-pointer"
                />
                <label className="text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    điều khoản dịch vụ
                  </Link>
                </label>
              </div>

              {errors.verify && (
                <p className="text-red-500 text-xs">{errors.verify.message}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={gradBtn}
                style={gradStyle}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang gửi email...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>
            <p className="text-center mt-6 text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
