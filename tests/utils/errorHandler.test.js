/**
 * Tests for error handler utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APIError, ValidationError, GlobalErrorHandler, ErrorTypes } from '../../src/js/utils/errorHandler.js';

describe('APIError', () => {
  it('should create APIError with correct properties', () => {
    const error = new APIError('Test error', 404, ErrorTypes.API, { detail: 'test' });

    expect(error.message).toBe('Test error');
    expect(error.status).toBe(404);
    expect(error.type).toBe(ErrorTypes.API);
    expect(error.details).toEqual({ detail: 'test' });
    expect(error.name).toBe('APIError');
    expect(error.timestamp).toBeDefined();
  });

  it('should use default values', () => {
    const error = new APIError('Test error', 500);

    expect(error.type).toBe(ErrorTypes.API);
    expect(error.details).toEqual({});
  });
});

describe('ValidationError', () => {
  it('should create ValidationError with correct properties', () => {
    const error = new ValidationError('Invalid input', 'email', 'invalid@');

    expect(error.message).toBe('Invalid input');
    expect(error.field).toBe('email');
    expect(error.value).toBe('invalid@');
    expect(error.type).toBe(ErrorTypes.VALIDATION);
    expect(error.name).toBe('ValidationError');
  });

  it('should work without field and value', () => {
    const error = new ValidationError('General validation error');

    expect(error.field).toBeNull();
    expect(error.value).toBeNull();
  });
});

describe('GlobalErrorHandler', () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = global.fetch;
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    // Clean up any notifications
    const notifications = document.querySelectorAll('[class*="fixed"]');
    notifications.forEach(notification => notification.remove());
  });

  describe('parseErrorResponse', () => {
    it('should parse JSON error response', async () => {
      const mockResponse = {
        json: vi.fn().mockResolvedValue({
          errors: [{ message: 'Validation failed' }]
        })
      };

      const result = await GlobalErrorHandler.parseErrorResponse(mockResponse);
      expect(result).toEqual({ message: 'Validation failed' });
    });

    it('should handle response without errors array', async () => {
      const mockResponse = {
        json: vi.fn().mockResolvedValue({
          error: { message: 'Server error' }
        })
      };

      const result = await GlobalErrorHandler.parseErrorResponse(mockResponse);
      expect(result).toEqual({ message: 'Server error' });
    });

    it('should handle JSON parse errors', async () => {
      const mockResponse = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        status: 500,
        statusText: 'Internal Server Error'
      };

      const result = await GlobalErrorHandler.parseErrorResponse(mockResponse);
      expect(result.message).toBe('HTTP 500: Internal Server Error');
    });
  });

  describe('getErrorType', () => {
    it('should classify auth errors correctly', () => {
      expect(GlobalErrorHandler.getErrorType(401)).toBe(ErrorTypes.AUTH);
      expect(GlobalErrorHandler.getErrorType(403)).toBe(ErrorTypes.AUTH);
    });

    it('should classify validation errors correctly', () => {
      expect(GlobalErrorHandler.getErrorType(400)).toBe(ErrorTypes.VALIDATION);
      expect(GlobalErrorHandler.getErrorType(422)).toBe(ErrorTypes.VALIDATION);
    });

    it('should classify server errors correctly', () => {
      expect(GlobalErrorHandler.getErrorType(500)).toBe(ErrorTypes.API);
      expect(GlobalErrorHandler.getErrorType(502)).toBe(ErrorTypes.API);
    });

    it('should classify network errors correctly', () => {
      expect(GlobalErrorHandler.getErrorType(0)).toBe(ErrorTypes.NETWORK);
    });

    it('should default to unknown for other status codes', () => {
      expect(GlobalErrorHandler.getErrorType(200)).toBe(ErrorTypes.UNKNOWN);
    });
  });

  describe('handleAPIError', () => {
    it('should handle auth errors with redirect', (done) => {
      const authError = new APIError('Unauthorized', 401, ErrorTypes.AUTH);

      // Mock setTimeout to test redirect behavior
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = vi.fn((callback, delay) => {
        expect(delay).toBe(2000);
        // Don't actually execute the callback in tests
        done();
      });

      GlobalErrorHandler.handleAPIError(authError, 'testing auth');

      global.setTimeout = originalSetTimeout;
    });

    it('should return appropriate user messages for different error types', () => {
      const networkError = new APIError('Network failed', 0, ErrorTypes.NETWORK);
      const validationError = new APIError('Invalid data', 400, ErrorTypes.VALIDATION);
      const serverError = new APIError('Server failed', 500, ErrorTypes.API);

      const networkMessage = GlobalErrorHandler.handleAPIError(networkError);
      const validationMessage = GlobalErrorHandler.handleAPIError(validationError);
      const serverMessage = GlobalErrorHandler.handleAPIError(serverError);

      expect(networkMessage).toContain('Connection error');
      expect(validationMessage).toBe('Invalid data');
      expect(serverMessage).toContain('Server error');
    });
  });

  describe('showErrorNotification', () => {
    it('should create error notification element', () => {
      GlobalErrorHandler.showErrorNotification('Test error message');

      const notification = document.querySelector('[class*="bg-red-500"]');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('Test error message');
    });

    it('should prevent duplicate notifications', () => {
      GlobalErrorHandler.showErrorNotification('Duplicate message');
      GlobalErrorHandler.showErrorNotification('Duplicate message');

      const notifications = document.querySelectorAll('[class*="bg-red-500"]');
      expect(notifications.length).toBe(1);
    });
  });

  describe('showSuccessNotification', () => {
    it('should create success notification element', () => {
      GlobalErrorHandler.showSuccessNotification('Success message');

      const notification = document.querySelector('[class*="bg-green-500"]');
      expect(notification).toBeTruthy();
      expect(notification.textContent).toContain('Success message');
    });
  });

  describe('handleValidationErrors', () => {
    it('should display validation errors on form fields', () => {
      document.body.innerHTML = `
        <form id="test-form">
          <input name="email" />
          <input name="password" />
        </form>
      `;

      const form = document.getElementById('test-form');
      const errors = [
        new ValidationError('Invalid email', 'email'),
        new ValidationError('Password too short', 'password')
      ];

      GlobalErrorHandler.handleValidationErrors(errors, form);

      const emailInput = form.querySelector('[name="email"]');
      const passwordInput = form.querySelector('[name="password"]');

      expect(emailInput.classList.contains('error-input')).toBe(true);
      expect(passwordInput.classList.contains('error-input')).toBe(true);

      const errorMessages = form.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(2);
    });

    it('should clear previous errors before showing new ones', () => {
      document.body.innerHTML = `
        <form id="test-form">
          <input name="email" class="error-input" />
          <div class="error-message">Old error</div>
        </form>
      `;

      const form = document.getElementById('test-form');
      const errors = [new ValidationError('New error', 'email')];

      GlobalErrorHandler.handleValidationErrors(errors, form);

      const errorMessages = form.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(1);
      expect(errorMessages[0].textContent).toBe('New error');
    });
  });

  describe('withRetry', () => {
    it('should retry failed operations', async () => {
      let attempts = 0;
      const fn = vi.fn(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      });

      const result = await GlobalErrorHandler.withRetry(fn, 3, 10);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry auth or validation errors', async () => {
      const authError = new APIError('Unauthorized', 401, ErrorTypes.AUTH);
      const fn = vi.fn(() => {
        throw authError;
      });

      await expect(GlobalErrorHandler.withRetry(fn, 3, 10)).rejects.toThrow(authError);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should throw error after max attempts', async () => {
      const fn = vi.fn(() => {
        throw new Error('Persistent failure');
      });

      await expect(GlobalErrorHandler.withRetry(fn, 2, 10)).rejects.toThrow('Persistent failure');
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });
});