import { test, expect } from '@playwright/test';
import { signInWithEmail } from './helpers/auth';

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe('V2 learner flow', () => {
  test('learn -> quiz -> review -> progress', async ({ page }) => {
    if (!email || !password) {
      throw new Error('Missing E2E learner credentials.');
    }

    await signInWithEmail(page, email, password);
    await page.goto('/v2/learn');
    await expect(page.getByText(/V2 Lessons/i)).toBeVisible();

    const firstLessonLink = page.getByRole('link', { name: /Open lesson/i }).first();
    const lessonHref = await firstLessonLink.getAttribute('href');
    if (!lessonHref) throw new Error('Missing lesson link href');
    await page.goto(lessonHref);
    await expect(page.getByRole('link', { name: /Start V2 Quiz/i })).toBeVisible();

    const quizLink = page.getByRole('link', { name: /Start V2 Quiz/i });
    const quizHref = await quizLink.getAttribute('href');
    if (!quizHref) throw new Error('Missing quiz link href');
    await page.goto(quizHref);
    await expect(page.getByText(/Submit V2 Quiz/i)).toBeVisible();

    const inputs = page.locator('input[type="text"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i += 1) {
      await inputs.nth(i).fill('test');
    }

    await page.getByRole('button', { name: /Submit V2 Quiz/i }).click();
    await expect(page.getByRole('heading', { name: /Result/i })).toBeVisible({ timeout: 60000 });

    await page.goto('/v2/review');
    await expect(page.getByText(/V2 Review Queue/i)).toBeVisible();

    await page.goto('/v2/progress');
    await expect(page.getByText(/V2 Progress/i)).toBeVisible();
  });
});
