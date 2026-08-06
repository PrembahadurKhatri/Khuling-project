import api from "./api.js";

export const fetchProjects = async (params = {}) => {
  const { data } = await api.get("/projects", { params });
  return data;
};

export const fetchProjectBySlug = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`);
  return data;
};

// payload.thumbnail may be a pasted URL (string) or an uploaded File — the
// admin form only ever sends one or the other (see ProjectsManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};
