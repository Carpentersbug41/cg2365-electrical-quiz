/**
 * Vitest Test Setup
 * Global test configuration and environment setup
 */

import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
// Note: NODE_ENV is read-only in TypeScript, but vitest sets it automatically

// Mock console methods to reduce noise in test output (optional)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Optionally suppress certain console messages during tests
  console.error = (...args: unknown[]) => {
    // Only suppress specific errors if needed
    const message = args[0]?.toString() || '';
    if (message.includes('Warning:') || message.includes('React')) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: unknown[]) => {
    const message = args[0]?.toString() || '';
    if (message.includes('Warning:')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});


