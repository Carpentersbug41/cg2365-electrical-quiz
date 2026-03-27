import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const STORE_PATH = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');
const OUTPUT_PATH = path.join(process.cwd(), '.runtime', 'dynamic-runtime-variant-comparison.json');

const PROBE_CONFIG = {
  '203-4A': {
    basicReply: 'TT uses a rod and TN-C-S combines neutral and earth before separating them.',
    deeperReply: 'Because the arrangement changes the fault path and the loop impedance.',
  },
  '203-5A': {
    basicReply: 'Power stations generate electricity and it is sent at high voltage.',
    deeperReply: 'Because higher voltage reduces current and that reduces losses in the cables.',
  },
  '202-2B': {
    basicReply: 'Current is measured with an ammeter and voltage with a voltmeter.',
    deeperReply: 'An ammeter has low resistance so it does not affect the current much.',
  },
};

function findCurrentVersion(store, lessonCode) {
  const versions = Array.isArray(store?.versions) ? store.versions : [];
  return (
    versions.find((version) => version.lessonCode === lessonCode && version.isCurrent) ??
    versions.find((version) => version.lessonCode === lessonCode) ??
    null
  );
}

function findFirstTeachCheckStep(lesson) {
  return lesson.steps.findIndex((step) => step.stage === 'teach_check');
}

async function loadStore() {
  const raw = await readFile(STORE_PATH, 'utf8');
  return JSON.parse(raw.replace(/^\uFEFF/, ''));
}

async function probeVariant({
  runtimeVariant,
  lessonCode,
  dynamicVersionId,
  lessonStepIndex,
  lessonSectionPhase,
  message,
}) {
  const response = await fetch(`${BASE_URL}/api/simple-chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      thread: [],
      lessonCode,
      dynamicVersionId,
      lessonStepIndex,
      lessonSectionPhase,
      lessonDeeperTurnCount: lessonSectionPhase === 'feedback_deeper' ? 1 : 0,
      runtimeVariant,
    }),
  });

  const text = await response.text();
  return {
    status: response.status,
    runtimeVariant: response.headers.get('x-simple-chatbot-runtime-variant'),
    replyClass: response.headers.get('x-simple-chatbot-reply-class'),
    stepTitle: decodeURIComponent(response.headers.get('x-simple-chatbot-lesson-step-title') ?? ''),
    stepStage: decodeURIComponent(response.headers.get('x-simple-chatbot-lesson-step-stage') ?? ''),
    feedbackPhase: response.headers.get('x-simple-chatbot-feedback-phase'),
    feedbackResolved: response.headers.get('x-simple-chatbot-feedback-resolved'),
    feedbackNext: response.headers.get('x-simple-chatbot-feedback-next'),
    text,
  };
}

async function main() {
  const store = await loadStore();
  const report = {
    createdAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    results: [],
  };

  for (const lessonCode of Object.keys(PROBE_CONFIG)) {
    const version = findCurrentVersion(store, lessonCode);
    if (!version?.lesson) {
      report.results.push({
        lessonCode,
        error: 'No current version found in version store.',
      });
      continue;
    }

    const lessonStepIndex = findFirstTeachCheckStep(version.lesson);
    if (lessonStepIndex < 0) {
      report.results.push({
        lessonCode,
        dynamicVersionId: version.id,
        error: 'No teach_check step found.',
      });
      continue;
    }

    const basicReply = PROBE_CONFIG[lessonCode].basicReply;
    const deeperReply = PROBE_CONFIG[lessonCode].deeperReply;

    const lessonResult = {
      lessonCode,
      dynamicVersionId: version.id,
      lessonStepIndex,
      probes: {},
    };

    for (const runtimeVariant of ['control', 'lean_feedback_v1']) {
      lessonResult.probes[runtimeVariant] = {
        teach: await probeVariant({
          runtimeVariant,
          lessonCode,
          dynamicVersionId: version.id,
          lessonStepIndex,
          lessonSectionPhase: 'teach',
          message: '',
        }),
        feedback_basic: await probeVariant({
          runtimeVariant,
          lessonCode,
          dynamicVersionId: version.id,
          lessonStepIndex,
          lessonSectionPhase: 'feedback_basic',
          message: basicReply,
        }),
        feedback_deeper: await probeVariant({
          runtimeVariant,
          lessonCode,
          dynamicVersionId: version.id,
          lessonStepIndex,
          lessonSectionPhase: 'feedback_deeper',
          message: deeperReply,
        }),
      };
    }

    report.results.push(lessonResult);
  }

  await writeFile(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Wrote comparison report to ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
