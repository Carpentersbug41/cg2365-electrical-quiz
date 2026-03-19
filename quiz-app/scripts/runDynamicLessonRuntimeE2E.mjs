import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const PREFERRED_BLUEPRINTS = ['202-1A', '203-4A'];
const STORE_PATH = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');

function decodeHeader(value) {
  return value ? decodeURIComponent(value) : '';
}

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

async function getLatestAcceptedDynamicDraft() {
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw);
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

async function requestAssistantTurn({
  message,
  thread,
  lessonCode,
  dynamicVersionId,
  lessonStepIndex,
  lessonSectionPhase,
  lessonDeeperTurnCount = 0,
}) {
  let response = null;
  let assistantText = '';
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(`${baseUrl}/api/simple-chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          thread,
          lessonCode,
          dynamicVersionId,
          lessonStepIndex,
          lessonSectionPhase,
          lessonDeeperTurnCount,
          attachment: null,
        }),
      });

      assistantText = await response.text();
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
        continue;
      }
    }
  }

  if (!response) {
    const errorMessage = lastError instanceof Error ? lastError.message : 'Unknown fetch failure';
    throw new Error(
      `Simple chatbot request failed for stepIndex=${lessonStepIndex}, phase=${lessonSectionPhase}: ${errorMessage}`
    );
  }

  return {
    status: response.status,
    assistantText,
    headers: {
      stepTitle: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-title')),
      stepStage: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-stage')),
      stepRole: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-role')),
      completionMode: decodeHeader(response.headers.get('x-simple-chatbot-lesson-completion-mode')),
      feedbackPhase: response.headers.get('x-simple-chatbot-feedback-phase') || '',
      progressionGate: response.headers.get('x-simple-chatbot-progression-gate') || '',
      feedbackResolved: response.headers.get('x-simple-chatbot-feedback-resolved') || '',
      feedbackNext: response.headers.get('x-simple-chatbot-feedback-next') || '',
      autoAdvance: response.headers.get('x-simple-chatbot-auto-advance') || '',
      nextStepStage: decodeHeader(response.headers.get('x-simple-chatbot-next-step-stage')),
      nextStepRole: decodeHeader(response.headers.get('x-simple-chatbot-next-step-role')),
    },
  };
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const generated = await getLatestAcceptedDynamicDraft();
  const lesson = await getGeneratedLesson(generated.versionId);
  const firstTeachCheckIndex = lesson.steps.findIndex((step) => step.stage === 'teach_check');
  const workedExampleIndex = lesson.steps.findIndex((step) => step.stage === 'worked_example');

  assertCondition(firstTeachCheckIndex >= 0, 'Generated lesson does not contain a teach_check step.');
  assertCondition(workedExampleIndex >= 0, 'Generated lesson does not contain a worked_example step.');

  const thread = [];

  const intro = await requestAssistantTurn({
    message: 'start',
    thread,
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: 0,
    lessonSectionPhase: 'teach',
  });
  assertCondition(intro.status === 200, `Intro request failed with ${intro.status}.`);
  assertCondition(intro.headers.stepTitle === 'Intro', `Expected Intro title, got ${intro.headers.stepTitle || 'none'}.`);
  assertCondition(intro.headers.stepStage === 'intro', `Expected intro stage, got ${intro.headers.stepStage || 'none'}.`);
  thread.push({ role: 'user', text: 'start' }, { role: 'assistant', text: intro.assistantText });

  const teachCheck = await requestAssistantTurn({
    message: 'ok',
    thread,
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: firstTeachCheckIndex,
    lessonSectionPhase: 'teach',
  });
  assertCondition(teachCheck.status === 200, `Teach/check request failed with ${teachCheck.status}.`);
  assertCondition(teachCheck.headers.stepStage === 'teach_check', `Expected teach_check stage, got ${teachCheck.headers.stepStage || 'none'}.`);
  thread.push({ role: 'user', text: 'ok' }, { role: 'assistant', text: teachCheck.assistantText });

  const feedbackBasic = await requestAssistantTurn({
    message: 'not sure',
    thread,
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: firstTeachCheckIndex,
    lessonSectionPhase: 'feedback_basic',
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
  thread.push({ role: 'user', text: 'not sure' }, { role: 'assistant', text: feedbackBasic.assistantText });

  const feedbackDeeper = await requestAssistantTurn({
    message: 'not sure',
    thread,
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: firstTeachCheckIndex,
    lessonSectionPhase: 'feedback_deeper',
    lessonDeeperTurnCount: 1,
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

  const workedExample = await requestAssistantTurn({
    message: 'continue',
    thread: [],
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: workedExampleIndex,
    lessonSectionPhase: 'teach',
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

  const workedExampleFeedback = await requestAssistantTurn({
    message: 'yes',
    thread: [
      { role: 'user', text: 'continue' },
      { role: 'assistant', text: workedExample.assistantText },
    ],
    lessonCode: generated.lessonCode,
    dynamicVersionId: generated.versionId,
    lessonStepIndex: workedExampleIndex,
    lessonSectionPhase: 'worked_example_feedback',
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
}

run().catch((error) => {
  console.error('[runDynamicLessonRuntimeE2E] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
