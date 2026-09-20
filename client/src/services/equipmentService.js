import api from "./api.js";

export const fetchEquipment = async () => {
  const { data } = await api.get("/equipment");
  return data;
};

// payload.image may be a pasted URL (string) or an uploaded File — the admin
// form only ever sends one or the other (see EquipmentManage.jsx).
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  return form;
};

export const createEquipment = async (payload) => {
  const { data } = await api.post("/equipment", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateEquipment = async (id, payload) => {
  const { data } = await api.put(`/equipment/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteEquipment = async (id) => {
  const { data } = await api.delete(`/equipment/${id}`);
  return data;
};
