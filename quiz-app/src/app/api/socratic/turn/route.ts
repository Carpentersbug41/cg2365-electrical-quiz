import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import {
  extractJson,
  preprocessToValidJson,
  repairMalformedJsonStrings,
  safeJsonParse,
  validateLLMResponse,
} from '@/lib/generation/utils';
import { findLessonFile } from '@/lib/generation/lessonDetector';
import { Lesson } from '@/data/lessons/types';
import {
  deterministicFallbackEvaluation,
  deterministicFallbackQuestion,
  EvaluatePayload,
  NextQuestionPayload,
  sanitizeSocraticQuestionText,
  salvageSocraticPayload,
} from '@/lib/socratic/fallbacks';

type QuestionIntent = 'diagnose' | 'repair' | 'verify' | 'transfer';

type LessonMisconception = {
  code: string;
  misconception: string;
  correction: string;
  relatedAC: string | null;
};

type TurnHistoryItem = {
  question: string;
  answer: string;
  level: number;
  correct: boolean;
  score?: 0 | 1 | 2;
  misconceptionCode?: string | null;
  intent?: QuestionIntent;
};

type TurnRequest = {
  lessonId?: string;
  blockId?: string;
  questionCount?: number;
  startLevel?: number;
  askedCount?: number;
  history?: TurnHistoryItem[];
  previousQuestion?: string;
  previousLevel?: number;
  userAnswer?: string;
};

type SimpleTurnPayload = {
  feedback?: string;
  isCorrect?: boolean;
  score?: 0 | 1 | 2;
  nextQuestion?: string;
  nextIntent?: 'diagnose' | 'repair' | 'verify' | 'transfer';
};

type SingleCallTurnPayload = {
  feedback?: string;
  score?: 0 | 1 | 2;
  isCorrect?: boolean;
  nextLevel?: number;
  nextQuestion?: string;
};

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;

function clampLevel(level: number): number {
  return Math.max(1, Math.min(4, Math.round(level)));
}

function clampQuestionCount(questionCount: number): number {
  return Math.max(8, Math.min(10, Math.round(questionCount)));
}

function sanitizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeMisconceptionCode(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_');
}

function buildStableMisconceptionCode(rawCode: string, fallbackText: string, index: number): string {
  const fromRaw = normalizeMisconceptionCode(rawCode);
  if (fromRaw) return fromRaw.slice(0, 48);

  const fallback = normalizeMisconceptionCode(fallbackText)
    .split('_')
    .slice(0, 5)
    .join('_');
  if (fallback) return fallback.slice(0, 48);

  return `MISCONCEPTION_${index + 1}`;
}

function clampRubricScore(score: unknown): 0 | 1 | 2 {
  const parsed = Number(score);
  if (parsed >= 2) return 2;
  if (parsed >= 1) return 1;
  return 0;
}

type SessionProgressStats = {
  totalAnswered: number;
  totalCorrect: number;
  correctStreak: number;
  recentAccuracy: number;
  maxCorrectLevel: number;
  maxStableCorrectLevel: number;
};

function getSessionProgressStats(history: TurnHistoryItem[]): SessionProgressStats {
  const totalAnswered = history.length;
  const totalCorrect = history.filter((item) => item.correct).length;
  let correctStreak = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (!history[i].correct) break;
    correctStreak += 1;
  }

  const recent = history.slice(-4);
  const recentCorrect = recent.filter((item) => item.correct).length;
  const recentAccuracy = recent.length > 0 ? recentCorrect / recent.length : 0;

  const correctByLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const item of history) {
    if (item.correct) {
      const level = clampLevel(item.level);
      correctByLevel[level] = (correctByLevel[level] ?? 0) + 1;
    }
  }

  const maxCorrectLevel = Math.max(
    ...Object.entries(correctByLevel)
      .filter(([, count]) => count > 0)
      .map(([level]) => Number(level)),
    1
  );
  const maxStableCorrectLevel = Math.max(
    ...Object.entries(correctByLevel)
      .filter(([, count]) => count >= 2)
      .map(([level]) => Number(level)),
    1
  );

  return {
    totalAnswered,
    totalCorrect,
    correctStreak,
    recentAccuracy,
    maxCorrectLevel,
    maxStableCorrectLevel,
  };
}

function computeOpeningLevel(startLevel: number, history: TurnHistoryItem[]): number {
  if (history.length === 0) return startLevel;
  const stats = getSessionProgressStats(history);

  // Resume around demonstrated capability when history is already available.
  if (stats.maxStableCorrectLevel >= 2) {
    return clampLevel(Math.max(startLevel, stats.maxStableCorrectLevel));
  }
  if (stats.maxCorrectLevel >= 2 && stats.recentAccuracy >= 0.5) {
    return clampLevel(Math.max(startLevel, stats.maxCorrectLevel));
  }

  return startLevel;
}

function getActiveMisconception(history: TurnHistoryItem[]): string | null {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const item = history[i];
    if (!item.correct && item.misconceptionCode) {
      return sanitizeText(item.misconceptionCode) || null;
    }
  }
  return null;
}

function hasTwoStrongCorrectAtLevel(history: TurnHistoryItem[], level: number): boolean {
  const strongCorrectCount = history.filter((item) => item.level === level && (item.score ?? (item.correct ? 2 : 0)) >= 2).length;
  return strongCorrectCount >= 2;
}

function hasLevelOnePromotionSignal(history: TurnHistoryItem[]): boolean {
  const recentLevelOne = history.filter((item) => item.level === 1).slice(-3);
  if (recentLevelOne.length < 2) return false;
  const partialOrBetterCount = recentLevelOne.filter((item) => (item.score ?? (item.correct ? 2 : 0)) >= 1).length;
  const strongCount = recentLevelOne.filter((item) => (item.score ?? (item.correct ? 2 : 0)) >= 2).length;
  return partialOrBetterCount >= 2 && strongCount >= 1;
}

function shouldDemoteLevel(history: TurnHistoryItem[], level: number): boolean {
  const recentAtLevel = history.filter((item) => item.level === level).slice(-2);
  if (recentAtLevel.length < 2) return false;
  return recentAtLevel.every((item) => (item.score ?? (item.correct ? 2 : 0)) === 0);
}

function selectQuestionIntent(
  level: number,
  history: TurnHistoryItem[],
  activeMisconception: string | null
): QuestionIntent {
  const stats = getSessionProgressStats(history);
  const lastTurn = history[history.length - 1];

  if (activeMisconception && lastTurn && !lastTurn.correct) {
    return 'repair';
  }
  if (level >= 4 && stats.recentAccuracy >= 0.75) {
    return 'transfer';
  }
  if (stats.recentAccuracy >= 0.6) {
    return 'verify';
  }
  return 'diagnose';
}

function nextLevelFromProgress(
  previousLevel: number,
  score: 0 | 1 | 2,
  historyWithCurrent: TurnHistoryItem[]
): number {
  const isCorrect = score >= 2;
  const stats = getSessionProgressStats(historyWithCurrent);
  let next = previousLevel;

  // Promotion requires two strong correct responses at current level.
  if (isCorrect && hasTwoStrongCorrectAtLevel(historyWithCurrent, previousLevel)) {
    next = clampLevel(previousLevel + 1);
  } else if (previousLevel === 1 && score >= 1 && hasLevelOnePromotionSignal(historyWithCurrent)) {
    // Avoid over-anchoring at Level 1 when learner shows repeated near/strong correctness.
    next = 2;
  } else if (score === 0 && shouldDemoteLevel(historyWithCurrent, previousLevel)) {
    // Demote only after repeated strong misses at level.
    next = clampLevel(previousLevel - 1);
  }

  // Avoid dropping too aggressively when learner has already shown stable higher-level correctness.
  if (score === 0 && stats.maxStableCorrectLevel >= previousLevel && previousLevel > 1) {
    next = previousLevel;
  }

  // Keep a soft floor once a level has been shown repeatedly correct.
  if (stats.maxStableCorrectLevel >= 2 && next < stats.maxStableCorrectLevel - 1) {
    next = clampLevel(stats.maxStableCorrectLevel - 1);
  }

  return clampLevel(next);
}

function compact(value: string, limit = 320): string {
  return value.length > limit ? `${value.slice(0, limit)}...` : value;
}

function getFastThinkingOverrides(modelName: string): Record<string, unknown> {
  const normalized = modelName.toLowerCase();
  if (normalized.includes('gemini-3-flash')) {
    return {
      thinkingConfig: {
        thinkingLevel: 'low',
      },
    };
  }
  if (normalized.includes('gemini-2.5-flash')) {
    return {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    };
  }
  return {};
}

function getSocraticModelName(): string {
  const override = sanitizeText(process.env.SOCRATIC_GEMINI_MODEL);
  if (override) {
    return override;
  }
  return getGeminiModelWithDefault();
}

function extractLessonMisconceptions(lesson: Lesson): LessonMisconception[] {
  const metadata = (lesson as unknown as { metadata?: Record<string, unknown> }).metadata ?? {};
  const rawMisconceptions = Array.isArray(metadata.misconceptions)
    ? (metadata.misconceptions as Array<Record<string, unknown>>)
    : [];

  const seenCodes = new Set<string>();
  const parsed = rawMisconceptions
    .map((entry, index) => {
      const misconception = sanitizeText(entry.misconception);
      const correction = sanitizeText(entry.correction);
      const relatedAC = sanitizeText(entry.relatedAC) || null;
      if (!misconception || !correction) return null;

      let code = buildStableMisconceptionCode(relatedAC ?? '', misconception, index);
      while (seenCodes.has(code)) {
        code = `${code}_${index + 1}`;
      }
      seenCodes.add(code);

      return {
        code,
        misconception,
        correction,
        relatedAC,
      } as LessonMisconception;
    })
    .filter((item): item is LessonMisconception => item !== null);

  return parsed.slice(0, 12);
}

function buildLessonSummary(lesson: Lesson, lessonMisconceptions: LessonMisconception[]): string {
  const learningOutcomes = lesson.learningOutcomes
    .slice(0, 6)
    .map((outcome, index) => `${index + 1}. ${sanitizeText(outcome)}`)
    .join('\n');

  const vocabLines = lesson.blocks
    .filter((block) => block.type === 'vocab')
    .flatMap((block) => {
      const terms = (block.content as { terms?: Array<{ term: string; definition: string }> }).terms ?? [];
      return terms.slice(0, 20).map((entry) => `- ${compact(entry.term, 40)}: ${compact(entry.definition, 110)}`);
    });

  const conceptLines = lesson.blocks
    .filter((block) => block.type === 'explanation' || block.type === 'worked-example' || block.type === 'guided-practice')
    .flatMap((block) => {
      const content = block.content as unknown as Record<string, unknown>;
      const title = sanitizeText(content.title);
      const body =
        sanitizeText(content.content) ||
        sanitizeText(content.problem) ||
        sanitizeText(content.given) ||
        '';
      if (!title && !body) return [];
      return [`- ${compact(`${title} ${body}`.trim(), 180)}`];
    })
    .slice(0, 30);

  const misconceptionLines = lessonMisconceptions.map(
    (item) => `- ${item.code}: ${compact(item.misconception, 120)} | Correction: ${compact(item.correction, 140)}`
  );

  return [
    `Lesson: ${lesson.title} (${lesson.id})`,
    'Learning outcomes:',
    learningOutcomes || '- None provided.',
    'Key vocabulary:',
    vocabLines.length > 0 ? vocabLines.join('\n') : '- None provided.',
    'Key taught concepts:',
    conceptLines.length > 0 ? conceptLines.join('\n') : '- None provided.',
    'Known misconception map:',
    misconceptionLines.length > 0 ? misconceptionLines.join('\n') : '- None provided.',
  ].join('\n');
}

function buildLiteLessonContext(lesson: Lesson): string {
  const outcomes = lesson.learningOutcomes
    .slice(0, 4)
    .map((outcome, index) => `${index + 1}. ${sanitizeText(outcome)}`)
    .join('\n');

  const vocab = lesson.blocks
    .filter((block) => block.type === 'vocab')
    .flatMap((block) => {
      const terms = (block.content as { terms?: Array<{ term: string; definition: string }> }).terms ?? [];
      return terms
        .slice(0, 6)
        .map((entry) => `${sanitizeText(entry.term)}: ${compact(sanitizeText(entry.definition), 60)}`);
    })
    .slice(0, 6)
    .join('\n');

  return [
    `Lesson: ${sanitizeText(lesson.title)} (${sanitizeText(lesson.id)})`,
    'Outcomes:',
    outcomes || '- None',
    'Key vocab:',
    vocab || '- None',
  ].join('\n');
}

async function generateJson<T>(prompt: string): Promise<T> {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  const client = await llmClientPromise;
  const modelName = getSocraticModelName();
  const generationConfig = {
    temperature: 0.3,
    maxOutputTokens: 240,
    responseMimeType: 'application/json' as const,
    ...getFastThinkingOverrides(modelName),
  };
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig,
  });

  let lastError = 'Failed to parse model response.';

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  });

  const raw = result.response.text();
  const validation = validateLLMResponse(raw);
  if (!validation.valid) {
    throw new Error(validation.error ?? 'Invalid LLM response format.');
  }

  const extracted = extractJson(raw);
  const candidates = [
    extracted,
    preprocessToValidJson(extracted),
    repairMalformedJsonStrings(preprocessToValidJson(extracted)),
  ];

  for (const candidate of candidates) {
    const parsed = safeJsonParse<T>(candidate);
    if (parsed.success && parsed.data) {
      return parsed.data;
    }
    lastError = parsed.error ?? lastError;
  }

  throw new Error(lastError);
}

async function loadLesson(lessonId: string): Promise<Lesson> {
  const lessonPath = findLessonFile(lessonId);
  if (!lessonPath) {
    throw new Error(`Lesson file not found for ${lessonId}`);
  }

  const raw = fs.readFileSync(lessonPath, 'utf8');
  return JSON.parse(raw) as Lesson;
}

async function generateQuestion(
  lessonSummary: string,
  level: number,
  intent: QuestionIntent,
  activeMisconception: string | null,
  askedCount: number,
  questionCount: number,
  history: TurnHistoryItem[],
  _lessonMisconceptions: LessonMisconception[],
  _profileInjection?: string
  ): Promise<{ question: string; intent: QuestionIntent }> {
  const recentHistory = history
    .slice(-2)
    .map((item, index) => `${index + 1}. Q: ${compact(item.question, 120)} | A: ${compact(item.answer, 120)}`)
    .join('\n');

  const prompt = `Ask the learner one short next question for this lesson chat.
Return strict JSON only: {"question":"...","intent":"diagnose|repair|verify|transfer"}.

Rules:
- One question only.
- Keep it short and clear.
- No markdown, no bullet points.
- Keep continuity with recent exchange.
- Use the requested level loosely as guidance.
- If active misconception exists, address it.

Progress: ${askedCount + 1} of ${questionCount}
Requested level: ${level}
Requested intent: ${intent}
Active misconception: ${activeMisconception || 'none'}
Recent exchange:
${recentHistory || 'None'}

Lesson context:
${lessonSummary}`;

  try {
    const payload = await generateJson<NextQuestionPayload>(prompt);
    const safeQuestion = sanitizeSocraticQuestionText(sanitizeText(payload.question));
    if (!safeQuestion) {
      throw new Error('Generated question was empty after sanitization.');
    }
    return {
      question: safeQuestion,
      intent,
    };
  } catch {
    try {
      if (!llmClientPromise) {
        llmClientPromise = createLLMClientWithFallback();
      }
      const client = await llmClientPromise;
      const model = client.getGenerativeModel({
        model: getGeminiModelWithDefault(),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      });
      const fallbackResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nIf JSON fails, return only the question text.` }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      });
      const salvaged = salvageSocraticPayload(fallbackResult.response.text(), 'question') as NextQuestionPayload;
      const safeQuestion = sanitizeSocraticQuestionText(sanitizeText(salvaged.question));
      if (safeQuestion) {
        return {
          question: safeQuestion,
          intent,
        };
      }
    } catch {
      // deterministic fallback below
    }
    return {
      question: deterministicFallbackQuestion(lessonSummary, level, intent),
      intent,
    };
  }
}

async function evaluateAnswer(
  lessonSummary: string,
  question: string,
  answer: string,
  level: number,
  lessonMisconceptions: LessonMisconception[],
  profileInjection?: string
): Promise<EvaluatePayload> {
  const profileSection = profileInjection
    ? `\nPROFILE (TOP PRIORITY FOR STYLE):\n${profileInjection}\nUse this for wording, tone, and pacing. Keep scoring rigor unchanged.`
    : '';
  const allowedCodes = new Set(lessonMisconceptions.map((item) => normalizeMisconceptionCode(item.code)).filter(Boolean));
  const misconceptionSection =
    lessonMisconceptions.length > 0
      ? lessonMisconceptions
          .map(
            (item) =>
              `- ${item.code}: misconception="${compact(item.misconception, 140)}"; correction="${compact(item.correction, 140)}"`
          )
          .join('\n')
      : '- NONE';

  const prompt = `Evaluate a student's answer to one Socratic question.
Return strict JSON only:
{"feedback":"...", "score":0, "isCorrect":false, "misconceptionCode":null, "evidenceQuote":"", "nextAction":"retry|advance|repair"}
${profileSection}

Marking rubric:
- 0 = incorrect / off-topic / no understanding
- 1 = partially correct but important gap remains
- 2 = conceptually correct and sufficient

Rules:
- Judge conceptual correctness against the lesson context.
- Accept equivalent phrasing when meaning is correct.
- Do not force an off-topic redirect; keep feedback natural in profile tone.
- Feedback must be short, specific to this answer, and written naturally in the profile style.
- Avoid stock/canned lines and avoid repeating fixed templates.
- No markdown.
- If score <= 1 and a mapped misconception applies, set misconceptionCode to one code from the allowed map.
- If score <= 1 and no mapped misconception fits, set misconceptionCode to "NONE".
- If score = 2, set misconceptionCode to null.
- evidenceQuote should be a short phrase from the learner answer supporting your score.

Question level: ${level}
Question: ${question}
Student answer: ${answer}
Allowed misconception map:
${misconceptionSection}

Lesson context:
${lessonSummary}`;

  try {
    const payload = await generateJson<EvaluatePayload>(prompt);
    const score = clampRubricScore(payload.score ?? (payload.isCorrect ? 2 : 0));
    const normalizedCode = normalizeMisconceptionCode(sanitizeText(payload.misconceptionCode ?? ''));
    const mappedCode =
      score >= 2 || !normalizedCode || normalizedCode === 'NONE' || !allowedCodes.has(normalizedCode)
        ? null
        : normalizedCode;
    return {
      feedback: sanitizeText(payload.feedback) || 'Thanks. Let us continue.',
      isCorrect: score >= 2,
      score,
      misconceptionCode: mappedCode,
      evidenceQuote: sanitizeText(payload.evidenceQuote ?? ''),
      nextAction: score >= 2 ? 'advance' : (mappedCode ? 'repair' : 'retry'),
    };
  } catch {
    try {
      if (!llmClientPromise) {
        llmClientPromise = createLLMClientWithFallback();
      }
      const client = await llmClientPromise;
      const model = client.getGenerativeModel({
        model: getGeminiModelWithDefault(),
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      });
      const fallbackResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${prompt}\n\nIf JSON fails, return plain text: FEEDBACK: ... | CORRECT: true/false` }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      });
      const salvaged = salvageSocraticPayload(fallbackResult.response.text(), 'evaluation') as EvaluatePayload;
      const safeFeedback = sanitizeText(salvaged.feedback);
      if (safeFeedback) {
        const score = clampRubricScore(salvaged.score ?? (salvaged.isCorrect ? 2 : 0));
        const normalizedCode = normalizeMisconceptionCode(sanitizeText(salvaged.misconceptionCode ?? ''));
        const mappedCode =
          score >= 2 || !normalizedCode || normalizedCode === 'NONE' || !allowedCodes.has(normalizedCode)
            ? null
            : normalizedCode;
        return {
          feedback: safeFeedback,
          isCorrect: score >= 2,
          score,
          misconceptionCode: mappedCode,
          evidenceQuote: sanitizeText(salvaged.evidenceQuote ?? ''),
          nextAction: score >= 2 ? 'advance' : (mappedCode ? 'repair' : 'retry'),
        };
      }
    } catch {
      // deterministic fallback below
    }
    return deterministicFallbackEvaluation(answer);
  }
}

async function evaluateAndGenerateSimpleTurn(
  lessonSummary: string,
  question: string,
  answer: string,
  level: number,
  askedCount: number,
  questionCount: number,
  history: TurnHistoryItem[],
  lessonMisconceptions: LessonMisconception[],
  profileInjection?: string
): Promise<{ feedback: string; isCorrect: boolean; score: 0 | 1 | 2; nextQuestion: string; nextIntent: QuestionIntent }> {
  const recentHistory = history
    .slice(-2)
    .map((item, index) => `${index + 1}. Q: ${compact(item.question, 110)} | A: ${compact(item.answer, 110)}`)
    .join('\n');

  const prompt = `You are a simple Q+A tutor. Evaluate the learner's last answer and ask exactly one next question.
Return strict JSON only:
{"feedback":"...","isCorrect":true,"score":2,"nextQuestion":"...","nextIntent":"diagnose|repair|verify|transfer"}

Rules:
- Keep it simple.
- feedback: max 1 short sentence.
- nextQuestion: one short clear question only.
- No markdown, no bullet points, no extra keys.

Progress: answered ${askedCount} of ${questionCount}
Previous question (level ${level}): ${question}
Learner answer: ${answer}
Recent exchange:
${recentHistory || 'None'}

Lesson context:
${lessonSummary}`;

  try {
    const payload = await generateJson<SimpleTurnPayload>(prompt);
    const score = clampRubricScore(payload.score ?? (payload.isCorrect ? 2 : 0));
    const rawIntent = sanitizeText(payload.nextIntent ?? '').toLowerCase();
    const nextIntent: QuestionIntent =
      rawIntent === 'diagnose' || rawIntent === 'repair' || rawIntent === 'verify' || rawIntent === 'transfer'
        ? rawIntent
        : score >= 2
          ? 'verify'
          : 'diagnose';
    const nextQuestion = sanitizeSocraticQuestionText(sanitizeText(payload.nextQuestion ?? ''));
    if (!nextQuestion) {
      throw new Error('Missing nextQuestion');
    }
    return {
      feedback: sanitizeText(payload.feedback) || 'Nice try. Let us do the next one.',
      isCorrect: score >= 2,
      score,
      nextQuestion,
      nextIntent,
    };
  } catch {
    const evaluation = await evaluateAnswer(
      lessonSummary,
      question,
      answer,
      level,
      lessonMisconceptions,
      profileInjection
    );
    const score = clampRubricScore(evaluation.score ?? (evaluation.isCorrect ? 2 : 0));
    const historyWithCurrent: TurnHistoryItem[] = [
      ...history,
      {
        question,
        answer,
        level,
        correct: score >= 2,
        score,
        misconceptionCode: sanitizeText(evaluation.misconceptionCode ?? '') || null,
      },
    ];
    const nextLevel = nextLevelFromProgress(level, score, historyWithCurrent);
    const activeMisconception = getActiveMisconception(historyWithCurrent);
    const nextIntent = score <= 1 ? (activeMisconception ? 'repair' : 'verify') : selectQuestionIntent(nextLevel, historyWithCurrent, activeMisconception);
    const nextTurn = await generateQuestion(
      lessonSummary,
      nextLevel,
      nextIntent,
      activeMisconception,
      askedCount,
      questionCount,
      historyWithCurrent,
      lessonMisconceptions,
      profileInjection
    );
    return {
      feedback: evaluation.feedback,
      isCorrect: score >= 2,
      score,
      nextQuestion: nextTurn.question,
      nextIntent: nextTurn.intent,
    };
  }
}

async function singleCallSocraticTurn(params: {
  lessonContext: string;
  askedCount: number;
  questionCount: number;
  mode: 'start' | 'continue';
  history: TurnHistoryItem[];
  previousQuestion?: string;
  userAnswer?: string;
  previousLevel?: number;
}): Promise<{ feedback: string; score: 0 | 1 | 2; isCorrect: boolean; nextLevel: number; nextQuestion: string }> {
  const { lessonContext, askedCount, questionCount, mode, history, previousQuestion, userAnswer, previousLevel } = params;
  const safePrevLevel = clampLevel(Number(previousLevel ?? 1));
  const fullHistoryText = history.length === 0
    ? 'None'
    : history
        .map((turn, index) => {
          const level = clampLevel(Number(turn.level ?? 1));
          const q = compact(sanitizeText(turn.question), 140);
          const a = compact(sanitizeText(turn.answer), 140);
          return `${index + 1}. [L${level}] Q: ${q} | A: ${a}`;
        })
        .join('\n');
  const levelGuide = `Level 1 Recall: retrieve a fact.
Level 2 Connection: link two ideas.
Level 3 Synthesis: combine ideas to explain.
Level 4 Hypothesis: predict and justify.`;

  const prompt = `System: You are a Socratic questioner.
Subject matter:
${lessonContext}

Rules:
- Ask exactly one concise question.
- Stay on-topic.
- No markdown.
- Keep language clear for speech.

Level progression:
- Start at Level 1.
- If answer is correct, move up one level (max 4).
- If answer is incorrect, stay at same level or move down one level (min 1).

${levelGuide}

Return strict JSON only with this shape:
{"feedback":"...","score":0,"isCorrect":false,"nextLevel":1,"nextQuestion":"..."}

Mode: ${mode}
Asked so far: ${askedCount} of ${questionCount}
Full conversation history:
${fullHistoryText}
${mode === 'continue' ? `Previous level: ${safePrevLevel}
Previous question: ${previousQuestion ?? ''}
Learner answer: ${userAnswer ?? ''}` : ''}`;

  try {
    const payload = await generateJson<SingleCallTurnPayload>(prompt);
    const score = clampRubricScore(payload.score ?? (payload.isCorrect ? 2 : 0));
    const isCorrect = score >= 2;
    const computedNextLevel = clampLevel(
      Number(payload.nextLevel ?? (mode === 'start' ? 1 : isCorrect ? safePrevLevel + 1 : safePrevLevel))
    );
    const nextQuestion = sanitizeSocraticQuestionText(sanitizeText(payload.nextQuestion ?? ''));
    if (!nextQuestion) {
      throw new Error('Missing next question.');
    }
    return {
      feedback: sanitizeText(payload.feedback) || (mode === 'start' ? '' : isCorrect ? 'Good. Next one.' : 'Good try. Next one.'),
      score,
      isCorrect,
      nextLevel: computedNextLevel,
      nextQuestion,
    };
  } catch {
    if (mode === 'start') {
      return {
        feedback: '',
        score: 0,
        isCorrect: false,
        nextLevel: 1,
        nextQuestion: deterministicFallbackQuestion(lessonContext, 1, 'diagnose'),
      };
    }

    const fallbackEval = deterministicFallbackEvaluation(userAnswer ?? '');
    const isCorrect = fallbackEval.isCorrect;
    const score = clampRubricScore(fallbackEval.score ?? (isCorrect ? 2 : 0));
    const nextLevel = clampLevel(isCorrect ? safePrevLevel + 1 : safePrevLevel);
    return {
      feedback: fallbackEval.feedback,
      score,
      isCorrect,
      nextLevel,
      nextQuestion: deterministicFallbackQuestion(lessonContext, nextLevel, isCorrect ? 'verify' : 'diagnose'),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TurnRequest;

    const lessonId = sanitizeText(body.lessonId);
    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'lessonId is required' }, { status: 400 });
    }

    const lesson = await loadLesson(lessonId);
    const lessonSummary = buildLiteLessonContext(lesson);
    const questionCount = clampQuestionCount(Number(body.questionCount ?? 8));
    const startLevel = clampLevel(Number(body.startLevel ?? 1));
    const askedCount = Math.max(0, Number(body.askedCount ?? 0));
    const history = Array.isArray(body.history) ? body.history : [];

    const previousQuestion = sanitizeText(body.previousQuestion);
    const previousLevel = clampLevel(Number(body.previousLevel ?? startLevel));
    const userAnswer = sanitizeText(body.userAnswer);

    // Session start: produce first question.
    if (!userAnswer || !previousQuestion) {
      if (askedCount >= questionCount) {
        return NextResponse.json({
          success: true,
          askedCount,
          complete: true,
        });
      }

      const startTurn = await singleCallSocraticTurn({
        lessonContext: lessonSummary,
        askedCount,
        questionCount,
        mode: 'start',
        history,
      });

      return NextResponse.json({
        success: true,
        question: startTurn.nextQuestion,
        questionIntent: 'diagnose',
        questionLevel: 1,
        askedCount: askedCount + 1,
        complete: askedCount + 1 >= questionCount,
      });
    }

    const shouldComplete = askedCount >= questionCount;

    if (shouldComplete) {
      const finalTurn = await singleCallSocraticTurn({
        lessonContext: lessonSummary,
        askedCount,
        questionCount,
        mode: 'continue',
        history,
        previousQuestion,
        userAnswer,
        previousLevel,
      });
      return NextResponse.json({
        success: true,
        feedback: finalTurn.feedback,
        correct: finalTurn.isCorrect,
        score: finalTurn.score,
        misconceptionCode: null,
        evidenceQuote: '',
        nextAction: finalTurn.isCorrect ? 'advance' : 'retry',
        nextLevel: finalTurn.nextLevel,
        mandatoryRetest: false,
        askedCount,
        complete: true,
      });
    }

    const turn = await singleCallSocraticTurn({
      lessonContext: lessonSummary,
      askedCount,
      questionCount,
      mode: 'continue',
      history,
      previousQuestion,
      userAnswer,
      previousLevel,
    });

    return NextResponse.json({
      success: true,
      feedback: turn.feedback,
      correct: turn.isCorrect,
      score: turn.score,
      misconceptionCode: null,
      evidenceQuote: '',
      nextAction: turn.isCorrect ? 'advance' : 'retry',
      nextLevel: turn.nextLevel,
      mandatoryRetest: false,
      question: turn.nextQuestion,
      questionIntent: turn.isCorrect ? 'verify' : 'diagnose',
      questionLevel: turn.nextLevel,
      askedCount: askedCount + 1,
      complete: askedCount + 1 >= questionCount,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Socratic turn failed unexpectedly. Please retry.',
      },
      { status: 500 }
    );
  }
}
