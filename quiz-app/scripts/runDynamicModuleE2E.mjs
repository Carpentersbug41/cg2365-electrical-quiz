import { chromium } from 'playwright';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const plannerUrl = `${baseUrl}/2365/admin/dynamic-module?devBypassAuth=1`;
const PREFERRED_BLUEPRINTS = ['202-1A', '203-4A'];

async function fetchJson(path, init) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || `Request failed: ${path}`);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
        continue;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Request failed: ${path}`);
}

async function findPlannerRunWithBlueprints() {
  const runsData = await fetchJson('/api/admin/module/runs', {
    headers: { 'x-course-prefix': '/2365' },
  });

  const recentRuns = Array.isArray(runsData.recentRuns) ? runsData.recentRuns : [];
  for (let index = 0; index < recentRuns.length; index += 1) {
    const run = recentRuns[index];
    const summary = await fetchJson(`/api/admin/module/runs/${run.id}`, {
      headers: { 'x-course-prefix': '/2365' },
    });
    const m4 = summary.artifacts?.find?.((artifact) => artifact.stage === 'M4')?.artifact_json;
    const blueprints = Array.isArray(m4) ? m4 : Array.isArray(m4?.blueprints) ? m4.blueprints : [];
    if (blueprints.length > 0) {
      return { runId: run.id, runIndex: index, blueprints };
    }
  }

  throw new Error('No 2365 planner run with M4 blueprints was found.');
}

function selectPreferredBlueprint(blueprints) {
  const orderedBlueprints = [...blueprints].sort((a, b) => {
    const aRank = PREFERRED_BLUEPRINTS.indexOf(a.id);
    const bRank = PREFERRED_BLUEPRINTS.indexOf(b.id);
    const normalizedA = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
    const normalizedB = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;
    return normalizedA - normalizedB;
  });
  const blueprint = orderedBlueprints[0];
  if (!blueprint?.id) {
    throw new Error('No planner blueprint was available to run the browser E2E.');
  }
  return blueprint.id;
}

async function run() {
  const { runId, runIndex, blueprints } = await findPlannerRunWithBlueprints();
  const targetBlueprintId = selectPreferredBlueprint(blueprints);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(plannerUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(
      () =>
        document.body.innerText.includes('Dynamic 2365 Module Planner') &&
        document.body.innerText.includes('Populate syllabus') &&
        document.body.innerText.includes('Plan lessons (M0-M5)'),
      null,
      { timeout: 20_000 }
    );

    const runRow = page
      .locator('div.rounded.border.border-slate-200.p-2.text-sm')
      .filter({ hasText: `Run ID: ${runId}` })
      .first();
    await runRow.getByRole('button', { name: 'Open' }).click();
    await page.waitForFunction(() => document.body.innerText.includes('Lesson Plan Matrix'), null, {
      timeout: 30_000,
    });

    const blueprintCard = page
      .locator('div.rounded.border.border-slate-200.p-3')
      .filter({ hasText: targetBlueprintId })
      .first();
    await blueprintCard.waitFor({ timeout: 30_000 });
    await blueprintCard.getByRole('button', { name: /Generate Dynamic|Regenerate Dynamic/ }).click();
    await blueprintCard.waitFor({ timeout: 30_000 });
    await page.waitForFunction(
      (blueprintId) => {
        const cards = Array.from(document.querySelectorAll('div.rounded.border.border-slate-200.p-3'));
        const target = cards.find((card) => card.textContent?.includes(blueprintId));
        return Boolean(target?.textContent?.includes('Dynamic draft generated'));
      },
      targetBlueprintId,
      { timeout: 180_000 }
    );

    const previewHref = await blueprintCard.getByRole('link', { name: 'Preview Dynamic Draft' }).getAttribute('href');
    const chatbotHref = await blueprintCard.getByRole('link', { name: 'Open in Simple Chatbot' }).getAttribute('href');
    const generatedBanner = await blueprintCard.locator('div.border-emerald-200').first().textContent();
    const versionMatch = generatedBanner?.match(/Version:\s*v(\d+)/i) ?? null;
    const scoreMatch = generatedBanner?.match(/Score:\s*(\d+)/i) ?? null;
    const gradeMatch = generatedBanner?.match(/Grade:\s*([a-z]+)/i) ?? null;

    if (!previewHref || !chatbotHref) {
      throw new Error('Dynamic generation completed but preview links were missing.');
    }

    const chatPage = await browser.newPage();

    await chatPage.goto(`${baseUrl}${chatbotHref}`, { waitUntil: 'networkidle' });
    await chatPage.getByRole('textbox').fill('start');
    const chatbotResponse = await Promise.all([
      chatPage.waitForResponse(
        (response) =>
          response.url().includes('/api/simple-chatbot') && response.request().method() === 'POST',
        { timeout: 30_000 }
      ),
      chatPage.getByRole('button', { name: 'Send' }).click(),
    ]).then(([response]) => response);

    const apiStatus = chatbotResponse.status();
    const responseHeaders = chatbotResponse.headers();
    const stepTitle = responseHeaders['x-simple-chatbot-lesson-step-title'] || null;
    const stepStage = responseHeaders['x-simple-chatbot-lesson-step-stage'] || null;

    if (apiStatus !== 200) {
      throw new Error(`Simple chatbot preview did not return 200. Status: ${apiStatus ?? 'none'}`);
    }
    if (stepTitle !== 'Intro' || stepStage !== 'intro') {
      throw new Error(
        `Simple chatbot preview returned unexpected lesson step metadata: ${stepTitle ?? 'none'} / ${stepStage ?? 'none'}`
      );
    }

    await chatPage.close();

    const result = {
      plannerUrl,
      runId,
      runIndex,
      blueprintId: targetBlueprintId,
      versionNo: versionMatch ? Number(versionMatch[1]) : null,
      score: scoreMatch ? Number(scoreMatch[1]) : null,
      grade: gradeMatch ? gradeMatch[1] : null,
      previewUrl: `${baseUrl}${previewHref}`,
      simpleChatbotPreviewUrl: `${baseUrl}${chatbotHref}`,
      chatbotApiStatus: apiStatus,
      stepTitle,
      stepStage,
    };

    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('[runDynamicModuleE2E] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
