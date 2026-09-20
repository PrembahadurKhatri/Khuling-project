import api from "./api.js";

export const fetchMdMessage = async () => {
  const { data } = await api.get("/md-message");
  return data;
};

// payload.photo may be a pasted URL (string) or an uploaded File — the admin
// form only ever sends one or the other (see MdMessageManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const updateMdMessage = async (payload) => {
  const { data } = await api.put("/md-message", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
