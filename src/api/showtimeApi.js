import api from "./apiClient";

export const showtimesApi = {
  getAllPublic: async () => {
    const res = await api.get("/showtimes");
    return res.data;
  },
  getDetail: async (id) => {
    const res = await api.get(`/showtimes/${id}`);
    return res.data;
  },
  watchPremiere: async (id) => {
    const res = await api.get(`/showtimes/watch/${id}`);
    return res.data;
  },
};
