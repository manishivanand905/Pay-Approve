const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = trimTrailingSlash(process.env.REACT_APP_API_URL || "");

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== "undefined") {
    const { origin, hostname } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }

    console.warn(
      "REACT_APP_API_URL is not set. Falling back to same-origin /api. Configure the live API URL in Vercel for production."
    );

    return `${trimTrailingSlash(origin)}/api`;
  }

  return "http://localhost:5000/api";
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiRequest = async (path, options = {}) => {
  const { method = "GET", body, token } = options;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
