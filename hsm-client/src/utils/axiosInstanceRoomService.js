import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceRoomService = axios.create({
  baseURL: `${API_URLS.ROOM_SERVICE}/rooms`,
  timeout: 7000,
});

axiosInstanceRoomService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceRoomService;
