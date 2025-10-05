/**
 * Tests for sanitization utilities
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHTML, validateAndSanitizeInput, createSafeHTML } from '../../src/js/utils/sanitize.js';

describe('sanitizeHTML', () => {
  it('should sanitize script tags', () => {
    const malicious = '<script>alert("xss")</script>Hello';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should sanitize HTML attributes', () => {
    const malicious = '<img src="x" onerror="alert(1)">';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('alert');
  });

  it('should preserve safe text content', () => {
    const safe = 'Hello World! This is safe text.';
    const result = sanitizeHTML(safe);
    expect(result).toBe(safe);
  });

  it('should handle empty and null inputs', () => {
    expect(sanitizeHTML('')).toBe('');
    expect(sanitizeHTML(null)).toBe('');
    expect(sanitizeHTML(undefined)).toBe('');
  });
});

describe('validateAndSanitizeInput', () => {
  it('should validate required fields', () => {
    const result = validateAndSanitizeInput('', { required: true });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('This field is required');
  });

  it('should validate minimum length', () => {
    const result = validateAndSanitizeInput('ab', { minLength: 3 });
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Minimum length is 3');
  });

  it('should validate maximum length', () => {
    const result = validateAndSanitizeInput('toolong', { maxLength: 5 });
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('Maximum length is 5');
  });

  it('should validate email format', () => {
    const invalidEmail = validateAndSanitizeInput('invalid-email', { type: 'email' });
    expect(invalidEmail.isValid).toBe(false);

    const validEmail = validateAndSanitizeInput('test@example.com', { type: 'email' });
    expect(validEmail.isValid).toBe(true);
  });

  it('should validate number format', () => {
    const invalidNumber = validateAndSanitizeInput('not-a-number', { type: 'number' });
    expect(invalidNumber.isValid).toBe(false);

    const validNumber = validateAndSanitizeInput('123', { type: 'number' });
    expect(validNumber.isValid).toBe(true);
  });

  it('should validate pattern', () => {
    const pattern = /^[A-Z][a-z]+$/; // Capitalized word
    const invalid = validateAndSanitizeInput('lowercase', { pattern });
    expect(invalid.isValid).toBe(false);

    const valid = validateAndSanitizeInput('Capitalized', { pattern });
    expect(valid.isValid).toBe(true);
  });

  it('should sanitize input', () => {
    const result = validateAndSanitizeInput('<script>alert("xss")</script>Hello');
    expect(result.sanitizedValue).not.toContain('<script>');
    expect(result.sanitizedValue).not.toContain('alert');
  });
});

describe('createSafeHTML', () => {
  it('should create safe HTML from potentially malicious content', () => {
    const malicious = '<script>alert("xss")</script><p>Safe content</p>';
    const result = createSafeHTML(malicious);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
  });

  it('should handle empty content', () => {
    expect(createSafeHTML('')).toBe('');
    expect(createSafeHTML(null)).toBe('');
  });
});