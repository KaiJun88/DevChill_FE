import api from "./apiClient.js";

export const getWatchHistory = async (page = 1, limit = 10) => {
  const res = await api.get(`/history?page=${page}&limit=${limit}`);
  return res.data;
};

export const getEpisodeProgress = async (episodeId) => {
  const res = await api.get(`/history/progress/${episodeId}`);
  return res.data;
};

export const updateWatchProgress = async ({
  movieId,
  episodeId,
  watchedDuration,
  totalDuration,
}) => {
  const res = await api.post("/history/progress", {
    movieId,
    episodeId,
    watchedDuration,
    totalDuration,
  });
  return res.data;
};

export const deleteHistoryItem = async (historyId) => {
  const res = await api.delete(`/history/${historyId}`);
  return res.data;
};

export const clearAllHistory = async () => {
  const res = await api.delete("/history");
  return res.data;
};
