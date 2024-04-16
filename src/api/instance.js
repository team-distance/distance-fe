import axios from "axios";
import { baseURL } from "../constants/baseURL";
import { refresh } from "../store/auth";

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 && message === "만료된 JWT 토큰입니다!") {
      await refresh({
        refreshToken: localStorage.getItem("refreshToken"),
      }).catch((error) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      });

      const accessToken = localStorage.getItem("accessToken");
      error.config.headers.Authorization = `Bearer ${accessToken}`;
      return instance(error.config);
    }
    return Promise.reject(error);
  }
);
