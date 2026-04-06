import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const artifactRoot = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');
const versionStorePath = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');
const outputRoot = path.join(process.cwd(), '.runtime', 'lesson-playbook-runs');

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
        if (!(key in envMap)) envMap[key] = value;
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
  if (!supabaseUrl || !serviceRoleKey) return null;
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
    deeperTurnCount:
      currentState.phase === 'feedback_deeper'
        ? currentState.deeperTurnCount + 1
        : currentState.deeperTurnCount,
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
    lessonPromptProfile:
      decodeHeader(response.headers.get('x-simple-chatbot-lesson-prompt-profile')) || 'baseline',
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
    if (sessionError || !sessionRows?.session_json) return null;

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

function parseArgs(argv) {
  const args = {
    lessonCode: '',
    playbook: '',
    dynamicVersionId: '',
    chatMode: 'lesson_light',
    runtimeVariant: 'lean_feedback_v1',
    lessonPromptProfile: 'baseline',
    startStepIndex: 0,
    startPhase: 'teach',
    startDeeperTurnCount: 0,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (token === '--lessonCode') {
      args.lessonCode = String(value || '').trim().toUpperCase();
      index += 1;
    } else if (token === '--playbook') {
      args.playbook = String(value || '').trim();
      index += 1;
    } else if (token === '--dynamicVersionId') {
      args.dynamicVersionId = String(value || '').trim();
      index += 1;
    } else if (token === '--chatMode') {
      args.chatMode = String(value || '').trim() || args.chatMode;
      index += 1;
    } else if (token === '--runtimeVariant') {
      args.runtimeVariant = String(value || '').trim() || args.runtimeVariant;
      index += 1;
    } else if (token === '--lessonPromptProfile') {
      args.lessonPromptProfile = String(value || '').trim() || args.lessonPromptProfile;
      index += 1;
    } else if (token === '--startStepIndex') {
      args.startStepIndex = Number.parseInt(String(value || '0'), 10);
      index += 1;
    } else if (token === '--startPhase') {
      args.startPhase = String(value || '').trim() || args.startPhase;
      index += 1;
    } else if (token === '--startDeeperTurnCount') {
      args.startDeeperTurnCount = Number.parseInt(String(value || '0'), 10);
      index += 1;
    }
  }

  return args;
}

async function readPlaybookMessages(filePath) {
  const raw = stripBom(await fs.readFile(filePath, 'utf8'));
  return raw
    .split(/^\s*---\s*$/gm)
    .map((block) => block.trim())
    .filter(Boolean);
}

function buildTranscript(turnArtifacts) {
  const parts = [];
  for (const artifact of turnArtifacts) {
    if (artifact.kind === 'user_turn') {
      parts.push('USER', artifact.message || '', '', '---', '', 'ASSISTANT', artifact.result.assistantText || '', '', '---', '');
    } else if (artifact.kind === 'auto_advance_followup' && artifact.result.assistantText) {
      parts.push('ASSISTANT', artifact.result.assistantText, '', '---', '');
    }
  }
  return parts.join('\n').trim() + '\n';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.lessonCode) throw new Error('--lessonCode is required');
  if (!args.playbook) throw new Error('--playbook is required');

  const health = await fetch(`${baseUrl}/api/simple-chatbot`);
  if (!health.ok) {
    throw new Error(`simple-chatbot API health check failed at ${baseUrl}/api/simple-chatbot`);
  }

  const lesson = await loadLessonByCode(args.lessonCode);
  const dynamicVersionId = args.dynamicVersionId || (await resolveLessonVersionId(args.lessonCode));
  const messages = await readPlaybookMessages(path.resolve(process.cwd(), args.playbook));
  if (messages.length === 0) {
    throw new Error(`No user messages found in ${args.playbook}`);
  }

  const sessionId = `playbook-${sanitizeSegment(args.lessonCode)}-${Date.now()}`;
  const runStamp = stamp();
  const outputDir = path.join(outputRoot, `${runStamp}-${sanitizeSegment(args.lessonCode)}`);
  await ensureDir(outputDir);

  let state = {
    stepIndex: Number.isInteger(args.startStepIndex) ? args.startStepIndex : 0,
    phase: args.startPhase || 'teach',
    deeperTurnCount: Number.isInteger(args.startDeeperTurnCount) ? args.startDeeperTurnCount : 0,
    lessonComplete: false,
  };
  let thread = [];
  const turnArtifacts = [];

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index];
    const stateBefore = { ...state };
    const result = await requestLessonTurn({
      sessionId,
      lessonCode: args.lessonCode,
      dynamicVersionId,
      runtimeVariant: args.runtimeVariant,
      lessonPromptProfile: args.lessonPromptProfile,
      chatMode: args.chatMode,
      state,
      thread,
      message,
    });

    const artifact = {
      index,
      kind: 'user_turn',
      message,
      stateBefore,
      result,
    };
    turnArtifacts.push(artifact);

    thread.push({ role: 'user', text: message });
    if (result.assistantText) {
      thread.push({ role: 'assistant', text: result.assistantText });
    }

    if (result.headers.autoAdvance === 'true' && Number.isFinite(result.headers.nextStepIndex)) {
      const followupState = {
        stepIndex: result.headers.nextStepIndex,
        phase: 'teach',
        deeperTurnCount: 0,
      };
      const followupResult = await requestLessonTurn({
        sessionId,
        lessonCode: args.lessonCode,
        dynamicVersionId,
        runtimeVariant: args.runtimeVariant,
        lessonPromptProfile: args.lessonPromptProfile,
        chatMode: args.chatMode,
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
      };
      turnArtifacts.push(followupArtifact);
      if (followupResult.assistantText) {
        thread.push({ role: 'assistant', text: followupResult.assistantText });
      }
      state = applyLessonResponseState(followupResult, followupState, args.chatMode);
      continue;
    }

    state = applyLessonResponseState(result, stateBefore, args.chatMode);
    if (state.lessonComplete) break;
  }

  const dbArtifacts = process.env.LESSON_PLAYBOOK_SKIP_DB === '1'
    ? null
    : await fetchLoggedSessionArtifacts(sessionId);
  const transcript = buildTranscript(turnArtifacts);
  const summary = {
    startedAt: runStamp,
    baseUrl,
    lessonCode: args.lessonCode,
    dynamicVersionId,
    chatMode: args.chatMode,
    runtimeVariant: args.runtimeVariant,
    lessonPromptProfile: args.lessonPromptProfile,
    sessionId,
    playbookPath: path.resolve(process.cwd(), args.playbook),
    messageCount: messages.length,
    finalState: state,
    turnCount: turnArtifacts.length,
    lessonStepTotal: lesson.steps.length,
  };

  await fs.writeFile(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
  await fs.writeFile(path.join(outputDir, 'transcript.txt'), transcript, 'utf8');
  if (dbArtifacts) {
    await fs.writeFile(path.join(outputDir, 'db-session.json'), JSON.stringify(dbArtifacts, null, 2), 'utf8');
  }
  for (const artifact of turnArtifacts) {
    const filename = `${String(artifact.index + 1).padStart(2, '0')}-${sanitizeSegment(artifact.kind)}.json`;
    await fs.writeFile(path.join(outputDir, filename), JSON.stringify(artifact, null, 2), 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        ...summary,
        outputDir,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('[runLessonPlaybook] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
