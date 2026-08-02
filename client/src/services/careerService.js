import api from "./api.js";

export const fetchCareers = async (params = {}) => {
  const { data } = await api.get("/careers", { params });
  return data;
};

export const fetchCareerBySlug = async (slug) => {
  const { data } = await api.get(`/careers/${slug}`);
  return data;
};

export const createCareer = async (payload) => {
  const { data } = await api.post("/careers", payload);
  return data;
};

export const updateCareer = async (id, payload) => {
  const { data } = await api.put(`/careers/${id}`, payload);
  return data;
};

export const deleteCareer = async (id) => {
  const { data } = await api.delete(`/careers/${id}`);
  return data;
};

export const applyToCareer = async (id, formData) => {
  const { data } = await api.post(`/careers/${id}/apply`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
