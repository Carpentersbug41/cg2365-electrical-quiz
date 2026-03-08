import type { Page } from '@playwright/test';

export async function signInWithEmail(page: Page, email: string, password: string) {
  await page.goto('/auth/sign-in');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.locator('button[type="submit"]').click();
  await page
    .waitForURL((url) => !url.pathname.includes('/auth/sign-in'), { timeout: 15_000 })
    .catch(() => undefined);
}
