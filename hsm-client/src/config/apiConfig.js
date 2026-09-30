// API Configuration for different environments

const API_CONFIG = {
  development: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL_DEV || "http://localhost",
    PORTS: {
      USER_SERVICE: 8090,
      PATIENT_SERVICE: 8090,
      DOCTOR_SERVICE: 8090,
      ROOM_SERVICE: 8090,
      APPOINTMENT_SERVICE: 8090,
      NOTIFICATION_SERVICE: 8090,
      INVENTORY_SERVICE: 8090,
      COMMUNITY_PORTAL_SERVICE: 8090,
      ANALYTIC_RESEARCH_SERVICE: 8090,
      CDSS_SERVICE: 8090,
      CHATBOT_SERVICE: 8090,
    },
  },
  production: {
    BASE_URL: "https://", // Using HTTPS for production domains
    SERVICES: {
      USER_SERVICE: "api-gateway.whodev.top",
      PATIENT_SERVICE: "api-gateway.whodev.top",
      DOCTOR_SERVICE: "api-gateway.whodev.top",
      ROOM_SERVICE: "api-gateway.whodev.top", // Same as doctor service
      APPOINTMENT_SERVICE: "api-gateway.whodev.top", // Same as doctor service
      NOTIFICATION_SERVICE: "api-gateway.whodev.top",
      INVENTORY_SERVICE: "api-gateway.whodev.top",
      COMMUNITY_PORTAL_SERVICE: "api-gateway.whodev.top",
      ANALYTIC_RESEARCH_SERVICE: "api-gateway.whodev.top",
      CDSS_SERVICE: "api-gateway.whodev.top",
      CHATBOT_SERVICE: "api-gateway.whodev.top",
    },
  },
};

// Determine current environment
const getCurrentEnvironment = () => {
  // Check for forced environment from .env file
  if (import.meta.env.VITE_FORCE_ENV) {
    return import.meta.env.VITE_FORCE_ENV;
  }

  // Check for explicit environment setting
  if (import.meta.env.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV;
  }

  // Check if running in development mode using Vite's environment variables
  if (import.meta.env.DEV) {
    return "development";
  }

  // Default to production
  return "production";
};

const currentEnv = getCurrentEnvironment();
const config = API_CONFIG[currentEnv];

// Export API URLs
export const API_URLS = {
  USER_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.USER_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.USER_SERVICE}`,
  PATIENT_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.PATIENT_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.PATIENT_SERVICE}`,
  DOCTOR_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.DOCTOR_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.DOCTOR_SERVICE}`,
  ROOM_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.ROOM_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.ROOM_SERVICE}`,
  APPOINTMENT_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.APPOINTMENT_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.APPOINTMENT_SERVICE}`,
  NOTIFICATION_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.NOTIFICATION_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.NOTIFICATION_SERVICE}`,
  INVENTORY_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.INVENTORY_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.INVENTORY_SERVICE}`,
  COMMUNITY_PORTAL_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.COMMUNITY_PORTAL_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.COMMUNITY_PORTAL_SERVICE}`,
  ANALYTIC_RESEARCH_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.ANALYTIC_RESEARCH_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.ANALYTIC_RESEARCH_SERVICE}`,
  CDSS_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.CDSS_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.CDSS_SERVICE}`,
  CHATBOT_SERVICE:
    currentEnv === "production"
      ? `${config.BASE_URL}${config.SERVICES.CHATBOT_SERVICE}`
      : `${config.BASE_URL}:${config.PORTS.CHATBOT_SERVICE}`,
};

// Export current environment info
export const CURRENT_ENV = currentEnv;
export const IS_DEVELOPMENT = currentEnv === "development";
export const IS_PRODUCTION = currentEnv === "production";

// Console log current configuration (for debugging)
console.log(`🚀 API Config loaded for: ${currentEnv.toUpperCase()}`);
if (currentEnv === "production") {
  console.log(`📡 Using production domains (HTTPS)`);
  console.log(`🌐 Example: ${API_URLS.COMMUNITY_PORTAL_SERVICE}`);
} else {
  console.log(`📡 Base URL: ${config.BASE_URL}`);
  console.log(`🌐 Example: ${API_URLS.COMMUNITY_PORTAL_SERVICE}`);
}

export default API_URLS;
