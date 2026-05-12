import api from "./apiClient";

export const planApi = {
  getAllPlans: async () => {
    const res = await api.get("/plans");
    return res.data;
  },
  getPlanById: async (id) => {
    const res = await api.get(`/plans/${id}`);
    return res.data;
  },
  getMySubscription: async () => {
    const res = await api.get("/plans/me/subscription");
    return res.data;
  },
  createPayment: async (planId) => {
    const res = await api.post("/plans/payment/create", { planId });
    return res.data;
  },

  checkPaymentStatus: async (txnRef) => {
    const res = await api.get(`/plans/payment/status/${txnRef}`);
    return res.data;
  },
  getPaymentHistory: async () => {
    const res = await api.get("/plans/payment/history");
    return res.data;
  },
};
