import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

export const axiosInstanceCommunityPortalService = axios.create({
  baseURL: `${API_URLS.COMMUNITY_PORTAL_SERVICE}/community-portal`,
  timeout: 7000,
});

axiosInstanceCommunityPortalService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceCommunityPortalService;
