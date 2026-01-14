/**
 * Vitest Test Setup
 * Global test configuration and environment setup
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in test output (optional)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Optionally suppress certain console messages during tests
  console.error = (...args: any[]) => {
    // Only suppress specific errors if needed
    const message = args[0]?.toString() || '';
    if (message.includes('Warning:') || message.includes('React')) {
      return;
    }
    originalError(...args);
  };

  console.warn = (...args: any[]) => {
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


