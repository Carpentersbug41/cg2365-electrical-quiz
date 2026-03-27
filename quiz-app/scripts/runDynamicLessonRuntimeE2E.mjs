import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const PREFERRED_BLUEPRINTS = ['202-2B', '202-1A', '203-4A'];
const STORE_PATH = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');

function stripBom(text) {
  return typeof text === 'string' ? text.replace(/^\uFEFF/, '') : text;
}

async function fetchJson(resourcePath, init) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${resourcePath}`, init);
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || `Request failed: ${resourcePath}`);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Request failed: ${resourcePath}`);
}

async function getLatestAcceptedDynamicDraft() {
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(stripBom(raw));
  const versions = Array.isArray(parsed?.versions) ? parsed.versions : [];
  const ordered = versions
    .filter((version) => version?.isCurrent && PREFERRED_BLUEPRINTS.includes(version?.lessonCode))
    .sort((a, b) => {
      const aRank = PREFERRED_BLUEPRINTS.indexOf(a.lessonCode);
      const bRank = PREFERRED_BLUEPRINTS.indexOf(b.lessonCode);
      if (aRank !== bRank) return aRank - bRank;
      return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
    });

  const selected = ordered[0];
  if (!selected?.id || !selected?.lessonCode) {
    throw new Error(
      `No saved accepted dynamic version found for preferred lessons ${PREFERRED_BLUEPRINTS.join(', ')} in ${STORE_PATH}.`
    );
  }

  return {
    runId: selected.sourceRefs?.find?.((value) => typeof value === 'string' && value.startsWith('module_run:'))?.split(':')[1] ?? null,
    blueprintId: selected.lessonCode,
    lessonCode: selected.lessonCode,
    versionId: selected.id,
  };
}

async function getGeneratedLesson(versionId) {
  const result = await fetchJson(`/api/dynamic-guided-v2/versions/${encodeURIComponent(versionId)}`);
  return result.lesson;
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function chooseByValue(selectLocator, value) {
  const options = await selectLocator.locator('option').evaluateAll((nodes) =>
    nodes.map((node) => ({ value: node.value, label: node.textContent?.trim() || '' }))
  );
  const match = options.find((option) => option.value === value);
  if (!match?.value) {
    throw new Error(`Could not find select option value "${value}". Options: ${options.map((option) => `${option.value}:${option.label}`).join(', ')}`);
  }
  await selectLocator.selectOption(match.value);
}

async function applyJump({ stepSelect, phaseSelect, stepIndex, phaseValue, jumpButton }) {
  await stepSelect.selectOption(String(stepIndex));
  await chooseByValue(phaseSelect, phaseValue);
  await jumpButton.click();
}

async function requestAssistantTurn({ page, message, expectedMessageCount }) {
  const input = page.getByRole('textbox');
  const sendButton = page.getByRole('button', { name: 'Send' });
  await input.fill(message);
  const response = await Promise.all([
    page.waitForResponse(
      (candidate) => candidate.url().includes('/api/simple-chatbot') && candidate.request().method() === 'POST',
      { timeout: 120_000 }
    ),
    sendButton.click(),
  ]).then(([matched]) => matched);

  if (typeof expectedMessageCount === 'number') {
    await page.waitForTimeout(1000);
  }

  const headers = response.headers();
  const assistantText = await page.locator('article').last().innerText();

  return {
    status: response.status(),
    assistantText,
    headers: {
      stepTitle: headers['x-simple-chatbot-lesson-step-title']
        ? decodeURIComponent(headers['x-simple-chatbot-lesson-step-title'])
        : '',
      stepStage: headers['x-simple-chatbot-lesson-step-stage']
        ? decodeURIComponent(headers['x-simple-chatbot-lesson-step-stage'])
        : '',
      stepRole: headers['x-simple-chatbot-lesson-step-role']
        ? decodeURIComponent(headers['x-simple-chatbot-lesson-step-role'])
        : '',
      feedbackPhase: headers['x-simple-chatbot-feedback-phase'] || '',
      progressionGate: headers['x-simple-chatbot-progression-gate'] || '',
      autoAdvance: headers['x-simple-chatbot-auto-advance'] || '',
      nextStepStage: headers['x-simple-chatbot-next-step-stage']
        ? decodeURIComponent(headers['x-simple-chatbot-next-step-stage'])
        : '',
    },
  };
}

async function run() {
  const generated = await getLatestAcceptedDynamicDraft();
  const lesson = await getGeneratedLesson(generated.versionId);
  const firstTeachCheckIndex = lesson.steps.findIndex((step) => step.stage === 'teach_check');
  const workedExampleIndex = lesson.steps.findIndex((step) => step.stage === 'worked_example');

  assertCondition(firstTeachCheckIndex >= 0, 'Generated lesson does not contain a teach_check step.');
  assertCondition(workedExampleIndex >= 0, 'Generated lesson does not contain a worked_example step.');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(
      `${baseUrl}/2365/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(generated.lessonCode)}&dynamicVersionId=${encodeURIComponent(generated.versionId)}&devBypassAuth=1`,
      { waitUntil: 'networkidle' }
    );
    await page.waitForFunction(
      () => document.body.innerText.includes('Simple Chatbot') && document.body.innerText.includes('Lesson mode'),
      null,
      { timeout: 30_000 }
    );

    const stepSelect = page.getByTestId('jump-step-select');
    const phaseSelect = page.getByTestId('jump-phase-select');
    const jumpButton = page.getByRole('button', { name: 'Jump' });

    const intro = await requestAssistantTurn({
      page,
      message: 'start',
      expectedMessageCount: 2,
    });
    assertCondition(intro.status === 200, `Intro request failed with ${intro.status}.`);
    assertCondition(intro.headers.stepTitle === 'Intro', `Expected Intro title, got ${intro.headers.stepTitle || 'none'}.`);
    assertCondition(intro.headers.stepStage === 'intro', `Expected intro stage, got ${intro.headers.stepStage || 'none'}.`);

    await applyJump({
      stepSelect,
      phaseSelect,
      jumpButton,
      stepIndex: firstTeachCheckIndex,
      phaseValue: 'teach',
    });

    const teachCheck = await requestAssistantTurn({
      page,
      message: 'ok',
      expectedMessageCount: 4,
    });
    assertCondition(teachCheck.status === 200, `Teach/check request failed with ${teachCheck.status}.`);
    assertCondition(teachCheck.headers.stepStage === 'teach_check', `Expected teach_check stage, got ${teachCheck.headers.stepStage || 'none'}.`);

    await applyJump({
      stepSelect,
      phaseSelect,
      jumpButton,
      stepIndex: firstTeachCheckIndex,
      phaseValue: 'feedback_basic',
    });
    const feedbackBasic = await requestAssistantTurn({
      page,
      message: 'not sure',
      expectedMessageCount: 6,
    });
    assertCondition(feedbackBasic.status === 200, `Feedback basic request failed with ${feedbackBasic.status}.`);
    assertCondition(
      feedbackBasic.headers.feedbackPhase === 'feedback_basic',
      `Expected feedback_basic phase, got ${feedbackBasic.headers.feedbackPhase || 'none'}.`
    );
    assertCondition(
      feedbackBasic.headers.stepStage === 'teach_check',
      `Expected feedback_basic to stay on teach_check, got ${feedbackBasic.headers.stepStage || 'none'}.`
    );

    await applyJump({
      stepSelect,
      phaseSelect,
      jumpButton,
      stepIndex: firstTeachCheckIndex,
      phaseValue: 'feedback_deeper',
    });
    const feedbackDeeper = await requestAssistantTurn({
      page,
      message: 'not sure',
      expectedMessageCount: 8,
    });
    assertCondition(feedbackDeeper.status === 200, `Feedback deeper request failed with ${feedbackDeeper.status}.`);
    assertCondition(
      feedbackDeeper.headers.feedbackPhase === 'feedback_deeper',
      `Expected feedback_deeper phase, got ${feedbackDeeper.headers.feedbackPhase || 'none'}.`
    );
    assertCondition(
      feedbackDeeper.headers.progressionGate === 'true',
      `Expected feedback_deeper to be a progression gate, got ${feedbackDeeper.headers.progressionGate || 'none'}.`
    );

    await applyJump({
      stepSelect,
      phaseSelect,
      jumpButton,
      stepIndex: workedExampleIndex,
      phaseValue: 'teach',
    });
    const workedExample = await requestAssistantTurn({
      page,
      message: 'continue',
      expectedMessageCount: 10,
    });
    assertCondition(workedExample.status === 200, `Worked example request failed with ${workedExample.status}.`);
    assertCondition(
      workedExample.headers.stepStage === 'worked_example',
      `Expected worked_example stage, got ${workedExample.headers.stepStage || 'none'}.`
    );
    assertCondition(
      workedExample.headers.stepRole === 'worked_example',
      `Expected worked_example role, got ${workedExample.headers.stepRole || 'none'}.`
    );

    await applyJump({
      stepSelect,
      phaseSelect,
      jumpButton,
      stepIndex: workedExampleIndex,
      phaseValue: 'worked_example_feedback',
    });
    const workedExampleFeedback = await requestAssistantTurn({
      page,
      message: 'yes',
      expectedMessageCount: 12,
    });
    assertCondition(
      workedExampleFeedback.status === 200,
      `Worked example feedback request failed with ${workedExampleFeedback.status}.`
    );
    assertCondition(
      workedExampleFeedback.headers.feedbackPhase === 'worked_example_feedback',
      `Expected worked_example_feedback phase, got ${workedExampleFeedback.headers.feedbackPhase || 'none'}.`
    );
    assertCondition(
      workedExampleFeedback.headers.progressionGate === 'true',
      `Expected worked_example_feedback to be a progression gate, got ${workedExampleFeedback.headers.progressionGate || 'none'}.`
    );
    assertCondition(
      workedExampleFeedback.headers.autoAdvance === 'true',
      `Expected worked_example_feedback to auto-advance on yes, got ${workedExampleFeedback.headers.autoAdvance || 'none'}.`
    );
    assertCondition(
      workedExampleFeedback.headers.nextStepStage === 'guided_practice',
      `Expected worked_example_feedback to advance to guided_practice, got ${workedExampleFeedback.headers.nextStepStage || 'none'}.`
    );

    console.log(
      JSON.stringify(
        {
          runId: generated.runId,
          blueprintId: generated.blueprintId,
          lessonCode: generated.lessonCode,
          versionId: generated.versionId,
          firstTeachCheckIndex,
          workedExampleIndex,
          verified: {
            intro: {
              stepTitle: intro.headers.stepTitle,
              stepStage: intro.headers.stepStage,
            },
            teachCheck: {
              stepTitle: teachCheck.headers.stepTitle,
              stepStage: teachCheck.headers.stepStage,
            },
            feedbackBasic: {
              feedbackPhase: feedbackBasic.headers.feedbackPhase,
              stepStage: feedbackBasic.headers.stepStage,
            },
            feedbackDeeper: {
              feedbackPhase: feedbackDeeper.headers.feedbackPhase,
              progressionGate: feedbackDeeper.headers.progressionGate,
            },
            workedExample: {
              stepStage: workedExample.headers.stepStage,
              stepRole: workedExample.headers.stepRole,
            },
            workedExampleFeedback: {
              feedbackPhase: workedExampleFeedback.headers.feedbackPhase,
              progressionGate: workedExampleFeedback.headers.progressionGate,
              autoAdvance: workedExampleFeedback.headers.autoAdvance,
              nextStepStage: workedExampleFeedback.headers.nextStepStage,
            },
          },
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('[runDynamicLessonRuntimeE2E] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
