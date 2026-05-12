import axios from "axios";

const API_URL = "https://devchillbe-production.up.railway.app/api/ai";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const askDevChillAI = async (message, history = []) => {
  try {
    const res = await axios.post(
      `${API_URL}/chat`,
      { message, history },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gọi AI API:", error);
    throw error;
  }
};
