import api from "./api.js";

export const fetchDesigns = async () => {
  const { data } = await api.get("/designs");
  return data;
};

export const fetchDesignBySlug = async (slug) => {
  const { data } = await api.get(`/designs/${slug}`);
  return data;
};

// payload shape (see DesignManage.jsx):
//   existingImages / imageFiles     — gallery photos, kept URLs + new files
//   existingThumbnail / thumbnailFile — card cover photo, URL-or-file
//   existingDpr / dprFile           — DPR document, URL-or-file
//   videos: [{ existingUrl, urlFile, existingThumbnail, thumbFile }]
//     — each entry's video is either a kept/pasted URL or an uploaded file,
//     same for its thumbnail. Turned into one `videosMeta` JSON array (flags
//     + kept URLs) plus two flat file arrays, in videosMeta order — merged
//     back into { url, thumbnail } pairs server-side (designController.js).
const toFormData = ({ existingImages, imageFiles, existingThumbnail, thumbnailFile, existingDpr, dprFile, videos, ...rest }) => {
  const form = new FormData();
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });

  form.append("existingImages", JSON.stringify(existingImages || []));
  (imageFiles || []).forEach((file) => form.append("images", file));

  if (thumbnailFile) {
    form.append("thumbnail", thumbnailFile);
  } else if (existingThumbnail) {
    form.append("existingThumbnail", existingThumbnail);
  }

  if (dprFile) {
    form.append("dpr", dprFile);
  } else if (existingDpr) {
    form.append("existingDpr", existingDpr);
  }

  const validVideos = (videos || []).filter((v) => v.urlFile || v.existingUrl);
  const meta = validVideos.map((v) => ({
    urlIsFile: Boolean(v.urlFile),
    url: v.urlFile ? undefined : v.existingUrl,
    thumbIsFile: Boolean(v.thumbFile),
    thumbnail: v.thumbFile ? undefined : v.existingThumbnail || undefined,
  }));
  form.append("videosMeta", JSON.stringify(meta));
  validVideos.forEach((v) => {
    if (v.urlFile) form.append("videoFiles", v.urlFile);
  });
  validVideos.forEach((v) => {
    if (v.thumbFile) form.append("videoThumbFiles", v.thumbFile);
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
