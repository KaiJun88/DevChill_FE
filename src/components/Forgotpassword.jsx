import { Link, useNavigate } from "react-router-dom";
import { Film, Mail, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";

const inputBase =
  "w-full px-6 py-4 rounded-2xl text-lg outline-none transition-all duration-200 text-gray-800 placeholder-gray-400";

const inputNormal = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(209,213,219,1)",
};

const gradBtn =
  "w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 text-white disabled:opacity-70";

const gradStyle = {
  background: "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
  boxShadow: "0 4px 20px rgba(59,130,246,0.25)",
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess() {
      toast.success("Đã gửi email khôi phục!");
      navigate("/login");
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Không thể gửi email!");
    },
  });

  const onSubmit = (data) => {
    if (mutation.isPending) return;
    mutation.mutate(data.email);
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col bg-gray-50 border-r border-gray-200">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.03) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="relative z-10 flex flex-col justify-center h-full px-14 py-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-500 shadow-sm">
              <Film size={24} className="text-white" />
            </div>

            <span className="text-3xl font-black text-gray-900">DevChill</span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 leading-snug mb-4">
            Trải nghiệm điện ảnh
            <br />
            <span className="text-blue-600">thông minh hơn</span>
          </h1>

          <p className="text-base mb-12 text-gray-500">
            AI gợi ý phim cá nhân hóa, công chiếu realtime
            <br />
            và kho phim đỉnh nhất.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "10K+", label: "Phim" },
              { val: "88K+", label: "Người dùng" },
              { val: "92%", label: "AI chính xác" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-2xl text-center bg-white border border-gray-200 shadow-sm"
              >
                <p className="text-2xl font-black text-blue-600">{s.val}</p>
                <p className="text-xs mt-1 text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 relative bg-white">
        <div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100" />

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500">
              <Film size={20} className="text-white" />
            </div>

            <span className="text-2xl font-black text-gray-900">DevChill</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-3xl p-10 bg-white border border-gray-200 shadow-sm">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 border border-blue-200">
                <KeyRound size={28} className="text-blue-600" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-2">
                Quên mật khẩu?
              </h2>

              <p className="text-sm mb-8 text-gray-500">
                Nhập email để nhận liên kết đặt lại mật khẩu.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold mb-1.5 block text-gray-600">
                    EMAIL
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="email"
                      {...register("email")}
                      disabled={isSubmitting || mutation.isPending}
                      className={`${inputBase} pl-12`}
                      style={inputNormal}
                      placeholder="example@gmail.com"
                    />
                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className={gradBtn}
                  style={gradStyle}
                >
                  {isSubmitting || mutation.isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi liên kết đặt lại"
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">hoặc</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <p className="text-center text-sm text-gray-500">
                Nhớ mật khẩu rồi?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
