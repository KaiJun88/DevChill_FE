import api from "./apiClient.js";

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const updateProfile = async ({
  username,
  gender,
  avatar_url,
  birth_date,
}) => {
  const res = await api.put("/profile", {
    username,
    gender,
    avatar_url,
    birth_date,
  });
  return res.data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const res = await api.put("/profile/change-password", {
    oldPassword,
    newPassword,
    confirmPassword,
  });
  return res.data;
};
