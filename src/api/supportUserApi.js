import axios from "axios";

const API_URL = "https://dev-chill-be-deploy.vercel.app/api/support";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createTicketClient = async (data) => {
  const res = await axios.post(API_URL, data, { headers: getAuthHeader() });
  return res.data;
};

export const getMyTicketsClient = async () => {
  const res = await axios.get(`${API_URL}/my-tickets`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const getTicketDetailClient = async (id) => {
  const res = await axios.get(`${API_URL}/my-tickets/${id}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
export const getMyNotificationsClient = async () => {
  const res = await axios.get(`${API_URL}/notifications`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
export const markNotificationReadClient = async (id) => {
  const res = await axios.put(
    `${API_URL}/notifications/${id}/read`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return res.data;
};

export const replyTicketClient = async (id, data) => {
  const res = await axios.post(`${API_URL}/${id}/reply`, data, {
    headers: getAuthHeader(),
  });
  return res.data;
};
export const closeTicketClient = async (id) => {
  const res = await axios.put(
    `${API_URL}/${id}/close`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return res.data;
};
