import api from "./api.js";

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put("/auth/change-password", { currentPassword, newPassword });
  return data;
};
