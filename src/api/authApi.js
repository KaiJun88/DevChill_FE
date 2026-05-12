import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const registerApi = async ({
  username,
  email,
  password,
  confirmPassword,
}) => {
  const res = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
    confirmPassword,
  });
  return res.data;
};

export const verifyOtpApi = async ({ email, code }) => {
  const res = await axios.post(`${API_URL}/verify`, { email, code });
  return res.data;
};

export const resendOtpApi = async ({ email }) => {
  const res = await axios.post(`${API_URL}/resend-otp`, { email });
  return res.data;
};

export const loginApi = async ({ email, password }) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};
export const forgotPasswordApi = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password`, { email });
  return res.data;
};

export const resetPasswordApi = async ({ token, newPassword }) => {
  const res = await axios.post(`${API_URL}/reset-password`, {
    token,
    newPassword,
  });
  return res.data;
};
