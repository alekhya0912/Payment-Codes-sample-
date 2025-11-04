export const API_BASE_URL = "http://localhost:8080";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Session expired or invalid token");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return response;
}

export async function getCurrentUser() {
  const response = await apiFetch("/api/auth/current-user", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}
