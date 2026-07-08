import { API_BASE_URL } from "../lib/constants";
import { getToken } from "../lib/storage";

export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const resolveErrorMessage = (data, status) => {
  const detail = data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 422) return "Please check the details and try again.";
  return "Something went wrong. Please try again.";
};

/**
 * Core request helper. Handles base URL, JSON (de)serialization,
 * bearer-token injection and normalized error handling.
 */
export const request = async (
  path,
  { method = "GET", body, auth = true, headers } = {},
) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json", ...headers },
  };

  if (auth) {
    const token = getToken();
    if (token) options.headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      resolveErrorMessage(data, response.status),
      response.status,
      data,
    );
  }

  return data;
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
