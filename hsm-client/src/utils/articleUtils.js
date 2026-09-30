export const CATEGORY_LABELS = {
  DISEASE: "Disease",
  NUTRITION: "Nutrition",
  PREVENTION: "Prevention",
  GENERAL_HEALTH: "General Health",
  MENTAL_HEALTH: "Mental Health",
};

export const CATEGORIES = [
  { value: "DISEASE", label: CATEGORY_LABELS.DISEASE },
  { value: "NUTRITION", label: CATEGORY_LABELS.NUTRITION },
  { value: "PREVENTION", label: CATEGORY_LABELS.PREVENTION },
  { value: "GENERAL_HEALTH", label: CATEGORY_LABELS.GENERAL_HEALTH },
  { value: "MENTAL_HEALTH", label: CATEGORY_LABELS.MENTAL_HEALTH },
];

export const THUMBNAIL_URL_PATTERN = /^(https?:\/\/|data:image\/)/i;

export const getArticleExcerpt = (markdown, maxLength = 150) => {
  if (!markdown) return "";

  const plainText = markdown
    .replace(/\r/g, "")
    .replace(/!\[[^\]]*]\(([^)]+)\)/g, " ")
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";
  if (plainText.length <= maxLength) return plainText;

  return `${plainText.slice(0, maxLength).trim()}...`;
};

export const getActorTypeLabel = (actorType) => {
  if (actorType === "DOCTOR") return "Doctor";
  return "Patient";
};
