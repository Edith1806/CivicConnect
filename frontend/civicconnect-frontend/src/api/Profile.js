import api from "./axios";

export const fetchProfile = async () => {
  const res = await api.get("/citizens/me");
  return res.data;
};

export const updateProfile = async (profileData) => {
  const res = await api.put("/citizens/me", profileData);
  return res.data;
};
