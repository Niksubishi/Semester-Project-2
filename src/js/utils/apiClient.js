/**
 * Enhanced API client with timeouts, retries, and caching
 */

import Logger from "./logger.js";
import { headers } from "../constants/headers.js";

/**
 * API Client with enhanced error handling and performance optimizations
 */
export class APIClient {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.defaultTimeout = 10000; // 10 seconds
    this.maxRetries = 3;
    this.retryDelay = 1000; // Start with 1 second
  }

  /**
   * Enhanced fetch with timeout, retries, and caching
   */
  async request(url, options = {}) {
    const {
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      cache = true,
      cacheTime = 5 * 60 * 1000, // 5 minutes default
      method = "GET",
      requiresAuth = false,
      ...fetchOptions
    } = options;

    // Create cache key
    const cacheKey = `${method}:${url}:${JSON.stringify(fetchOptions.body || {})}`;

    // Return cached response if available and fresh
    if (cache && method === "GET" && this.isCacheFresh(cacheKey, cacheTime)) {
      Logger.debug("Returning cached response for:", url);
      return this.cache.get(cacheKey).data;
    }

    // Prevent duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      Logger.debug("Returning pending request for:", url);
      return this.pendingRequests.get(cacheKey);
    }

    // Create the request promise
    const requestPromise = this.executeRequest(url, {
      ...fetchOptions,
      method,
      timeout,
      retries,
      requiresAuth,
    });

    // Store pending request
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;

      // Cache successful GET requests
      if (cache && method === "GET" && result) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      return result;
    } finally {
      // Clean up pending request
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Execute request with retries and timeout
   */
  async executeRequest(url, options) {
    const { timeout, retries, requiresAuth, ...fetchOptions } = options;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add authentication headers if required
        if (requiresAuth) {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authentication required but no token found");
          }
          fetchOptions.headers = {
            ...fetchOptions.headers,
            ...headers(token),
          };
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP ${response.status}`;

          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // Use default error message if JSON parsing fails
          }

          throw new APIError(errorMessage, response.status, url);
        }

        const data = await response.json();
        Logger.debug(`API request successful: ${url} (attempt ${attempt + 1})`);
        return data;

      } catch (error) {
        lastError = error;

        // Don't retry on authentication errors or client errors (4xx)
        if (error.name === "AbortError") {
          Logger.warn(`Request timeout: ${url} (attempt ${attempt + 1})`);
        } else if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          Logger.error(`Client error, not retrying: ${url}`, error);
          throw error;
        } else {
          Logger.warn(`API request failed: ${url} (attempt ${attempt + 1}/${retries + 1})`, error);
        }

        // Don't wait after the last attempt
        if (attempt < retries) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          Logger.debug(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    Logger.error(`All retries failed for: ${url}`, lastError);
    throw lastError;
  }

  /**
   * Check if cached data is fresh
   */
  isCacheFresh(cacheKey, maxAge) {
    const cached = this.cache.get(cacheKey);
    if (!cached) {
      return false;
    }
    return (Date.now() - cached.timestamp) < maxAge;
  }

  /**
   * Clear cache
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cached data
   */
  getCached(url, method = "GET", body = {}) {
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
    const cached = this.cache.get(cacheKey);
    return cached ? cached.data : null;
  }

  /**
   * Preload data
   */
  async preload(url, options = {}) {
    try {
      await this.request(url, { ...options, cache: true });
      Logger.debug("Preloaded:", url);
    } catch (error) {
      Logger.warn("Preload failed:", url, error);
    }
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status, url) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.url = url;
  }
}

// Create global API client instance
export const apiClient = new APIClient();

// Helper methods for common API patterns
export const api = {
  /**
   * GET request with caching
   */
  get: (url, options = {}) => apiClient.request(url, { method: "GET", ...options }),

  /**
   * POST request
   */
  post: (url, data, options = {}) => apiClient.request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: false,
    ...options,
  }),

  /**
   * PUT request
   */
  put: (url, data, options = {}) => apiClient.request(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: false,
    ...options,
  }),

  /**
   * DELETE request
   */
  delete: (url, options = {}) => apiClient.request(url, {
    method: "DELETE",
    cache: false,
    ...options,
  }),

  /**
   * Authenticated GET
   */
  authGet: (url, options = {}) => apiClient.request(url, {
    method: "GET",
    requiresAuth: true,
    ...options,
  }),

  /**
   * Authenticated POST
   */
  authPost: (url, data, options = {}) => apiClient.request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    requiresAuth: true,
    cache: false,
    ...options,
  }),
};
