import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";

const parseJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      "The server returned an invalid response. Please make sure the backend is running.",
    );
  }
};

export const useApi = () => {
  const { token } = useAuth();

  const request = async (
    endpoint,
    method = "GET",
    data = null,
    requiresAuth = false,
  ) => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (requiresAuth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const payload = await parseJsonResponse(response);

      if (!response.ok) {
        throw new Error(payload?.message || "API request failed");
      }

      return payload;
    } catch (error) {
      throw error;
    }
  };

  return {
    get: (endpoint, requiresAuth = false) =>
      request(endpoint, "GET", null, requiresAuth),
    post: (endpoint, data, requiresAuth = false) =>
      request(endpoint, "POST", data, requiresAuth),
    put: (endpoint, data, requiresAuth = false) =>
      request(endpoint, "PUT", data, requiresAuth),
    delete: (endpoint, requiresAuth = false) =>
      request(endpoint, "DELETE", null, requiresAuth),
  };
};

// Non-hook version for authentication endpoints
export const apiCall = async (
  endpoint,
  method = "GET",
  data = null,
  token = null,
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const payload = await parseJsonResponse(response);

    if (!response.ok) {
      throw new Error(payload?.message || "API request failed");
    }

    return payload;
  } catch (error) {
    throw error;
  }
};
