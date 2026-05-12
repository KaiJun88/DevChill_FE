import api from "./apiClient.js";

export const getDashboard24h = async () => {
  const res = await api.get("/admin/overview/dashboard/24h");
  return res.data;
};

export const getReports = async ({ from_date, to_date, type }) => {
  const res = await api.get("/admin/overview/reports", {
    params: { from_date, to_date, type },
  });
  return res.data;
};
