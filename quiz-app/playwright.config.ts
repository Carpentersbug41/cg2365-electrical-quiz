import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3100';
const useExternalBase = Boolean(process.env.E2E_BASE_URL);
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER_CMD ||
  'cmd /c "set APP_SURFACE_MODE=v2&& npx next start -p 3100"';

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
        command: webServerCommand,
        url: 'http://127.0.0.1:3100/v2',
        timeout: 240_000,
        reuseExistingServer: true,
      },
});
