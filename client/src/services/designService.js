import api from "./api.js";

export const fetchDesigns = async () => {
  const { data } = await api.get("/designs");
  return data;
};

// payload.image may be a pasted URL (string) or an uploaded File — the admin
// form only ever sends one or the other (see DesignManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const createDesign = async (payload) => {
  const { data } = await api.post("/designs", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateDesign = async (id, payload) => {
  const { data } = await api.put(`/designs/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteDesign = async (id) => {
  const { data } = await api.delete(`/designs/${id}`);
  return data;
};
