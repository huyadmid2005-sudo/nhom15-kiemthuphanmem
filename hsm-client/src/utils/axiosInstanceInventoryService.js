import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceInventoryService = axios.create({
  baseURL: `${API_URLS.INVENTORY_SERVICE}/pharmaceutical-inventory`,
  timeout: 7000,
});

axiosInstanceInventoryService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceInventoryService;
