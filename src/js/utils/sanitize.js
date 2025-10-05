/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeHTML(input) {
  if (typeof input !== "string") {
    return "";
  }

  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes and validates form input
 * @param {string} input - The input to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and sanitizedValue
 */
export function validateAndSanitizeInput(input, options = {}) {
  const {
    required = false,
    minLength = 0,
    maxLength = Infinity,
    pattern = null,
    type = "text",
  } = options;

  const result = {
    isValid: true,
    errors: [],
    sanitizedValue: "",
  };

  // Check if required
  if (required && (!input || input.trim().length === 0)) {
    result.isValid = false;
    result.errors.push("This field is required");
    return result;
  }

  // Sanitize the input
  const sanitized = sanitizeHTML(input.trim());
  result.sanitizedValue = sanitized;

  // Length validation
  if (sanitized.length < minLength) {
    result.isValid = false;
    result.errors.push(`Minimum length is ${minLength} characters`);
  }

  if (sanitized.length > maxLength) {
    result.isValid = false;
    result.errors.push(`Maximum length is ${maxLength} characters`);
  }

  // Pattern validation
  if (pattern && !pattern.test(sanitized)) {
    result.isValid = false;
    result.errors.push("Invalid format");
  }

  // Type-specific validation
  if (type === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sanitized)) {
      result.isValid = false;
      result.errors.push("Please enter a valid email address");
    }
  }

  if (type === "number") {
    if (isNaN(sanitized) || sanitized === "") {
      result.isValid = false;
      result.errors.push("Please enter a valid number");
    }
  }

  return result;
}

/**
 * Creates a safe HTML string for display
 * @param {string} content - Content to make safe
 * @returns {string} - Safe HTML string
 */
export function createSafeHTML(content) {
  return sanitizeHTML(content);
}
