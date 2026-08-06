import api from "./api.js";

export const fetchGallery = async (params = {}) => {
  const { data } = await api.get("/gallery", { params });
  return data;
};

// payload.image may be a File (new upload) or omitted (keep existing on update)
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      form.append("image", value);
    } else if (key !== "image" && value !== undefined && value !== null) {
      form.append(key, value);
    }
  });
  return form;
};

export const createGalleryImage = async (payload) => {
  const { data } = await api.post("/gallery", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateGalleryImage = async (id, payload) => {
  const { data } = await api.put(`/gallery/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteGalleryImage = async (id) => {
  const { data } = await api.delete(`/gallery/${id}`);
  return data;
};
