import { z } from "zod";

const passwordRules = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/\d/, "Mật khẩu phải chứa ít nhất 1 chữ số")
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt",
  )
  .regex(
    /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
    "Mật khẩu không được chứa khoảng trắng hoặc ký tự có dấu",
  );

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên hiển thị phải có ít nhất 3 ký tự")
      .max(30, "Tên hiển thị không dài quá 30 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: passwordRules,
    confirmPassword: z.string(),
    verify: z.boolean().refine((val) => val === true, {
      message: "Bạn phải xác minh là con người",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export const resetPasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu cũ"),
    newPassword: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu nhập lại không khớp",
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
