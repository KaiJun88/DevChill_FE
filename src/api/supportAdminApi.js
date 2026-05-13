import api from "./apiClient.js";

export const getUnreadSupportCountAdmin = async () => {
  const res = await api.get("/admin/support/unread-count");
  return res.data;
};

export const getAllSupportTicketsAdmin = async (params) => {
  const res = await api.get("/admin/support", { params });
  return res.data;
};

export const getSupportTicketByIdAdmin = async (id) => {
  const res = await api.get(`/admin/support/${id}`);
  return res.data;
};
export const replySupportTicketAdmin = async (id, data) => {
  const res = await api.post(`/admin/support/${id}/reply`, data);
  return res.data;
};
export const updateTicketStatusAdmin = async (id, data) => {
  const res = await api.patch(`/admin/support/${id}/status`, data);
  return res.data;
};
