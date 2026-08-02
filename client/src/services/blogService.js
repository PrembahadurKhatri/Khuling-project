import api from "./api.js";

export const fetchBlogs = async (params = {}) => {
  const { data } = await api.get("/blogs", { params });
  return data;
};

export const fetchBlogBySlug = async (slug) => {
  const { data } = await api.get(`/blogs/${slug}`);
  return data;
};

// payload.featuredImage may be a File (new upload) or omitted (keep existing on update)
const toFormData = (payload) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (key === "featuredImage" && value instanceof File) {
      form.append("featuredImage", value);
    } else if (key !== "featuredImage" && value !== undefined && value !== null) {
      form.append(key, value);
    }
  });
  return form;
};

export const createBlog = async (payload) => {
  const { data } = await api.post("/blogs", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateBlog = async (id, payload) => {
  const { data } = await api.put(`/blogs/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteBlog = async (id) => {
  const { data } = await api.delete(`/blogs/${id}`);
  return data;
};
