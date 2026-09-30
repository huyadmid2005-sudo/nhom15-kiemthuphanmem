import axios from "axios";
import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "./authToken.js";

const axiosInstanceAnalyticResearchService = axios.create({
  baseURL: `${API_URLS.ANALYTIC_RESEARCH_SERVICE}/research`,
  timeout: 10000,
});

axiosInstanceAnalyticResearchService.interceptors.request.use((config) => {
  const authorizationHeader = getAuthorizationHeader();

  if (authorizationHeader) {
    config.headers.Authorization = authorizationHeader;
  }

  return config;
});

export default axiosInstanceAnalyticResearchService;
