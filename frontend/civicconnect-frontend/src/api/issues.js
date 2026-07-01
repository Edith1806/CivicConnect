import api from "./axios";

export const createIssue = async (data) => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (key === "images") {
      data.images.forEach(img =>
        formData.append("images", img)
      );
    } else {
      formData.append(key, data[key]);
    }
  });

  const res = await api.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return res.data;
};

export const fetchMyIssues = async () => {
  const res = await api.get("/issues/my");
  return res.data;
};

export const fetchCommunityIssues = async (latitude, longitude, radiusKm) => {
  const params = {};
  if (latitude !== undefined && latitude !== null) params.latitude = latitude;
  if (longitude !== undefined && longitude !== null) params.longitude = longitude;
  if (radiusKm !== undefined && radiusKm !== null) params.radiusKm = radiusKm;

  const res = await api.get("/issues/community", { params });
  return res.data;
};

export const upvoteIssue = async (id) => {
  const res = await api.post(`/issues/${id}/upvote`);
  return res.data;
};

export const downvoteIssue = async (id) => {
  const res = await api.delete(`/issues/${id}/upvote`);
  return res.data;
};