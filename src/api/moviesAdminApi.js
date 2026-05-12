import api from "./apiClient.js";

export const createMovie = async (data) => {
  const res = await api.post("/admin/movies", data);
  return res.data;
};
export const updateMovieInfo = async (id, data) => {
  const res = await api.put(`/admin/movies/${id}/info`, data);
  return res.data;
};
export const updateMovieMeta = async (id, data) => {
  const res = await api.put(`/admin/movies/${id}/meta`, data);
  return res.data;
};

export const updateMovieMedia = async (id, data) => {
  const res = await api.put(`/admin/movies/${id}/media`, data);
  return res.data;
};

export const updateMovieSetting = async (id, data) => {
  const res = await api.put(`/admin/movies/${id}/setting`, data);
  return res.data;
};

export const getAllMovies = async (params) => {
  const res = await api.get("/admin/movies", { params });
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await api.get(`/admin/movies/${id}`);
  return res.data;
};
