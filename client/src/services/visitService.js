import api from "./api.js";

export const recordVisit = (path) => api.post("/visits", { path }).catch(() => {});

export const fetchVisitStats = async () => {
  const { data } = await api.get("/visits/stats");
  return data;
};
