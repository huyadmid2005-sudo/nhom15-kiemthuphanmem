import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";

export const axiosInstanceUserService = axios.create({
  baseURL: `${API_URLS.USER_SERVICE}/users`,
  timeout: 7000,
});

axiosInstanceUserService.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");

  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

export default axiosInstanceUserService;
