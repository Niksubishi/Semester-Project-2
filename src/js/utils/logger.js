/**
 * Logger utility for development and production environments
 */

const isDevelopment = import.meta.env.DEV;

/**
 * Logger class for handling different log levels
 */
class Logger {
  /**
   * Log error messages
   * @param {string} message - Error message
   * @param {Error|Object} [error] - Error object or additional data
   */
  static error(message, error = null) {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, you might want to send errors to a logging service
    // this.sendToLoggingService('error', message, error);
  }

  /**
   * Log warning messages
   * @param {string} message - Warning message
   * @param {any} [data] - Additional data
   */
  static warn(message, data = null) {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  /**
   * Log info messages (development only)
   * @param {string} message - Info message
   * @param {any} [data] - Additional data
   */
  static info(message, data = null) {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
  }

  /**
   * Log debug messages (development only)
   * @param {string} message - Debug message
   * @param {any} [data] - Additional data
   */
  static debug(message, data = null) {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  /**
   * Handle API errors consistently
   * @param {string} operation - The operation that failed
   * @param {Error} error - The error object
   * @param {Object} [context] - Additional context
   */
  static apiError(operation, error, context = {}) {
    const message = `API Error during ${operation}: ${error.message}`;
    this.error(message, { error, context });

    // You could also show user-friendly error messages here
    this.showUserError(`Something went wrong while ${operation}. Please try again.`);
  }

  /**
   * Show user-friendly error messages
   * @param {string} message - User-friendly message
   */
  static showUserError(message) {
    // This could be replaced with a toast notification system
    if (isDevelopment) {
      alert(message);
    }
  }

  /**
   * Send errors to external logging service (placeholder)
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {any} data - Additional data
   */
  // static sendToLoggingService(level, message, data) {
  //   // Implementation for external logging service like Sentry, LogRocket, etc.
  // }
}

export default Logger;
