import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstancePatientService = axios.create({
  baseURL: `${API_URLS.PATIENT_SERVICE}/patients`,
  timeout: 1000,
});

axiosInstancePatientService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstancePatientService;
