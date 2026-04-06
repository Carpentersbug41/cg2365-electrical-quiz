import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const scenarioPath =
  process.env.RUNTIME_PROMPT_SCENARIOS ||
  path.join(process.cwd(), 'scripts', 'runtimePromptScenarios', 'lesson-mode-core.json');
const outputRoot = path.join(process.cwd(), '.runtime', 'runtime-prompt-evals');
const artifactRoot = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const versionStorePath = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');
const cannedPhrasePatterns = [
  /\bspot on\b/i,
  /\bnice one\b/i,
  /\bgreat stuff\b/i,
  /\bno worries\b/i,
  /\bperfect scores\b/i,
];
const curriculumResetPatterns = [
  /\bstep 0\b/i,
  /\blearning outcome\b/i,
  /\bwhich lo\b/i,
  /\bwhich learning outcome\b/i,
  /\blo1\b/i,
];

function stripBom(text) {
  return typeof text === 'string' ? text.replace(/^\uFEFF/, '') : text;
}

function sanitizeSegment(value) {
  return String(value ?? '')
    .replace(/[^a-z0-9._-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readJson(filePath) {
  return JSON.parse(stripBom(await fs.readFile(filePath, 'utf8')));
}

function decodeHeader(value) {
  return value ? decodeURIComponent(value) : '';
}

function decodeNumberHeader(value) {
  if (value == null || value === '') return Number.NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function countNameMentions(text) {
  return (text.match(/\brob\b/gi) ?? []).length;
}

function countNumberedQuestions(text) {
  return (text.match(/^\s*\d+\.\s+/gm) ?? []).length;
}

function hasFillerTransitionReply(text) {
  const raw = String(text ?? '');
  const normalized = raw.toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalized) return false;
  const hasTransitionPhrase =
    normalized.includes('we will now move on') ||
    normalized.includes("let's move on") ||
    normalized.includes('let us move on') ||
    normalized.includes('move on to') ||
    normalized.includes('now move on to');
  if (!hasTransitionPhrase) return false;
  const hasConcretePrompt =
    normalized.includes('?') ||
    /^\s*\d+\.\s+/m.test(raw) ||
    normalized.includes('calculate') ||
    normalized.includes('what is') ||
    normalized.includes('which ') ||
    normalized.includes('explain ') ||
    normalized.includes('identify ');
  return !hasConcretePrompt;
}

function countCannedPhrases(text) {
  return cannedPhrasePatterns.reduce((total, pattern) => total + ((text.match(pattern) ?? []).length > 0 ? 1 : 0), 0);
}

function hasCurriculumReset(text) {
  return curriculumResetPatterns.some((pattern) => pattern.test(text));
}

async function fetchJson(resourcePath, init) {
  const response = await fetch(`${baseUrl}${resourcePath}`, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || `Request failed: ${resourcePath}`);
  }
  return data;
}

async function loadEnvMap() {
  const candidates = ['.env.local', '.env'];
  const envMap = {};
  for (const candidate of candidates) {
    const absolute = path.join(process.cwd(), candidate);
    try {
      const raw = await fs.readFile(absolute, 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        if (!line || line.startsWith('#')) continue;
        const index = line.indexOf('=');
        if (index < 0) continue;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim();
        if (!(key in envMap)) {
          envMap[key] = value;
        }
      }
    } catch {
      // Ignore missing env files.
    }
  }
  return envMap;
}

async function createSupabaseAdminClient() {
  const fileEnv = await loadEnvMap();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
}

async function resolveLessonVersionId(lessonCode) {
  try {
    const store = await readJson(versionStorePath);
    const versions = Array.isArray(store?.versions) ? store.versions : [];
    const current = versions
      .filter((entry) => entry?.lessonCode === lessonCode && entry?.isCurrent)
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0).getTime() -
          new Date(a.updatedAt || a.createdAt || 0).getTime()
      )[0];
    return current?.id ?? null;
  } catch {
    return null;
  }
}

async function loadLessonByCode(lessonCode) {
  const lessonDir = path.join(artifactRoot, sanitizeSegment(lessonCode));
  const latestPath = path.join(lessonDir, 'latest.json');
  const artifact = await readJson(latestPath);
  if (!artifact?.lesson?.steps?.length) {
    throw new Error(`No runtime lesson artifact found for ${lessonCode} at ${latestPath}.`);
  }
  return artifact.lesson;
}

function resolveStepIndex(lesson, selector) {
  if (!selector) return 0;
  if (selector.kind === 'index') return selector.value;
  if (selector.kind === 'first_stage') {
    const index = lesson.steps.findIndex((step) => step.stage === selector.stage);
    if (index < 0) {
      throw new Error(`Could not find step with stage "${selector.stage}" in ${lesson.lessonCode}.`);
    }
    return index;
  }
  if (selector.kind === 'first_role') {
    const index = lesson.steps.findIndex((step) => step.role === selector.role);
    if (index < 0) {
      throw new Error(`Could not find step with role "${selector.role}" in ${lesson.lessonCode}.`);
    }
    return index;
  }
  if (selector.kind === 'title_contains') {
    const index = lesson.steps.findIndex((step) =>
      String(step.title || '').toLowerCase().includes(String(selector.value || '').toLowerCase())
    );
    if (index < 0) {
      throw new Error(`Could not find step title containing "${selector.value}" in ${lesson.lessonCode}.`);
    }
    return index;
  }
  throw new Error(`Unsupported step selector kind: ${selector.kind}`);
}

function buildInitialState(lesson, scenario) {
  if (!scenario.initialState) {
    return { stepIndex: 0, phase: 'teach', deeperTurnCount: 0 };
  }
  return {
    stepIndex: resolveStepIndex(lesson, scenario.initialState.stepSelector),
    phase: scenario.initialState.phase ?? 'teach',
    deeperTurnCount: Number.isInteger(scenario.initialState.deeperTurnCount)
      ? scenario.initialState.deeperTurnCount
      : 0,
  };
}

function applyLessonResponseState(result, currentState, chatMode) {
  if (currentState.stepIndex === 0) {
    return { stepIndex: 1, phase: 'teach', deeperTurnCount: 0, lessonComplete: false };
  }

  if (currentState.phase === 'teach') {
    if (result.headers.stepStage === 'teach_check') {
      return { stepIndex: currentState.stepIndex, phase: 'feedback_basic', deeperTurnCount: 0, lessonComplete: false };
    }
    if (result.headers.stepRole === 'worked_example') {
      return { stepIndex: currentState.stepIndex, phase: 'worked_example_feedback', deeperTurnCount: 0, lessonComplete: false };
    }
    if (result.headers.stepRole === 'integrative') {
      return { stepIndex: currentState.stepIndex, phase: 'integrative_feedback', deeperTurnCount: 0, lessonComplete: false };
    }
    if (result.headers.lessonCompletionMode === 'continue') {
      const totalSteps = result.headers.lessonStepTotal;
      if (totalSteps > 0 && currentState.stepIndex + 1 >= totalSteps) {
        return { ...currentState, lessonComplete: true };
      }
      return { stepIndex: currentState.stepIndex + 1, phase: 'teach', deeperTurnCount: 0, lessonComplete: false };
    }
    return { stepIndex: currentState.stepIndex, phase: 'feedback_deeper', deeperTurnCount: 1, lessonComplete: false };
  }

  if (currentState.phase === 'feedback_basic') {
    if (chatMode === 'lesson_light') {
      const shouldAdvance =
        result.headers.feedbackResolved === 'true' &&
        (result.headers.feedbackNext === 'baseline' || result.headers.feedbackNext === 'teach');
      const totalSteps = result.headers.lessonStepTotal;
      if (shouldAdvance && totalSteps > 0 && currentState.stepIndex + 1 >= totalSteps) {
        return { ...currentState, lessonComplete: true };
      }
      if (shouldAdvance) {
        return { stepIndex: currentState.stepIndex + 1, phase: 'teach', deeperTurnCount: 0, lessonComplete: false };
      }
      return { stepIndex: currentState.stepIndex, phase: 'feedback_basic', deeperTurnCount: 0, lessonComplete: false };
    }
    return { stepIndex: currentState.stepIndex, phase: 'feedback_deeper', deeperTurnCount: 1, lessonComplete: false };
  }

  const shouldAdvance =
    result.headers.feedbackResolved === 'true' &&
    (result.headers.feedbackNext === 'baseline' || result.headers.feedbackNext === 'teach');
  const totalSteps = result.headers.lessonStepTotal;
  if (shouldAdvance && totalSteps > 0 && currentState.stepIndex + 1 >= totalSteps) {
    return { ...currentState, lessonComplete: true };
  }
  if (shouldAdvance) {
    return { stepIndex: currentState.stepIndex + 1, phase: 'teach', deeperTurnCount: 0, lessonComplete: false };
  }
  return {
    stepIndex: currentState.stepIndex,
    phase: currentState.phase,
    deeperTurnCount: currentState.phase === 'feedback_deeper' ? currentState.deeperTurnCount + 1 : currentState.deeperTurnCount,
    lessonComplete: false,
  };
}

async function requestLessonTurn({
  sessionId,
  lessonCode,
  dynamicVersionId,
  runtimeVariant,
  lessonPromptProfile,
  chatMode,
  state,
  thread,
  message,
}) {
  const response = await fetch(`${baseUrl}/api/simple-chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      message,
      thread,
      chatMode,
      lessonCode,
      dynamicVersionId,
      lessonStepIndex: state.stepIndex,
      lessonSectionPhase: state.phase,
      lessonDeeperTurnCount: state.deeperTurnCount,
      runtimeVariant,
      lessonPromptProfile,
      attachment: null,
    }),
  });

  const assistantText = await response.text();
  const headers = {
    systemInstruction: decodeHeader(response.headers.get('x-simple-chatbot-system-instruction')),
    finishReason: decodeHeader(response.headers.get('x-simple-chatbot-finish-reason')),
    stepIndex: decodeNumberHeader(response.headers.get('x-simple-chatbot-lesson-step-index')),
    stepTitle: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-title')),
    stepStage: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-stage')),
    stepRole: decodeHeader(response.headers.get('x-simple-chatbot-lesson-step-role')),
    lessonCompletionMode: decodeHeader(response.headers.get('x-simple-chatbot-lesson-completion-mode')),
    lessonStepTotal: decodeNumberHeader(response.headers.get('x-simple-chatbot-lesson-step-total')),
    feedbackPhase: response.headers.get('x-simple-chatbot-feedback-phase') || '',
    feedbackDeeperTurnCount: decodeNumberHeader(response.headers.get('x-simple-chatbot-feedback-deeper-turn-count')),
    progressionGate: response.headers.get('x-simple-chatbot-progression-gate') || '',
    feedbackResolved: response.headers.get('x-simple-chatbot-feedback-resolved') || '',
    feedbackNext: response.headers.get('x-simple-chatbot-feedback-next') || '',
    autoAdvance: response.headers.get('x-simple-chatbot-auto-advance') || '',
    nextStepId: decodeHeader(response.headers.get('x-simple-chatbot-next-step-id')),
    nextStepIndex: decodeNumberHeader(response.headers.get('x-simple-chatbot-next-step-index')),
    nextStepRole: decodeHeader(response.headers.get('x-simple-chatbot-next-step-role')),
    nextStepStage: decodeHeader(response.headers.get('x-simple-chatbot-next-step-stage')),
    runtimeVariant: response.headers.get('x-simple-chatbot-runtime-variant') || '',
    lessonPromptProfile: decodeHeader(response.headers.get('x-simple-chatbot-lesson-prompt-profile')) || 'baseline',
    challengeDetected: response.headers.get('x-simple-chatbot-challenge-detected') === 'true',
    replyClass: response.headers.get('x-simple-chatbot-reply-class') || '',
    userId: decodeHeader(response.headers.get('x-simple-chatbot-user-id')),
    profileFound: response.headers.get('x-simple-chatbot-profile-found') === 'true',
    attachmentFilename: decodeHeader(response.headers.get('x-simple-chatbot-attachment-filename')),
    attachmentChars: decodeNumberHeader(response.headers.get('x-simple-chatbot-attachment-chars')),
    chatMode: response.headers.get('x-simple-chatbot-chat-mode') || '',
  };

  return {
    status: response.status,
    ok: response.ok,
    assistantText,
    headers,
  };
}

function evaluateTurnChecks({ turnConfig, turnResult }) {
  const issues = [];
  const checks = turnConfig.checks ?? {};
  const reply = turnResult.assistantText ?? '';

  if (checks.headerEquals) {
    for (const [key, expected] of Object.entries(checks.headerEquals)) {
      const actual = turnResult.headers[key];
      if (String(actual) !== String(expected)) {
        issues.push(`header ${key} expected "${expected}" but got "${actual}"`);
      }
    }
  }

  if (Array.isArray(checks.replyIncludesAll)) {
    for (const expected of checks.replyIncludesAll) {
      if (!reply.toLowerCase().includes(String(expected).toLowerCase())) {
        issues.push(`reply missing required text "${expected}"`);
      }
    }
  }

  if (Array.isArray(checks.replyIncludesAny) && checks.replyIncludesAny.length > 0) {
    const matched = checks.replyIncludesAny.some((expected) =>
      reply.toLowerCase().includes(String(expected).toLowerCase())
    );
    if (!matched) {
      issues.push(`reply did not include any of: ${checks.replyIncludesAny.join(', ')}`);
    }
  }

  if (Array.isArray(checks.replyNotIncludes)) {
    for (const banned of checks.replyNotIncludes) {
      if (reply.toLowerCase().includes(String(banned).toLowerCase())) {
        issues.push(`reply included banned text "${banned}"`);
      }
    }
  }

  if (Number.isInteger(checks.minNumberedQuestionCount)) {
    const questionCount = countNumberedQuestions(reply);
    if (questionCount < checks.minNumberedQuestionCount) {
      issues.push(`reply had ${questionCount} numbered questions; expected at least ${checks.minNumberedQuestionCount}`);
    }
  }

  if (Number.isInteger(checks.exactNumberedQuestionCount)) {
    const questionCount = countNumberedQuestions(reply);
    if (questionCount !== checks.exactNumberedQuestionCount) {
      issues.push(`reply had ${questionCount} numbered questions; expected exactly ${checks.exactNumberedQuestionCount}`);
    }
  }

  if (Number.isInteger(checks.maxQuestionMarkCount)) {
    const questionMarkCount = (reply.match(/\?/g) ?? []).length;
    if (questionMarkCount > checks.maxQuestionMarkCount) {
      issues.push(`reply had ${questionMarkCount} question marks; max is ${checks.maxQuestionMarkCount}`);
    }
  }

  if (checks.noCurriculumReset === true && hasCurriculumReset(reply)) {
    issues.push('reply appears to reset to curriculum/Step 0 language mid-lesson');
  }

  if (checks.noFillerTransition === true && hasFillerTransitionReply(reply)) {
    issues.push('reply used a filler-only transition instead of a concrete next task or clean close');
  }

  if (Number.isInteger(checks.maxNameMentions)) {
    const mentionCount = countNameMentions(reply);
    if (mentionCount > checks.maxNameMentions) {
      issues.push(`reply mentioned learner name ${mentionCount} times; max is ${checks.maxNameMentions}`);
    }
  }

  return issues;
}

function computeTurnMetrics(turnResult) {
  const reply = turnResult.assistantText ?? '';
  return {
    replyLength: reply.length,
    numberedQuestionCount: countNumberedQuestions(reply),
    questionMarkCount: (reply.match(/\?/g) ?? []).length,
    nameMentions: countNameMentions(reply),
    cannedPhraseHits: countCannedPhrases(reply),
    curriculumResetDetected: hasCurriculumReset(reply),
  };
}

async function fetchLoggedSessionArtifacts(sessionId) {
  try {
    const supabase = await createSupabaseAdminClient();
    if (!supabase) return null;

    const { data: sessionRows, error: sessionError } = await supabase
      .from('dgv2_sessions')
      .select('session_json')
      .eq('id', sessionId)
      .limit(1)
      .maybeSingle();
    if (sessionError || !sessionRows?.session_json) {
      return null;
    }

    const { data: turnRows } = await supabase
      .from('dgv2_session_turns')
      .select('turn_index, role, kind, content_text, turn_json, created_at')
      .eq('session_id', sessionId)
      .order('turn_index', { ascending: true });

    const { data: eventRows } = await supabase
      .from('dgv2_session_events')
      .select('event_index, event_type, payload_json, created_at')
      .eq('session_id', sessionId)
      .order('event_index', { ascending: true });

    return {
      session: sessionRows.session_json,
      turns: turnRows ?? [],
      events: eventRows ?? [],
    };
  } catch {
    return null;
  }
}

async function writeScenarioArtifacts({ outputDir, scenarioId, turnArtifacts, scenarioResult, dbArtifacts }) {
  const scenarioDir = path.join(outputDir, sanitizeSegment(scenarioId));
  await ensureDir(scenarioDir);
  await fs.writeFile(path.join(scenarioDir, 'result.json'), JSON.stringify(scenarioResult, null, 2), 'utf8');
  if (dbArtifacts) {
    await fs.writeFile(path.join(scenarioDir, 'db-session.json'), JSON.stringify(dbArtifacts, null, 2), 'utf8');
  }
  for (const turnArtifact of turnArtifacts) {
    const filename = `${String(turnArtifact.index + 1).padStart(2, '0')}-${sanitizeSegment(turnArtifact.kind)}.json`;
    await fs.writeFile(path.join(scenarioDir, filename), JSON.stringify(turnArtifact, null, 2), 'utf8');
  }
}

async function runScenario({ scenario, outputDir }) {
  const lesson = await loadLessonByCode(scenario.lessonCode);
  const dynamicVersionId = scenario.dynamicVersionId || (await resolveLessonVersionId(scenario.lessonCode));
  const runtimeVariant = scenario.runtimeVariant || 'lean_feedback_v1';
  const lessonPromptProfile = process.env.RUNTIME_PROMPT_PROFILE || scenario.lessonPromptProfile || 'baseline';
  const chatMode = process.env.RUNTIME_PROMPT_CHAT_MODE || scenario.chatMode || 'lesson';
  const sessionId = `runtime-eval-${sanitizeSegment(scenario.id)}-${Date.now()}`;
  let state = buildInitialState(lesson, scenario);
  let thread = [];
  const turnArtifacts = [];
  const issues = [];

  for (let index = 0; index < scenario.turns.length; index += 1) {
    const turnConfig = scenario.turns[index];
    if (turnConfig.stateOverride) {
      state = {
        stepIndex: resolveStepIndex(lesson, turnConfig.stateOverride.stepSelector),
        phase: turnConfig.stateOverride.phase ?? state.phase,
        deeperTurnCount: Number.isInteger(turnConfig.stateOverride.deeperTurnCount)
          ? turnConfig.stateOverride.deeperTurnCount
          : state.deeperTurnCount,
      };
    }

    const stateBefore = { ...state };
    const turnResult = await requestLessonTurn({
      sessionId,
      lessonCode: scenario.lessonCode,
      dynamicVersionId,
      runtimeVariant,
      lessonPromptProfile,
      chatMode,
      state,
      thread,
      message: turnConfig.message,
    });

    if (!turnResult.ok) {
      issues.push(`turn ${index + 1} request failed with ${turnResult.status}`);
    }

    const turnIssues = evaluateTurnChecks({ turnConfig, turnResult }).map((issue) => `turn ${index + 1}: ${issue}`);
    issues.push(...turnIssues);

    const turnArtifact = {
      index,
      kind: 'user_turn',
      message: turnConfig.message,
      stateBefore,
      result: turnResult,
      metrics: computeTurnMetrics(turnResult),
      checks: turnConfig.checks ?? {},
      issues: turnIssues,
    };
    turnArtifacts.push(turnArtifact);

    thread.push({ role: 'user', text: turnConfig.message });
    if (turnResult.assistantText) {
      thread.push({ role: 'assistant', text: turnResult.assistantText });
    }

    if (turnResult.headers.autoAdvance === 'true' && Number.isFinite(turnResult.headers.nextStepIndex)) {
      const followupState = {
        stepIndex: turnResult.headers.nextStepIndex,
        phase: 'teach',
        deeperTurnCount: 0,
      };
      const followupResult = await requestLessonTurn({
        sessionId,
        lessonCode: scenario.lessonCode,
        dynamicVersionId,
        runtimeVariant,
        lessonPromptProfile,
        chatMode,
        state: followupState,
        thread,
        message: '',
      });
      const followupArtifact = {
        index,
        kind: 'auto_advance_followup',
        message: '',
        stateBefore: followupState,
        result: followupResult,
        metrics: computeTurnMetrics(followupResult),
        checks: {},
        issues: followupResult.ok ? [] : [`auto-advance followup failed with ${followupResult.status}`],
      };
      turnArtifacts.push(followupArtifact);
      if (!followupResult.ok) {
        issues.push(`turn ${index + 1} auto-advance followup failed with ${followupResult.status}`);
      }
      if (followupResult.assistantText) {
        thread.push({ role: 'assistant', text: followupResult.assistantText });
      }
      state = applyLessonResponseState(followupResult, followupState, chatMode);
      continue;
    }

    state = applyLessonResponseState(turnResult, stateBefore, chatMode);
  }

  const dbArtifacts = await fetchLoggedSessionArtifacts(sessionId);
  const totals = turnArtifacts.reduce(
    (accumulator, artifact) => {
      accumulator.replyLength += artifact.metrics.replyLength;
      accumulator.numberedQuestionCount += artifact.metrics.numberedQuestionCount;
      accumulator.nameMentions += artifact.metrics.nameMentions;
      accumulator.cannedPhraseHits += artifact.metrics.cannedPhraseHits;
      accumulator.curriculumResetDetections += artifact.metrics.curriculumResetDetected ? 1 : 0;
      return accumulator;
    },
    {
      replyLength: 0,
      numberedQuestionCount: 0,
      nameMentions: 0,
      cannedPhraseHits: 0,
      curriculumResetDetections: 0,
    }
  );

  const scenarioResult = {
    scenarioId: scenario.id,
    lessonCode: scenario.lessonCode,
    runtimeVariant,
    lessonPromptProfile,
    chatMode,
    dynamicVersionId,
    description: scenario.description ?? '',
    pass: issues.length === 0,
    issueCount: issues.length,
    issues,
    finalState: state,
    turnCount: turnArtifacts.length,
    totals,
    sessionId,
  };

  await writeScenarioArtifacts({
    outputDir,
    scenarioId: scenario.id,
    turnArtifacts,
    scenarioResult,
    dbArtifacts,
  });

  return scenarioResult;
}

function buildMarkdownSummary({ runStamp, results }) {
  const lines = [
    `# Lesson Runtime Prompt Eval`,
    '',
    `- run: \`${runStamp}\``,
    `- scenarios: \`${results.length}\``,
    `- passed: \`${results.filter((result) => result.pass).length}\``,
    `- failed: \`${results.filter((result) => !result.pass).length}\``,
    '',
    '| Scenario | Lesson | Mode | Profile | Pass | Issues | Name mentions | Canned phrase hits | Curriculum resets |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const result of results) {
    lines.push(
      `| ${result.scenarioId} | ${result.lessonCode} | ${result.chatMode} | ${result.lessonPromptProfile} | ${result.pass ? 'yes' : 'no'} | ${result.issueCount} | ${result.totals.nameMentions} | ${result.totals.cannedPhraseHits} | ${result.totals.curriculumResetDetections} |`
    );
  }

  for (const result of results.filter((entry) => entry.issues.length > 0)) {
    lines.push('', `## ${result.scenarioId}`, '');
    for (const issue of result.issues) {
      lines.push(`- ${issue}`);
    }
  }

  return lines.join('\n');
}

async function main() {
  const response = await fetch(`${baseUrl}/api/simple-chatbot`);
  if (!response.ok) {
    throw new Error(`simple-chatbot API health check failed at ${baseUrl}/api/simple-chatbot`);
  }

  const scenarioPack = await readJson(scenarioPath);
  const scenarios = Array.isArray(scenarioPack?.scenarios) ? scenarioPack.scenarios : [];
  if (scenarios.length === 0) {
    throw new Error(`No scenarios found in ${scenarioPath}.`);
  }

  const requestedIds = (process.env.RUNTIME_PROMPT_SCENARIO_IDS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const selectedScenarios =
    requestedIds.length > 0
      ? scenarios.filter((scenario) => requestedIds.includes(scenario.id))
      : scenarios;
  if (selectedScenarios.length === 0) {
    throw new Error(`No matching scenarios found for ${requestedIds.join(', ')}.`);
  }

  const runStamp = stamp();
  const outputDir = path.join(outputRoot, runStamp);
  await ensureDir(outputDir);

  const results = [];
  for (const scenario of selectedScenarios) {
    const result = await runScenario({ scenario, outputDir });
    results.push(result);
  }

  const summary = {
    startedAt: runStamp,
    baseUrl,
    scenarioPath,
    scenarioCount: results.length,
    passed: results.filter((result) => result.pass).length,
    failed: results.filter((result) => !result.pass).length,
    results,
  };

  await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  await fs.writeFile(path.join(outputDir, 'summary.md'), buildMarkdownSummary({ runStamp, results }), 'utf8');

  console.log(JSON.stringify(summary, null, 2));
  if (results.some((result) => !result.pass)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('[runLessonRuntimePromptEval] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
