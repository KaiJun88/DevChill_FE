import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Film, KeyRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordApi } from "../api/authApi";
import { toast } from "react-toastify";
import { resetPasswordSchema } from "../schemas/auth";

const inputBase =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 text-gray-800 placeholder-gray-400";

const inputNormal = {
  background: "rgba(255,255,255,0.95)",
  border: "1px solid rgba(209,213,219,1)",
};

const gradBtn =
  "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 text-white disabled:opacity-70";

const gradStyle = {
  background: "linear-gradient(135deg,#3B82F6 0%,#6366F1 100%)",
  boxShadow: "0 4px 20px rgba(59,130,246,0.25)",
};

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess() {
      toast.success("Đổi mật khẩu thành công!");
      navigate("/login");
    },
    onError(err) {
      toast.error(err?.response?.data?.message || "Reset thất bại!");
    },
  });

  const onSubmit = (data) => {
    if (!token) {
      toast.error("Token không hợp lệ!");
      return;
    }

    mutation.mutate({
      token,
      newPassword: data.password,
    });
  };

  return (
    <div className="min-h-screen flex bg-white text-gray-800">
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

        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute bottom-0 right-20 w-80 h-80 rounded-full bg-indigo-100 blur-3xl" />

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
            <div className="rounded-3xl p-8 bg-white border border-gray-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-blue-50 border border-blue-200">
                <KeyRound size={26} className="text-blue-600" />
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-1">
                Cập nhật mật khẩu
              </h2>

              <p className="text-sm mb-7 text-gray-500">
                Nhập mật khẩu mới của bạn
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-gray-600">
                    MẬT KHẨU MỚI
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      {...register("password")}
                      className={`${inputBase} pr-10`}
                      style={inputNormal}
                      placeholder="password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-gray-600">
                    NHẬP LẠI MẬT KHẨU
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={`${inputBase} pr-10`}
                      style={inputNormal}
                      placeholder="confirm password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className={gradBtn}
                  style={gradStyle}
                >
                  {mutation.isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </button>
              </div>

              <p className="text-center mt-5 text-sm text-gray-500">
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Quay lại đăng nhập
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
