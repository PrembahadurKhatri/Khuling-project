import api from "./api.js";

export const fetchDesigns = async () => {
  const { data } = await api.get("/designs");
  return data;
};

// payload.existingImages is the list of image URLs to keep (already-saved
// or pasted directly); payload.imageFiles is newly selected Files to
// upload alongside them — see DesignManage.jsx. The two merge server-side
// (designController.js) into the final `images` array, capped at 10.
const toFormData = ({ existingImages, imageFiles, ...rest }) => {
  const form = new FormData();
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  form.append("existingImages", JSON.stringify(existingImages || []));
  (imageFiles || []).forEach((file) => form.append("images", file));
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
