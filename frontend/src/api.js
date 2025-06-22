import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const fetchTodayLog = async () => {
  const res = await axios.get(`${API_BASE}/logs/today`);
  return res.data;
};

export const fetchAllLogs = async () => {
  const res = await axios.get(`${API_BASE}/logs`);
  return res.data;
};

export const uploadVideo = async (formData) => {
  const res = await axios.post(`${API_BASE}/process_video_upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
