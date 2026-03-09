import { expect, test } from '@playwright/test';
import { signInWithEmail } from './helpers/auth';

const email = process.env.E2E_ONBOARDING_EMAIL;
const password = process.env.E2E_ONBOARDING_PASSWORD;

test.describe('Onboarding flow', () => {
  test('redirects first-time V2 users into onboarding, then completes and returns to V2 learn', async ({ page }) => {
    if (!email || !password) {
      throw new Error('Missing onboarding E2E credentials.');
    }

    await signInWithEmail(page, email, password);
    await page.goto('/v2/learn');
    await page.waitForURL(/\/onboarding/, { timeout: 30000 });

    await expect(page.getByText(/Quick Interview/i)).toBeVisible();

    const startButton = page.getByTestId('onboarding-start');
    if (await startButton.isVisible().catch(() => false)) {
      await startButton.click();
    }

    await expect(page.getByTestId('onboarding-progress')).toBeVisible();
    await expect(page.getByTestId('onboarding-thread')).toBeVisible();
    await expect(page.getByTestId('onboarding-message-assistant').first()).toBeVisible({ timeout: 30000 });

    const responses = [
      'Sam',
      '16 to 17',
      'GCSE Biology',
      'understand',
      'mixed with clear explanations',
    ];

    for (let index = 0; index < responses.length; index += 1) {
      const assistantCountBefore = await page.getByTestId('onboarding-message-assistant').count();
      await expect(page.getByTestId('onboarding-input')).toBeEnabled({ timeout: 30000 });
      await page.getByTestId('onboarding-input').fill(responses[index]);
      await expect(page.getByTestId('onboarding-input')).toHaveValue(responses[index], { timeout: 30000 });
      await page.getByTestId('onboarding-input').press('Enter');
      await expect(page.getByTestId('onboarding-counter')).toContainText(
        `Responses captured: ${index + 1}/10`,
        { timeout: 30000 }
      );
      if (index < responses.length - 1) {
        await expect(page.getByTestId('onboarding-message-assistant')).toHaveCount(assistantCountBefore + 1, {
          timeout: 30000,
        });
      }
    }

    await expect(page.getByTestId('onboarding-complete')).toBeEnabled({ timeout: 10000 });
    await page.getByTestId('onboarding-complete').click();

    await page.waitForURL(/\/v2\/learn/, { timeout: 30000 });
    await expect(page).toHaveURL(/\/v2\/learn/);
  });
});
