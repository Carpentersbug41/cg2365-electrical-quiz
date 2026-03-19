import { test, expect } from '@playwright/test';
import { signInWithEmail } from './helpers/auth';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const learnerEmail = process.env.E2E_USER_EMAIL;

test.describe('V2 role management', () => {
  test('admin can grant content operator role by email', async ({ page }) => {
    if (!adminEmail || !adminPassword || !learnerEmail) {
      throw new Error('Missing E2E admin or learner credentials.');
    }

    await signInWithEmail(page, adminEmail, adminPassword);
    await page.goto('/v2/admin');

    await expect(page.getByText(/V2 Access/i)).toBeVisible();

    await page.locator('#newEnrollmentEmail').fill(learnerEmail);
    await page.getByRole('button', { name: /Grant access/i }).click();

    await page.locator('#newRoleEmail').fill(learnerEmail);
    await page.locator('#newRoleValue').selectOption('content_operator');
    await page.getByRole('button', { name: /^Grant role$/i }).click();

    await page.getByRole('button', { name: /Refresh roles/i }).click();

    const roleRow = page.locator('tr', { hasText: learnerEmail }).filter({ hasText: /content_operator/i }).first();
    await expect(roleRow).toBeVisible();
  });
});
