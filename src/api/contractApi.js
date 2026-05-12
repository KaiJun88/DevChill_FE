// src/api/contractApi.js
import api from "./apiClient.js";

export const getContracts = async (params = {}) => {
  const res = await api.get("/admin/contracts", { params });
  return res.data;
};

export const getContractById = async (id) => {
  const res = await api.get(`/admin/contracts/${id}`);
  return res.data;
};

export const createContract = async (data) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.start_date) formData.append("start_date", data.start_date);
  if (data.end_date) formData.append("end_date", data.end_date);
  if (data.status) formData.append("status", data.status);
  if (data.file) formData.append("file", data.file);
  const res = await api.post("/admin/contracts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateContract = async (id, data) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.start_date) formData.append("start_date", data.start_date);
  if (data.end_date) formData.append("end_date", data.end_date);
  if (data.status) formData.append("status", data.status);
  if (data.file) formData.append("file", data.file);
  const res = await api.patch(`/admin/contracts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const downloadContractFile = async (id) => {
  const res = await api.get(`/admin/contracts/${id}/file`, {
    responseType: "blob",
  });
  return res.data;
};
