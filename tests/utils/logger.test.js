/**
 * Tests for logger utility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Logger from '../../src/js/utils/logger.js';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('error logging', () => {
    it('should log errors in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'error');

      Logger.error('Test error', new Error('Test'));

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR] Test error',
        expect.any(Error)
      );
    });

    it('should handle errors without error object', () => {
      const consoleSpy = vi.spyOn(console, 'error');

      Logger.error('Simple error message');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR] Simple error message',
        null
      );
    });
  });

  describe('warning logging', () => {
    it('should log warnings in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'warn');

      Logger.warn('Test warning', { data: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[WARN] Test warning',
        { data: 'test' }
      );
    });
  });

  describe('info logging', () => {
    it('should log info messages in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'log');

      Logger.info('Test info', { data: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[INFO] Test info',
        { data: 'test' }
      );
    });
  });

  describe('debug logging', () => {
    it('should log debug messages in development mode', () => {
      const consoleSpy = vi.spyOn(console, 'debug');

      Logger.debug('Test debug', { data: 'test' });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[DEBUG] Test debug',
        { data: 'test' }
      );
    });
  });

  describe('API error handling', () => {
    it('should format API errors consistently', () => {
      const consoleSpy = vi.spyOn(console, 'error');
      const error = new Error('API failed');

      Logger.apiError('fetching data', error, { userId: 123 });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ERROR] API Error during fetching data: API failed',
        expect.objectContaining({
          error: error,
          context: { userId: 123 }
        })
      );
    });
  });

  describe('user error messages', () => {
    it('should show user-friendly error messages in development', () => {
      // Mock alert since we're in test environment
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      Logger.showUserError('Something went wrong');

      expect(alertSpy).toHaveBeenCalledWith('Something went wrong');

      alertSpy.mockRestore();
    });
  });
});