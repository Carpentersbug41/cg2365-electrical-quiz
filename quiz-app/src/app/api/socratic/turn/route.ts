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
  salvageSocraticPayload,
} from '@/lib/socratic/fallbacks';
import {
  getPromptInjectionSettings,
  getUserTutorProfileSummaryForRequest,
} from '@/lib/prompting/profileInjections';

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

async function generateJson<T>(prompt: string): Promise<T> {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }
  const client = await llmClientPromise;
  const model = client.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 600,
      responseMimeType: 'application/json',
    },
  });

  let lastError = 'Failed to parse model response.';

  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 600,
        responseMimeType: 'application/json',
      },
    });

    const raw = result.response.text();
    const validation = validateLLMResponse(raw);
    if (!validation.valid) {
      lastError = validation.error ?? 'Invalid LLM response format.';
      continue;
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
  lessonMisconceptions: LessonMisconception[],
  profileInjection?: string
  ): Promise<{ question: string; intent: QuestionIntent }> {
    const recentHistory = history
      .slice(-6)
      .map((item, index) => `${index + 1}. [Level ${item.level}] Q: ${compact(item.question, 140)} | A: ${compact(item.answer, 140)}`)
      .join('\n');

    const conceptWindowSize = 4;
    const questionPositionInConcept = (askedCount % conceptWindowSize) + 1;
    const previousQuestion = history.length > 0 ? history[history.length - 1].question : '';
    const previousAnswer = history.length > 0 ? history[history.length - 1].answer : '';
    const isFollowUpStep = questionPositionInConcept > 1;

  const levelGuide = `Level 1 Recall: simple factual check.
Level 2 Connection: link two ideas.
Level 3 Synthesis: combine ideas in reasoning.
Level 4 Hypothesis: prediction/justification beyond direct text.`;

  const profileSection = profileInjection
    ? `\nPROFILE INJECTION (MANDATORY STYLE/TONE):\n${profileInjection}\nUse this for phrasing and pacing only.`
    : '';
  const misconceptionSection =
    lessonMisconceptions.length > 0
      ? lessonMisconceptions
          .map(
            (item) =>
              `- ${item.code}: misconception="${compact(item.misconception, 140)}"; correction="${compact(item.correction, 140)}"`
          )
          .join('\n')
      : '- No explicit misconception map available for this lesson.';

  const prompt = `You are generating ONE Socratic question for a student.
Return strict JSON only: {"question":"...","intent":"diagnose|repair|verify|transfer"}.
${profileSection}

  Rules:
  - Ask exactly one question at a time.
  - Keep it concise and clear for spoken dialogue.
  - One question at a time, but keep conceptual continuity.
  - Work in concept chains of 3-4 questions on the SAME concept area before switching.
  - Do NOT jump between unrelated concepts question-to-question.
  - Use the requested level only.
  - Keep intent exactly equal to requested intent.
  - Do not ask multiple sub-questions.
  - Do not include answer hints.
- No markdown.
- If Active misconception code is present, target that misconception explicitly.
- Remember: Always Work in concept chains of 3-4 questions on the SAME concept area before switching.

  Session progress: next question number ${askedCount + 1} of ${questionCount}
  Target level: ${level}
  Target intent: ${intent}
  Concept-chain position: ${questionPositionInConcept} of 4
  Active misconception code: ${activeMisconception || 'none'}
  Misconception map for this lesson:
  ${misconceptionSection}

  ${isFollowUpStep
    ? `FOLLOW-UP REQUIREMENT (MANDATORY):
  - Stay in the exact same concept area as the immediately previous question.
  - Deepen understanding of that same area using a tighter probe (mechanism, contrast, justification, or near-transfer).
  - Base the follow-up on the prior exchange below.
  Previous question: ${compact(previousQuestion, 200)}
  Student answer: ${compact(previousAnswer, 200)}`
    : `NEW-CONCEPT STEP:
  - Start a fresh concept area from the lesson, specific and foundational.
  - The next 2-3 questions will stay in this same area.`}

  ${levelGuide}

Avoid repeating these recent questions:
${recentHistory || 'None'}

Lesson context:
${lessonSummary}`;

  try {
    const payload = await generateJson<NextQuestionPayload>(prompt);
    return {
      question: sanitizeText(payload.question),
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
      const safeQuestion = sanitizeText(salvaged.question);
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TurnRequest;
    const [promptInjections, learnerProfileSummary] = await Promise.all([
      getPromptInjectionSettings(),
      getUserTutorProfileSummaryForRequest(request),
    ]);
    const hasGlobalProfile = Boolean(promptInjections.tutorResponseProfile?.trim());
    const hasLearnerProfile = Boolean(learnerProfileSummary?.trim());
    const responseProfileInjection = [
      hasGlobalProfile
        ? `GLOBAL STYLE (FALLBACK): ${promptInjections.tutorResponseProfile.trim()}`
        : null,
      hasLearnerProfile
        ? `LEARNER PROFILE (AUTHORITATIVE FOR THIS USER): ${learnerProfileSummary!.trim()}`
        : null,
      hasGlobalProfile || hasLearnerProfile
        ? 'Priority: follow LEARNER PROFILE for voice/tone; use GLOBAL STYLE only as fallback/default.'
        : null,
    ]
      .filter((value): value is string => Boolean(value && value.trim().length > 0))
      .join('\n');

    const lessonId = sanitizeText(body.lessonId);
    if (!lessonId) {
      return NextResponse.json({ success: false, error: 'lessonId is required' }, { status: 400 });
    }

    const lesson = await loadLesson(lessonId);
    const lessonMisconceptions = extractLessonMisconceptions(lesson);
    const lessonSummary = buildLessonSummary(lesson, lessonMisconceptions);
    const questionCount = clampQuestionCount(Number(body.questionCount ?? 8));
    const startLevel = clampLevel(Number(body.startLevel ?? 1));
    const askedCount = Math.max(0, Number(body.askedCount ?? 0));
    const history = Array.isArray(body.history) ? body.history : [];
    const openingLevel = computeOpeningLevel(startLevel, history);
    const openingMisconception = getActiveMisconception(history);
    const openingIntent = selectQuestionIntent(openingLevel, history, openingMisconception);

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

      const nextTurn = await generateQuestion(
        lessonSummary,
        openingLevel,
        openingIntent,
        openingMisconception,
        askedCount,
        questionCount,
        history,
        lessonMisconceptions,
        responseProfileInjection
      );
      if (!nextTurn.question) {
        return NextResponse.json({ success: false, error: 'Could not generate first question.' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        question: nextTurn.question,
        questionIntent: nextTurn.intent,
        questionLevel: openingLevel,
        askedCount: askedCount + 1,
        complete: askedCount + 1 >= questionCount,
      });
    }

    const evaluation = await evaluateAnswer(
      lessonSummary,
      previousQuestion,
      userAnswer,
      previousLevel,
      lessonMisconceptions,
      responseProfileInjection
    );
    const currentScore = clampRubricScore(evaluation.score ?? (evaluation.isCorrect ? 2 : 0));
    const historyWithCurrent: TurnHistoryItem[] = [
      ...history,
      {
        question: previousQuestion,
        answer: userAnswer,
        level: previousLevel,
        correct: currentScore >= 2,
        score: currentScore,
        misconceptionCode: sanitizeText(evaluation.misconceptionCode ?? '') || null,
      },
    ];
    const derivedNextLevel = nextLevelFromProgress(previousLevel, currentScore, historyWithCurrent);
    const activeMisconception = getActiveMisconception(historyWithCurrent);
    const defaultNextIntent = selectQuestionIntent(derivedNextLevel, historyWithCurrent, activeMisconception);
    const mandatoryRetest = currentScore <= 1;
    const forcedNextLevel = mandatoryRetest ? Math.min(previousLevel, derivedNextLevel) : derivedNextLevel;
    const nextIntent = mandatoryRetest
      ? (activeMisconception ? 'repair' : 'verify')
      : defaultNextIntent;
    const shouldComplete = askedCount >= questionCount;

    if (shouldComplete) {
      return NextResponse.json({
        success: true,
        feedback: evaluation.feedback,
        correct: currentScore >= 2,
        score: currentScore,
        misconceptionCode: activeMisconception,
        evidenceQuote: evaluation.evidenceQuote ?? '',
        nextAction: evaluation.nextAction ?? (currentScore >= 2 ? 'advance' : 'retry'),
        nextLevel: forcedNextLevel,
        mandatoryRetest,
        askedCount,
        complete: true,
      });
    }

    const nextTurn = await generateQuestion(
      lessonSummary,
      forcedNextLevel,
      nextIntent,
      activeMisconception,
      askedCount,
      questionCount,
      historyWithCurrent,
      lessonMisconceptions,
      responseProfileInjection
    );
    if (!nextTurn.question) {
      return NextResponse.json({ success: false, error: 'Could not generate next question.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      feedback: evaluation.feedback,
      correct: currentScore >= 2,
      score: currentScore,
      misconceptionCode: activeMisconception,
      evidenceQuote: evaluation.evidenceQuote ?? '',
      nextAction: evaluation.nextAction ?? (currentScore >= 2 ? 'advance' : 'retry'),
      nextLevel: forcedNextLevel,
      mandatoryRetest,
      question: nextTurn.question,
      questionIntent: nextTurn.intent,
      questionLevel: forcedNextLevel,
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
