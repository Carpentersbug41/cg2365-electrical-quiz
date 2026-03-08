import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3100';
const useExternalBase = Boolean(process.env.E2E_BASE_URL);

export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: useExternalBase
    ? undefined
    : {
        command: 'cmd /c npm run dev:v2 -- -p 3100',
        url: 'http://127.0.0.1:3100/v2',
        timeout: 240_000,
        reuseExistingServer: true,
      },
});
