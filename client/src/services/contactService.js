import api from "./api.js";

export const fetchContactMessages = async (params = {}) => {
  const { data } = await api.get("/contact", { params });
  return data;
};

export const updateContactMessageStatus = async (id, status) => {
  const { data } = await api.patch(`/contact/${id}/status`, { status });
  return data;
};

export const replyToContactMessage = async (id, message) => {
  const { data } = await api.post(`/contact/${id}/reply`, { message });
  return data;
};

export const deleteContactMessage = async (id) => {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
};
