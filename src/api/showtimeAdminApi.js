import api from "./apiClient.js";

export const getAllShowtimesAdmin = async (params) => {
  const res = await api.get("/admin/showtimes", { params });
  return res.data;
};
export const getShowtimeByIdAdmin = async (id) => {
  const res = await api.get(`/admin/showtimes/${id}`);
  return res.data;
};

export const createShowtimeAdmin = async (data) => {
  const res = await api.post("/admin/showtimes", data);
  return res.data;
};
export const updateShowtimeAdmin = async (id, data) => {
  const res = await api.put(`/admin/showtimes/${id}`, data);
  return res.data;
};
