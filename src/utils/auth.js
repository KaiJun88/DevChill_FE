export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const setMe = (user) => {
  if (user) localStorage.setItem("me", JSON.stringify(user));
};

export const getMe = () => {
  const data = localStorage.getItem("me");
  return data ? JSON.parse(data) : null;
};

export const removeMe = () => {
  localStorage.removeItem("me");
};

export const logout = () => {
  removeTokens();
  removeMe();
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("devchill_chat_")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};

export const setForgotEmail = (email) => {
  if (email) localStorage.setItem("forgotemail", email);
};

export const getForgotEmail = () => {
  return localStorage.getItem("forgotemail");
};

export const removeForgotEmail = () => {
  localStorage.removeItem("forgotemail");
};

export const isLogedIn = () => !!getAccessToken();
