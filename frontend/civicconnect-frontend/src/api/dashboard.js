import api from "./axios";

export const fetchMyIssues = async () => {
  const res = await api.get("/issues/my");
  return res.data;
};
