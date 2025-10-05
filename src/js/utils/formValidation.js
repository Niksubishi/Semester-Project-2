/**
 * Enhanced form validation utilities
 */

import { validateAndSanitizeInput } from "./sanitize.js";
import { ValidationError, GlobalErrorHandler } from "./errorHandler.js";

/**
 * Validation rules for different field types
 */
export const ValidationRules = {
  email: {
    required: true,
    type: "email",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    message: "Password must be at least 8 characters with uppercase, lowercase, and number",
  },
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: "Title must be between 3 and 100 characters",
  },
  description: {
    maxLength: 500,
    message: "Description must be less than 500 characters",
  },
  url: {
    pattern: /^https?:\/\/.+\..+/,
    message: "Please enter a valid URL starting with http:// or https://",
  },
  number: {
    type: "number",
    min: 0,
    message: "Please enter a valid positive number",
  },
};

/**
 * Enhanced form validator class
 */
export class FormValidator {
  constructor(formElement, customRules = {}) {
    this.form = formElement;
    this.rules = { ...ValidationRules, ...customRules };
    this.errors = [];
    this.isValid = true;

    this.init();
  }

  /**
   * Initialize form validation
   */
  init() {
    if (!this.form) {
      return;
    }

    // Add real-time validation
    this.form.addEventListener("input", this.handleInput.bind(this));
    this.form.addEventListener("blur", this.handleBlur.bind(this), true);
    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    // Add visual feedback classes
    this.form.classList.add("validated-form");
  }

  /**
   * Handle input events for real-time validation
   */
  handleInput(event) {
    const field = event.target;
    if (this.shouldValidateField(field)) {
      this.validateField(field, false);
    }
  }

  /**
   * Handle blur events for field validation
   */
  handleBlur(event) {
    const field = event.target;
    if (this.shouldValidateField(field)) {
      this.validateField(field, true);
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      this.form.dispatchEvent(new CustomEvent("validSubmit", {
        detail: { formData: new FormData(this.form), validator: this },
      }));
    } else {
      GlobalErrorHandler.handleValidationErrors(this.errors, this.form);
      this.focusFirstError();
    }
  }

  /**
   * Check if field should be validated
   */
  shouldValidateField(field) {
    return field.name && (field.type !== "submit" && field.type !== "button");
  }

  /**
   * Validate a single field
   */
  validateField(field, showErrors = true) {
    const fieldName = field.name || field.id;
    const rule = this.rules[fieldName];

    if (!rule) {
      // No specific rule, use basic validation
      return this.basicFieldValidation(field, showErrors);
    }

    const result = validateAndSanitizeInput(field.value, rule);

    if (showErrors) {
      this.clearFieldErrors(field);

      if (result.isValid) {
        this.markFieldAsValid(field);
      } else {
        this.markFieldAsInvalid(field, result.errors);
      }
    }

    return result.isValid;
  }

  /**
   * Basic field validation for fields without specific rules
   */
  basicFieldValidation(field, showErrors = true) {
    const isRequired = field.hasAttribute("required");
    const isEmpty = !field.value.trim();

    if (isRequired && isEmpty) {
      if (showErrors) {
        this.markFieldAsInvalid(field, ["This field is required"]);
      }
      return false;
    }

    if (showErrors && !isEmpty) {
      this.markFieldAsValid(field);
    }

    return true;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    this.errors = [];
    this.isValid = true;

    const fields = this.form.querySelectorAll("input, textarea, select");

    fields.forEach(field => {
      if (this.shouldValidateField(field)) {
        const isFieldValid = this.validateField(field, false);

        if (!isFieldValid) {
          this.isValid = false;
          const fieldName = field.name || field.id;
          const rule = this.rules[fieldName];

          this.errors.push(new ValidationError(
            rule?.message || "Invalid input",
            fieldName,
            field.value,
          ));
        }
      }
    });

    return this.isValid;
  }

  /**
   * Clear all field errors
   */
  clearFieldErrors(field) {
    field.classList.remove("error-input", "success-input");

    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }
  }

  /**
   * Mark field as valid
   */
  markFieldAsValid(field) {
    field.classList.remove("error-input");
    field.classList.add("success-input");
  }

  /**
   * Mark field as invalid
   */
  markFieldAsInvalid(field, errors) {
    field.classList.remove("success-input");
    field.classList.add("error-input");

    if (errors.length > 0) {
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";
      errorElement.textContent = errors[0]; // Show first error

      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  }

  /**
   * Focus on first field with error
   */
  focusFirstError() {
    const firstErrorField = this.form.querySelector(".error-input");
    if (firstErrorField) {
      firstErrorField.focus();
    }
  }

  /**
   * Get form data as object
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      // Sanitize the value
      const rule = this.rules[key];
      if (rule) {
        const result = validateAndSanitizeInput(value, rule);
        data[key] = result.sanitizedValue;
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  /**
   * Reset form validation state
   */
  reset() {
    this.errors = [];
    this.isValid = true;

    const fields = this.form.querySelectorAll(".error-input, .success-input");
    fields.forEach(field => {
      field.classList.remove("error-input", "success-input");
    });

    const errorMessages = this.form.querySelectorAll(".error-message");
    errorMessages.forEach(error => error.remove());
  }

  /**
   * Add custom validation rule
   */
  addRule(fieldName, rule) {
    this.rules[fieldName] = rule;
  }

  /**
   * Remove validation rule
   */
  removeRule(fieldName) {
    delete this.rules[fieldName];
  }
}

/**
 * Initialize form validation for all forms on the page
 */
export function initFormValidation() {
  const forms = document.querySelectorAll("form[data-validate]");

  forms.forEach(form => {
    new FormValidator(form);
  });
}

/**
 * Create enhanced form field with validation
 */
export function createValidatedField(options) {
  const {
    type = "text",
    name,
    label,
    placeholder = "",
    required = false,
    rule = null,
    className = "",
    value = "",
  } = options;

  const fieldContainer = document.createElement("div");
  fieldContainer.className = "form-field mb-4";

  const labelElement = document.createElement("label");
  labelElement.className = "block text-sm font-medium text-gray-700 mb-2";
  labelElement.textContent = label;
  labelElement.setAttribute("for", name);

  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  input.type = type === "textarea" ? undefined : type;
  input.name = name;
  input.id = name;
  input.placeholder = placeholder;
  input.value = value;
  input.className = `w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-text focus:ring-offset-2 ${className}`;

  if (required) {
    input.setAttribute("required", "");
    labelElement.innerHTML += " <span class=\"text-red-500\">*</span>";
  }

  fieldContainer.appendChild(labelElement);
  fieldContainer.appendChild(input);

  return { container: fieldContainer, input, label: labelElement };
}

export default FormValidator;
