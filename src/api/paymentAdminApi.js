import api from "./apiClient.js";

export const getAllPaymentsAdmin = async (params) => {
  const res = await api.get("/admin/payments", { params });
  return res.data; 
};

export const getPaymentByIdAdmin = async (id) => {
  const res = await api.get(`/admin/payments/${id}`);
  return res.data;
};

export const verifyPaymentAdmin = async (id, data) => {
  const res = await api.post(`/admin/payments/${id}/verify`, data);
  return res.data;
};
