import api from "./apiClient.js";

const handle = (promise) =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || err.message;
    });
export const createPlan = (data) => handle(api.post("/admin/plans", data));

export const updatePlan = (id, data) =>
  handle(api.put(`/admin/plans/${id}`, data));

export const getAllPlansAdmin = (params = {}) =>
  handle(api.get("/admin/plans", { params }));

export const getPlanById = (id) => handle(api.get(`/admin/plans/${id}`));

export const togglePlanStatus = (id) =>
  handle(api.patch(`/admin/plans/${id}/toggle-status`));
