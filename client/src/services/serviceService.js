import api from "./api.js";

export const fetchServices = async (params = {}) => {
  const { data } = await api.get("/services", { params });
  return data;
};

export const fetchServiceBySlug = async (slug) => {
  const { data } = await api.get(`/services/${slug}`);
  return data;
};

// payload.heroImage may be a pasted URL (string) or an uploaded File — the
// admin form only ever sends one or the other (see ServicesManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const createService = async (payload) => {
  const { data } = await api.post("/services", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateService = async (id, payload) => {
  const { data } = await api.put(`/services/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteService = async (id) => {
  const { data } = await api.delete(`/services/${id}`);
  return data;
};
