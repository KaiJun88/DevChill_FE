import api from "./apiClient.js";

export const getUsers = async ({ page, limit, search }) => {
  const res = await api.get("/admin/users", {
    params: { page, limit, search },
  });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};
export const updateUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}`, data);
  return res.data;
};
export const lockUser = async (id, data) => {
  const res = await api.patch(`/admin/users/${id}/lock`, data);
  return res.data;
};

export const unlockUser = async (id) => {
  const res = await api.patch(`/admin/users/${id}/unlock`);
  return res.data;
};
