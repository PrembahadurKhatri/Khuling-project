import api from "./api.js";

export const fetchProjects = async (params = {}) => {
  const { data } = await api.get("/projects", { params });
  return data;
};

export const fetchProjectBySlug = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`);
  return data;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};
