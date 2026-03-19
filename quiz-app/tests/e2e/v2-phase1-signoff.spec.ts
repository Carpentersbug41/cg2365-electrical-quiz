import { test, expect } from '@playwright/test';
import { signInWithEmail } from './helpers/auth';
import { getGcseBiologyPhase1TargetCodes } from '../../src/data/v2/gcse/biology/phase1Target';

const learnerEmail = process.env.E2E_USER_EMAIL;
const learnerPassword = process.env.E2E_USER_PASSWORD;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const phase1LessonCodes = getGcseBiologyPhase1TargetCodes();

test.describe('V2 Phase 1 signoff', () => {
  test('learner surface stays on the 7 Phase 1 lessons and renders rich lesson blocks', async ({ page }) => {
    if (!learnerEmail || !learnerPassword) {
      throw new Error('Missing E2E learner credentials.');
    }

    await signInWithEmail(page, learnerEmail, learnerPassword);
    await page.goto('/v2/learn');
    await expect(page.getByText(/V2 Lessons/i)).toBeVisible();

    const lessonLinks = page.getByRole('link', { name: 'Open lesson' });
    await expect(lessonLinks).toHaveCount(phase1LessonCodes.length);
    const lessonCodes = (await lessonLinks.evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href') || '')
        .map((href) => href.split('/').pop() || '')
        .map((code) => decodeURIComponent(code))
        .sort()
    )) as string[];
    expect(lessonCodes).toEqual([...phase1LessonCodes].sort());

    const splitRouteResponse = await page.goto('/learn');
    expect(splitRouteResponse?.status()).toBe(404);

    await page.goto('/v2/learn');
    for (const lessonCode of ['BIO-101-1A', 'BIO-102-1A', 'BIO-104-1A']) {
      await page.goto(`/v2/learn/${lessonCode}`);
      await expect(page.getByRole('link', { name: /Start V2 Quiz/i })).toBeVisible();
      await expect(page.getByText(/Block renderer for this type is pending/i)).toHaveCount(0);
      await expect(page.getByText(/\(practice\)/i).first()).toBeVisible();
      await expect(page.getByText(/\(spaced-review\)/i).first()).toBeVisible();
    }

    await page.goto('/v2/learn/BIO-104-1A');
    await expect(page.getByText(/\(worked-example\)/i)).toBeVisible();
    await expect(page.getByText(/\(guided-practice\)/i)).toBeVisible();

    const legacyApiStatus = await page.evaluate(async () => {
      const response = await fetch('/api/v1/quiz-sets');
      return response.status;
    });
    expect(legacyApiStatus).toBe(404);
  });

  test('admin user drill-down loads timeline data from the V2 outcomes route', async ({ page }) => {
    if (!adminEmail || !adminPassword) {
      throw new Error('Missing E2E admin credentials.');
    }

    await signInWithEmail(page, adminEmail, adminPassword);
    await page.goto('/v2/admin');

    await expect(page.getByText(/V2 Admin Content/i)).toBeVisible();
    await expect(page.getByText(/V2 Outcomes Dashboard/i)).toBeVisible();

    const outcomesUserTable = page
      .locator('table')
      .filter({ hasText: 'Attempts' })
      .filter({ hasText: 'Completion' })
      .filter({ hasText: 'Review' })
      .filter({ hasText: 'Mastery' })
      .first();
    await expect(outcomesUserTable).toBeVisible();

    const userButton = outcomesUserTable.getByRole('button').first();
    await expect(userButton).toBeVisible();
    await userButton.click();

    await expect(page.getByRole('heading', { name: /User Drill-down/i })).toBeVisible();
    await page.getByRole('button', { name: /Refresh timeline/i }).click();

    await expect(page.locator('table').filter({ hasText: /Review backlog/i }).first()).toBeVisible();

    const adminSplitRouteResponse = await page.goto('/learn');
    expect(adminSplitRouteResponse?.status()).toBe(404);
  });
});
