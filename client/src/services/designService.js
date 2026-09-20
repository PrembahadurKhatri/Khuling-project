import api from "./api.js";

export const fetchDesigns = async () => {
  const { data } = await api.get("/designs");
  return data;
};

export const fetchDesignBySlug = async (slug) => {
  const { data } = await api.get(`/designs/${slug}`);
  return data;
};

// payload.existingImages/imageFiles: the photo list, split between kept
// URLs and newly picked Files. payload.videos: pasted video URLs (no
// upload). payload.existingDpr/dprFile: the DPR document, URL-or-file like
// ImageSourceField. See DesignManage.jsx.
const toFormData = ({ existingImages, imageFiles, videos, existingDpr, dprFile, ...rest }) => {
  const form = new FormData();
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  form.append("existingImages", JSON.stringify(existingImages || []));
  (imageFiles || []).forEach((file) => form.append("images", file));
  form.append("videos", JSON.stringify((videos || []).filter(Boolean)));
  if (dprFile) {
    form.append("dpr", dprFile);
  } else if (existingDpr) {
    form.append("existingDpr", existingDpr);
  }
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
