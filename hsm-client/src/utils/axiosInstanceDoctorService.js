import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceDoctorService = axios.create({
  baseURL: `${API_URLS.DOCTOR_SERVICE}/doctors`,
  timeout: 7000,
});

axiosInstanceDoctorService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceDoctorService;
