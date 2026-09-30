import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceNotificationService = axios.create({
  baseURL: `${API_URLS.NOTIFICATION_SERVICE}/notifications`,
  timeout: 7000,
});

axiosInstanceNotificationService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceNotificationService;
