import { NextRequest, NextResponse } from 'next/server';
import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModel } from '@/lib/config/geminiConfig';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';
import {
  buildTutorProfile,
  parseModelProfileOutput,
  sanitizeInterviewTranscript,
  type InterviewTurn,
} from '@/lib/onboarding/profileBuilder';
import { getFallbackInterviewQuestion } from '@/lib/onboarding/interviewQuestions';

const MAX_TRANSCRIPT_TURNS = 40;
const MAX_QUESTION_CHARS = 220;
const QUESTION_GENERATION_MAX_ATTEMPTS = 3;
const QUESTION_JSON_PROMPT_BASE = `Return JSON only in this exact shape:
{"question":"<one complete onboarding question ending with ?>"}
Do not return any other keys.`;

const INTERVIEW_SYSTEM_PROMPT = `You are onboarding an AI tutor student profile.
Ask exactly one concise question at a time.
Target these 8 fields and capture all of them before interview completion:
1) preferred_name
2) age_or_age_band (under 13 / 13-15 / 16-17 / 18+)
3) current_course_level
4) goal (pass / top grade / understand)
5) teaching_style (mostly Socratic / mixed / mostly direct then test)
6) feedback_strictness (gentle hints / normal / tough minimal hints)
7) language_level (simple/basic / balanced / technical)
8) example_themes (1-2 themes the learner likes; any themes are allowed)

Rules:
- Keep each question under 25 words.
- Friendly, clear, non-judgmental.
- No multi-part mega questions.
- No lists or bullets.
- End with a question mark.
- Avoid repeating already answered fields unless clarification is needed.`;

const NEXT_QUESTION_PROMPT = `Ask the next best onboarding question based on the transcript so far.
Return only the question text and prioritize still-missing target fields.`;

const PROFILE_STRUCTURER_PROMPT = `From the onboarding transcript, return strict JSON only with this schema:
{
  "preferred_name": string | null,
  "age_band": "under_13" | "13_15" | "16_17" | "18_plus" | null,
  "age_text": string | null,
  "current_course_level": string | null,
  "goal": "pass" | "top_grade" | "understand" | null,
  "teaching_style": "mostly_socratic" | "mixed" | "mostly_direct_then_test" | null,
  "feedback_strictness": "gentle_hints" | "normal" | "tough_minimal_hints" | null,
  "language_level": "simple" | "balanced" | "technical" | null,
  "example_themes": string[],
  "grade_level": string | null,
  "learning_goals": string[],
  "confidence_level": "low" | "medium" | "high" | null,
  "preferred_pace": "slow" | "medium" | "fast" | null,
  "communication_style": "direct" | "supportive" | "balanced" | null,
  "encouragement_style": "low" | "medium" | "high" | null,
  "challenge_level": "guided" | "standard" | "stretch" | null,
  "hobbies": string[],
  "interests": string[],
  "notes": string[],
  "profile_summary": string
}

profile_summary rules:
- 1 to 3 sentences
- max 500 characters
- describe tone, pacing, strictness/detail preferences, and helpful context (including themes/interests if relevant).`;

type OnboardingAction = 'next-question' | 'finalize';

type OnboardingRequest = {
  action?: OnboardingAction;
  transcript?: unknown;
};

let llmClientPromise: Promise<Awaited<ReturnType<typeof createLLMClientWithFallback>>> | null = null;
let modelName: string | null = null;

function sanitizeQuestion(raw: string): string {
  const compact = raw.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  const withoutQuotes = compact.replace(/^["']+|["']+$/g, '');
  const cropped = withoutQuotes.slice(0, MAX_QUESTION_CHARS).trim();
  if (!cropped) return '';
  return /[?]$/.test(cropped) ? cropped : `${cropped}?`;
}

function transcriptToPlainText(transcript: InterviewTurn[]): string {
  return transcript
    .map((turn) => `${turn.role === 'assistant' ? 'Tutor' : 'Student'}: ${turn.content}`)
    .join('\n');
}

function isIncompleteQuestion(question: string): boolean {
  const compact = question.trim();
  if (!compact) return true;

  const words = compact.replace(/[?!.]+$/g, '').split(/\s+/).filter(Boolean);
  if (words.length < 4) return true;

  const lowered = compact.toLowerCase();
  if (/\b(what|which|where|when|why|how)\s+are\s+your\?\s*$/i.test(compact)) return true;
  if (/\b(what|which|where|when|why|how)\s+is\s+your\?\s*$/i.test(compact)) return true;
  if (/\bwhat\s+are\s+you\?\s*$/i.test(compact)) return true;
  if (/\bwhat\s+is\s+you\?\s*$/i.test(compact)) return true;

  if (lowered.includes('...')) return true;
  if (lowered.includes('???')) return true;

  return false;
}

function endsWithDanglingConnector(question: string): boolean {
  const compact = question.trim().replace(/[?!.]+$/g, '').toLowerCase();
  if (!compact) return true;
  const parts = compact.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  const lastWord = parts[parts.length - 1];
  const dangling = new Set([
    'and',
    'or',
    'to',
    'of',
    'for',
    'with',
    'about',
    'in',
    'on',
    'at',
    'from',
    'by',
    'but',
    'so',
    'because',
  ]);
  return dangling.has(lastWord);
}

function isValidInterviewQuestion(question: string): boolean {
  if (!question.endsWith('?')) return false;
  if (question.length > MAX_QUESTION_CHARS) return false;
  if (isIncompleteQuestion(question)) return false;
  if (endsWithDanglingConnector(question)) return false;
  return true;
}

function logQuestionDebug(context: {
  stage: string;
  attempt?: number;
  transcriptTurns?: number;
  userTurns?: number;
  raw?: string;
  sanitized?: string;
  valid?: boolean;
  reason?: string;
}) {
  const payload = {
    ...context,
    timestamp: new Date().toISOString(),
  };
  console.log('[OnboardingQuestionDebug]', JSON.stringify(payload));
}

async function getClientAndModel() {
  if (!llmClientPromise) {
    llmClientPromise = createLLMClientWithFallback();
  }

  const client = await llmClientPromise;
  if (!modelName) {
    modelName = getGeminiModel();
  }
  return { client, modelName };
}

async function askNextQuestion(transcript: InterviewTurn[]): Promise<string> {
  const { client, modelName: activeModelName } = await getClientAndModel();
  const model = client.getGenerativeModel({
    model: activeModelName,
    systemInstruction: INTERVIEW_SYSTEM_PROMPT,
  });

  const userTurns = transcript.filter((turn) => turn.role === 'user').length;
  const transcriptText = transcriptToPlainText(transcript);

  logQuestionDebug({
    stage: 'start',
    transcriptTurns: transcript.length,
    userTurns,
    reason: transcript.length === 0 ? 'empty-transcript' : 'transcript-ready',
  });

  let lastCandidate = '';

  for (let attempt = 1; attempt <= QUESTION_GENERATION_MAX_ATTEMPTS; attempt += 1) {
    const repairPrompt =
      attempt === 1
        ? ''
        : `Previous invalid output: "${lastCandidate}".
Generate a complete question with no truncation and no dangling endings.`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${QUESTION_JSON_PROMPT_BASE}

${NEXT_QUESTION_PROMPT}
${repairPrompt}

Transcript:
${transcriptText || '(empty)'}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 200,
        responseMimeType: 'application/json',
      },
    });

    const rawQuestionPayload = result.response.text();
    let extracted = '';
    try {
      const parsed = JSON.parse(rawQuestionPayload) as { question?: unknown };
      if (typeof parsed.question === 'string') {
        extracted = parsed.question;
      }
    } catch {
      // Keep extracted empty; validation will fail and retry.
    }

    lastCandidate = sanitizeQuestion(extracted);
    logQuestionDebug({
      stage: 'attempt-generate-json',
      attempt,
      transcriptTurns: transcript.length,
      userTurns,
      raw: rawQuestionPayload,
      sanitized: lastCandidate,
    });

    const valid = isValidInterviewQuestion(lastCandidate);
    logQuestionDebug({
      stage: 'attempt-validation',
      attempt,
      transcriptTurns: transcript.length,
      userTurns,
      sanitized: lastCandidate,
      valid,
      reason: valid ? 'accepted' : 'rejected',
    });

    if (valid) {
      logQuestionDebug({
        stage: 'accepted',
        attempt,
        transcriptTurns: transcript.length,
        userTurns,
        sanitized: lastCandidate,
        valid: true,
      });
      return lastCandidate;
    }
  }

  logQuestionDebug({
    stage: 'failed',
    transcriptTurns: transcript.length,
    userTurns,
    sanitized: lastCandidate,
    valid: false,
    reason: 'max-attempts-reached',
  });
  const fallbackQuestion = getFallbackInterviewQuestion(transcript);
  logQuestionDebug({
    stage: 'fallback',
    transcriptTurns: transcript.length,
    userTurns,
    sanitized: fallbackQuestion,
    valid: true,
    reason: 'deterministic-fallback-question',
  });
  return fallbackQuestion;
}

async function finalizeProfile(transcript: InterviewTurn[]) {
  const { client, modelName: activeModelName } = await getClientAndModel();
  const model = client.getGenerativeModel({
    model: activeModelName,
    systemInstruction: PROFILE_STRUCTURER_PROMPT,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Onboarding transcript:\n${transcriptToPlainText(transcript)}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1400,
      responseMimeType: 'application/json',
    },
  });

  const rawText = result.response.text();
  const parsed = parseModelProfileOutput(rawText);
  const built = buildTutorProfile(parsed, transcript);

  return {
    ...built,
    usedFallbackParser: !parsed,
  };
}

export async function POST(request: NextRequest) {
  const session = await getSupabaseSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  let body: OnboardingRequest;
  try {
    body = (await request.json()) as OnboardingRequest;
  } catch {
    return NextResponse.json(
      { success: false, code: 'INVALID_JSON', message: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  const action = body.action;
  if (action !== 'next-question' && action !== 'finalize') {
    return NextResponse.json(
      { success: false, code: 'INVALID_ACTION', message: 'action must be "next-question" or "finalize".' },
      { status: 400 }
    );
  }

  const transcript = sanitizeInterviewTranscript(body.transcript).slice(-MAX_TRANSCRIPT_TURNS);
  const userTurns = transcript.filter((turn) => turn.role === 'user').length;
  console.log(
    '[OnboardingInterviewRequest]',
    JSON.stringify({
      action,
      transcriptTurns: transcript.length,
      userTurns,
      timestamp: new Date().toISOString(),
    })
  );

  try {
    if (action === 'next-question') {
      let question: string;
      try {
        question = await askNextQuestion(transcript);
      } catch (error) {
        const fallbackQuestion = getFallbackInterviewQuestion(transcript);
        console.warn(
          '[OnboardingInterviewFallback]',
          error instanceof Error ? error.message : 'unknown onboarding question error'
        );
        question = fallbackQuestion;
      }
      return NextResponse.json({ success: true, question });
    }

    if (transcript.filter((turn) => turn.role === 'user').length < 2) {
      return NextResponse.json(
        {
          success: false,
          code: 'INSUFFICIENT_TRANSCRIPT',
          message: 'Need at least two student responses before finalizing onboarding.',
        },
        { status: 400 }
      );
    }

    let profileJson: Record<string, unknown>;
    let profileSummary: string;
    let usedFallbackParser = false;

    try {
      const finalized = await finalizeProfile(transcript);
      profileJson = finalized.profileJson;
      profileSummary = finalized.profileSummary;
      usedFallbackParser = finalized.usedFallbackParser;
    } catch (error) {
      console.warn(
        '[OnboardingFinalizeFallback]',
        error instanceof Error ? error.message : 'unknown finalize error'
      );
      const fallback = buildTutorProfile(null, transcript);
      profileJson = fallback.profileJson;
      profileSummary = fallback.profileSummary;
      usedFallbackParser = true;
    }

    const { error: upsertError } = await session.client
      .from('profiles')
      .upsert(
        {
          user_id: session.user.id,
          tutor_profile_summary: profileSummary,
          tutor_profile_json: profileJson,
        },
        { onConflict: 'user_id' }
      );

    if (upsertError) {
      return NextResponse.json(
        { success: false, code: 'PERSIST_FAILED', message: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profileSummary,
      profileJson,
      usedFallbackParser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        code: 'ONBOARDING_ERROR',
        message: error instanceof Error ? error.message : 'Failed to process onboarding.',
      },
      { status: 500 }
    );
  }
}
