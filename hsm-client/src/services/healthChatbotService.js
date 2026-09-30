import { API_URLS } from "../config/apiConfig.js";
import { getAuthorizationHeader } from "../utils/authToken.js";

const CHATBOT_ENDPOINT = `${API_URLS.CHATBOT_SERVICE}/chatbot/ask`;

export const askHealthChatbot = async (question, { includeAuth = true } = {}) => {
  const formData = new FormData();
  formData.append("question", question);

  const headers = {};
  if (includeAuth) {
    const authorizationHeader = getAuthorizationHeader();
    if (!authorizationHeader) {
      throw new Error("Vui lòng đăng nhập để sử dụng trợ lý sức khỏe.");
    }

    headers.Authorization = authorizationHeader;

    const patientId = localStorage.getItem("patientId");
    if (patientId) {
      headers["Patient-Id"] = patientId;
    }
  }

  const response = await fetch(CHATBOT_ENDPOINT, {
    method: "POST",
    headers,
    body: formData,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Không thể đọc phản hồi từ trợ lý AI.");
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error?.message || "Trợ lý AI không phản hồi.");
  }

  if (!payload?.ok || !payload?.data) {
    throw new Error(payload?.error?.message || "Trợ lý AI không thể trả lời câu hỏi này.");
  }

  return payload.data;
};

export default askHealthChatbot;
