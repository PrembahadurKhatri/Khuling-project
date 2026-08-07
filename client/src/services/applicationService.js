import api from "./api.js";

export const submitGeneralApplication = async (formData) => {
  const { data } = await api.post("/applications/general", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchApplications = async (params = {}) => {
  const { data } = await api.get("/applications", { params });
  return data;
};

export const updateApplicationStatus = async (id, payload) => {
  const { data } = await api.put(`/applications/${id}`, payload);
  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await api.delete(`/applications/${id}`);
  return data;
};
