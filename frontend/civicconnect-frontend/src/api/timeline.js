import api from "./axios";

export const fetchIssueTimeline = async (issueId) => {
  const res = await api.get(`/issues/${issueId}/timeline`);
  return res.data;
};
