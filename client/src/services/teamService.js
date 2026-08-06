import api from "./api.js";

export const fetchTeam = async () => {
  const { data } = await api.get("/team");
  return data;
};

// payload.image may be a pasted URL (string) or an uploaded File — the admin
// form only ever sends one or the other (see TeamManage.jsx). payload.social
// is flattened to social.linkedin / social.twitter / social.email keys,
// which teamController.js re-nests server-side.
const toFormData = (payload) => {
  const { social, ...rest } = payload;
  const form = new FormData();
  Object.entries(rest).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value);
  });
  Object.entries(social || {}).forEach(([key, value]) => {
    form.append(`social.${key}`, value || "");
  });
  return form;
};

export const createTeamMember = async (payload) => {
  const { data } = await api.post("/team", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateTeamMember = async (id, payload) => {
  const { data } = await api.put(`/team/${id}`, toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteTeamMember = async (id) => {
  const { data } = await api.delete(`/team/${id}`);
  return data;
};
