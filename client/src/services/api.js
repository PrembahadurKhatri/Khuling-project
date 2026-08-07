import axios from "axios";
/*
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send httpOnly cookies (refreshToken)
});
*/
const API = import.meta.env.VITE_API_TARGET;

const api = axios.create({
  baseURL: `${API}/api`,   // 🔥 FIX
  withCredentials: true,
});
let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Automatically refresh the access token once on a 401, then retry the request.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh") {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
