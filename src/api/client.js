import axios from "axios";
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

/** Shared axios instance — auth + error normalization applied via interceptors. */
export const http = axios.create({
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  if (config.auth !== false) {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    // Drop default JSON content-type so the browser sets multipart boundary.
    if (typeof config.headers?.delete === "function") {
      config.headers.delete("Content-Type");
    } else if (config.headers) {
      delete config.headers["Content-Type"];
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status, data } = error.response;
      return Promise.reject(
        new ApiError(resolveErrorMessage(data, status), status, data),
      );
    }

    if (error.request) {
      return Promise.reject(
        new ApiError(
          "Unable to reach the server. Check your connection and try again.",
        ),
      );
    }

    return Promise.reject(error);
  },
);

/**
 * Thin wrapper kept for backward compatibility with resource factories.
 * Supports JSON, FormData, and URLSearchParams bodies.
 */
export const request = async (
  path,
  {
    method = "GET",
    body,
    auth = true,
    headers,
    baseUrl = API_BASE_URL,
    params,
    signal,
  } = {},
) => {
  const isFormData = body instanceof FormData;
  const isUrlEncoded = body instanceof URLSearchParams;

  const config = {
    method,
    url: path,
    baseURL: baseUrl,
    auth,
    headers: { ...headers },
  };

  if (params !== undefined) config.params = params;
  if (signal) config.signal = signal;

  if (body !== undefined) config.data = body;

  if (isFormData) {
    // Let axios set the multipart boundary automatically.
    delete config.headers["Content-Type"];
  } else if (isUrlEncoded) {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
  }

  const response = await http.request(config);
  return response.data;
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    request(path, { ...options, method: "POST", body }),
  put: (path, body, options) =>
    request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) =>
    request(path, { ...options, method: "PATCH", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
