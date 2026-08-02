import api from "./api.js";

export const fetchServices = async (params = {}) => {
  const { data } = await api.get("/services", { params });
  return data;
};

export const fetchServiceBySlug = async (slug) => {
  const { data } = await api.get(`/services/${slug}`);
  return data;
};

export const createService = async (payload) => {
  const { data } = await api.post("/services", payload);
  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await api.put(`/services/${id}`, payload);
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};
