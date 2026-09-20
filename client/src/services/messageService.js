import api from "./api.js";

export const fetchMessages = async () => {
  const { data } = await api.get("/messages");
  return data;
};

// payload.photo may be a pasted URL (string) or an uploaded File — the admin
// form only ever sends one or the other (see MessagesManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const createMessage = async (payload) => {
  const { data } = await api.post("/messages", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateMessage = async (id, payload) => {
  const { data } = await api.put(`/messages/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await api.delete(`/messages/${id}`);
  return data;
};
