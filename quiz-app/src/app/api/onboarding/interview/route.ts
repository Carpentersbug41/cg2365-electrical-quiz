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

const MAX_TRANSCRIPT_TURNS = 40;
const MAX_QUESTION_CHARS = 220;
const QUESTION_GENERATION_MAX_ATTEMPTS = 3;

const INTERVIEW_SYSTEM_PROMPT = `You are onboarding an AI tutor student profile.
Ask exactly one concise question at a time.
Collect enough detail for personalization:
- current level or grade
- learning goals
- confidence level
- preferred pace
- preferred communication style
- encouragement preference
- hobbies and interests

Rules:
- Keep each question under 25 words.
- Friendly, clear, non-judgmental.
- No multi-part mega questions.
- No lists or bullets.
- End with a question mark.`;

const NEXT_QUESTION_PROMPT = `Ask the next best onboarding question based on the transcript so far.
Return only the question text.`;

const PROFILE_STRUCTURER_PROMPT = `From the onboarding transcript, return strict JSON only with this schema:
{
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
- describe tone, pacing, and helpful context (including interests if relevant).`;

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

function isValidInterviewQuestion(question: string): boolean {
  if (!question.endsWith('?')) return false;
  if (question.length > MAX_QUESTION_CHARS) return false;
  if (isIncompleteQuestion(question)) return false;
  return true;
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

  const history = transcript.map((turn) => ({
    role: turn.role === 'user' ? 'user' : 'model',
    parts: [{ text: turn.content }],
  })) as Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;

  const firstUserIndex = history.findIndex((turn) => turn.role === 'user');
  const validHistory = firstUserIndex >= 0 ? history.slice(firstUserIndex) : [];

  let lastCandidate = '';

  for (let attempt = 1; attempt <= QUESTION_GENERATION_MAX_ATTEMPTS; attempt += 1) {
    if (validHistory.length === 0) {
      const first = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: NEXT_QUESTION_PROMPT }] }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 120,
        },
      });
      lastCandidate = sanitizeQuestion(first.response.text());
    } else {
      const chat = model.startChat({
        history: validHistory,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 120,
        },
      });

      const prompt =
        attempt === 1
          ? NEXT_QUESTION_PROMPT
          : `Your previous question was invalid or truncated: "${lastCandidate}".
Rewrite as a complete, natural, single onboarding question with clear intent. Return only the question text.`;
      const result = await chat.sendMessage(prompt);
      lastCandidate = sanitizeQuestion(result.response.text());
    }

    if (isValidInterviewQuestion(lastCandidate)) {
      return lastCandidate;
    }
  }

  throw new Error(`Question generation produced invalid output after ${QUESTION_GENERATION_MAX_ATTEMPTS} attempts.`);
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

  try {
    if (action === 'next-question') {
      const question = await askNextQuestion(transcript);
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

    const { profileJson, profileSummary, usedFallbackParser } = await finalizeProfile(transcript);

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
