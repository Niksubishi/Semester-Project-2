/**
 * Global error handling utilities
 */

import Logger from "./logger.js";

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  API: "api",
  VALIDATION: "validation",
  NETWORK: "network",
  AUTH: "auth",
  UNKNOWN: "unknown",
};

/**
 * API error class for structured error handling
 */
export class APIError extends Error {
  constructor(message, status, type = ErrorTypes.API, details = {}) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.type = type;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message, field = null, value = null) {
    super(message);
    this.name = "ValidationError";
    this.type = ErrorTypes.VALIDATION;
    this.field = field;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Global error handler class
 */
export class GlobalErrorHandler {
  static notifications = new Set();

  /**
   * Initialize global error handling
   */
  static init() {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      Logger.error("Unhandled promise rejection:", event.reason);
      this.showErrorNotification("Something went wrong. Please try again.");
      event.preventDefault();
    });

    // Handle JavaScript errors
    window.addEventListener("error", (event) => {
      Logger.error("JavaScript error:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
      this.showErrorNotification("A technical error occurred. Please refresh the page.");
    });

    // Handle fetch errors globally
    this.interceptFetch();
  }

  /**
   * Intercept fetch requests to handle errors consistently
   */
  static interceptFetch() {
    const originalFetch = window.fetch;

    window.fetch = async(...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          throw new APIError(
            errorData.message || "Request failed",
            response.status,
            this.getErrorType(response.status),
            errorData,
          );
        }

        return response;
      } catch (error) {
        if (error instanceof APIError) {
          throw error;
        }

        // Network or other errors
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          throw new APIError(
            "Network error. Please check your connection.",
            0,
            ErrorTypes.NETWORK,
          );
        }

        throw error;
      }
    };
  }

  /**
   * Parse error response from API
   */
  static async parseErrorResponse(response) {
    try {
      const data = await response.json();
      return data.errors?.[0] || data.error || { message: data.message || "Unknown error" };
    } catch {
      return { message: `HTTP ${response.status}: ${response.statusText}` };
    }
  }

  /**
   * Get error type based on status code
   */
  static getErrorType(status) {
    if (status === 401 || status === 403) {
      return ErrorTypes.AUTH;
    }
    if (status >= 400 && status < 500) {
      return ErrorTypes.VALIDATION;
    }
    if (status >= 500) {
      return ErrorTypes.API;
    }
    if (status === 0) {
      return ErrorTypes.NETWORK;
    }
    return ErrorTypes.UNKNOWN;
  }

  /**
   * Handle API errors with user-friendly messages
   */
  static handleAPIError(error, context = "") {
    Logger.apiError(context, error);

    let userMessage = "Something went wrong. Please try again.";

    if (error instanceof APIError) {
      switch (error.type) {
      case ErrorTypes.AUTH:
        userMessage = "Authentication required. Please login again.";
        // Redirect to login if needed
        if (error.status === 401) {
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/src/pages/login/";
          }, 2000);
        }
        break;
      case ErrorTypes.VALIDATION:
        userMessage = error.message || "Please check your input and try again.";
        break;
      case ErrorTypes.NETWORK:
        userMessage = "Connection error. Please check your internet and try again.";
        break;
      case ErrorTypes.API:
        userMessage = "Server error. Please try again later.";
        break;
      }
    }

    this.showErrorNotification(userMessage);
    return userMessage;
  }

  /**
   * Show error notification to user
   */
  static showErrorNotification(message, duration = 5000) {
    // Prevent duplicate notifications
    if (this.notifications.has(message)) {
      return;
    }

    this.notifications.add(message);

    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-full";
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        notification.remove();
        this.notifications.delete(message);
      }, 300);
    }, duration);
  }

  /**
   * Show success notification
   */
  static showSuccessNotification(message, duration = 3000) {
    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-full";
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /**
   * Handle form validation errors
   */
  static handleValidationErrors(errors, formElement) {
    // Clear previous errors
    const existingErrors = formElement.querySelectorAll(".error-message");
    existingErrors.forEach(error => error.remove());

    const existingErrorInputs = formElement.querySelectorAll(".error-input");
    existingErrorInputs.forEach(input => input.classList.remove("error-input"));

    // Display new errors
    errors.forEach(error => {
      if (error.field) {
        const input = formElement.querySelector(`[name="${error.field}"], #${error.field}`);
        if (input) {
          input.classList.add("error-input");

          const errorElement = document.createElement("div");
          errorElement.className = "error-message";
          errorElement.textContent = error.message;

          input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
      }
    });
  }

  /**
   * Create retry mechanism for failed operations
   */
  static async withRetry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }

        // Don't retry validation or auth errors
        if (error instanceof APIError &&
            (error.type === ErrorTypes.VALIDATION || error.type === ErrorTypes.AUTH)) {
          throw error;
        }

        Logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
}

// Initialize global error handling
if (typeof window !== "undefined") {
  GlobalErrorHandler.init();
}

export default GlobalErrorHandler;
