import axios from "axios";
import { baseURL } from "../constants/baseURL";

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
