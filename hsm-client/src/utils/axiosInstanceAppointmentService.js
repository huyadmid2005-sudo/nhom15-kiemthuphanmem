import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceAppointmentService = axios.create({
  baseURL: `${API_URLS.APPOINTMENT_SERVICE}/appointments`,
  timeout: 7000,
});

axiosInstanceAppointmentService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceAppointmentService;
