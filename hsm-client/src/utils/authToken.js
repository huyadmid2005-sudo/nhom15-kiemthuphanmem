export const getAuthorizationHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const normalizedToken = token.startsWith("Bearer ")
    ? token.slice("Bearer ".length)
    : token;

  return `Bearer ${normalizedToken}`;
};
