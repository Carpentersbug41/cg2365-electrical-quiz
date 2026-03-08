import { test, expect } from '@playwright/test';
import { signInWithEmail } from './helpers/auth';

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe('V2 admin flow', () => {
  test('admin dashboard and generation queue smoke', async ({ page }) => {
    if (!email || !password) {
      throw new Error('Missing E2E admin credentials.');
    }

    await signInWithEmail(page, email, password);
    await page.goto('/v2/admin');

    await expect(page.getByText(/V2 Admin Content/i)).toBeVisible();
    await expect(page.getByText(/V2 Outcomes Dashboard/i)).toBeVisible();

    await page.locator('#newJobLessonCode').fill('BIO-101-1A');
    await page.locator('#newJobPrompt').fill('E2E smoke draft request');
    await page.getByRole('button', { name: /Queue lesson draft job/i }).click();

    await expect(page.getByText(/Failed to create generation job/i)).toHaveCount(0);
    await expect(page.getByText(/AI Generation Jobs/i)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'lesson_draft' }).first()).toBeVisible();
  });
});
