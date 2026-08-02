import api from "./api.js";

export const fetchTestimonials = async (params = {}) => {
  const { data } = await api.get("/testimonials", { params });
  return data;
};

export const createTestimonial = async (payload) => {
  const { data } = await api.post("/testimonials", payload);
  return data;
};

export const updateTestimonial = async (id, payload) => {
  const { data } = await api.put(`/testimonials/${id}`, payload);
  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};
