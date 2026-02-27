export type InterviewRole = 'assistant' | 'user';

export interface InterviewTurn {
  role: InterviewRole;
  content: string;
}

export interface TutorProfileModelOutput {
  preferred_name: string | null;
  age_band: 'under_13' | '13_15' | '16_17' | '18_plus' | null;
  age_text: string | null;
  current_course_level: string | null;
  goal: 'pass' | 'top_grade' | 'understand' | null;
  teaching_style: 'mostly_socratic' | 'mixed' | 'mostly_direct_then_test' | null;
  feedback_strictness: 'gentle_hints' | 'normal' | 'tough_minimal_hints' | null;
  language_level: 'simple' | 'balanced' | 'technical' | null;
  example_themes: string[];
  grade_level: string | null;
  learning_goals: string[];
  confidence_level: 'low' | 'medium' | 'high' | null;
  preferred_pace: 'slow' | 'medium' | 'fast' | null;
  communication_style: 'direct' | 'supportive' | 'balanced' | null;
  encouragement_style: 'low' | 'medium' | 'high' | null;
  challenge_level: 'guided' | 'standard' | 'stretch' | null;
  hobbies: string[];
  interests: string[];
  notes: string[];
  profile_summary: string;
}

export interface BuiltTutorProfile {
  profileJson: Record<string, unknown>;
  profileSummary: string;
}

const MAX_TURNS = 40;
const MAX_TURN_CHARS = 1000;
const MAX_SUMMARY_CHARS = 500;
const MAX_ARRAY_VALUES = 8;

function compactWhitespace(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function toUniqueLimited(values: string[]): string[] {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const cleaned = compactWhitespace(value);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(cleaned);
    if (next.length >= MAX_ARRAY_VALUES) break;
  }
  return next;
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const values = value.filter((item): item is string => typeof item === 'string');
  return toUniqueLimited(values);
}

function readEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toLowerCase();
  const match = allowed.find((item) => item === normalized);
  return match ?? null;
}

export function sanitizeInterviewTranscript(input: unknown): InterviewTurn[] {
  if (!Array.isArray(input)) return [];
  const turns: InterviewTurn[] = [];

  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const roleRaw = (item as { role?: unknown }).role;
    const contentRaw = (item as { content?: unknown }).content;

    if ((roleRaw !== 'assistant' && roleRaw !== 'user') || typeof contentRaw !== 'string') {
      continue;
    }

    const content = compactWhitespace(contentRaw).slice(0, MAX_TURN_CHARS);
    if (!content) continue;

    turns.push({
      role: roleRaw,
      content,
    });
  }

  return turns.slice(-MAX_TURNS);
}

export function extractJsonObjectFromText(rawText: string): string | null {
  const start = rawText.indexOf('{');
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < rawText.length; i += 1) {
    const char = rawText[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') {
      depth += 1;
      continue;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return rawText.slice(start, i + 1);
      }
    }
  }

  return null;
}

export function parseModelProfileOutput(rawText: string): Record<string, unknown> | null {
  const direct = compactWhitespace(rawText);
  if (!direct) return null;

  try {
    const parsed = JSON.parse(direct) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall through to extraction path.
  }

  const jsonObjectText = extractJsonObjectFromText(rawText);
  if (!jsonObjectText) return null;

  try {
    const parsed = JSON.parse(jsonObjectText) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizeSummary(summary: unknown): string {
  const compact = typeof summary === 'string' ? compactWhitespace(summary) : '';
  if (!compact) return '';

  const pieces = compact
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const firstThree = pieces.slice(0, 3);
  const combined = firstThree.join(' ').slice(0, MAX_SUMMARY_CHARS).trim();
  if (!combined) return '';

  return /[.!?]$/.test(combined) ? combined : `${combined}.`;
}

function buildFallbackSummary(profile: Omit<TutorProfileModelOutput, 'profile_summary'>): string {
  const tone =
    profile.feedback_strictness === 'tough_minimal_hints'
      ? 'direct'
      : profile.feedback_strictness === 'gentle_hints'
        ? 'supportive'
        : profile.communication_style ?? 'balanced';
  const pace = profile.preferred_pace ?? 'medium';
  const goalsText =
    profile.goal === 'top_grade'
      ? 'top grades'
      : profile.goal === 'pass'
        ? 'passing assessments'
        : profile.goal === 'understand'
          ? 'deep understanding'
          : profile.learning_goals.length > 0
            ? profile.learning_goals.slice(0, 2).join(' and ')
            : 'steady progress';
  const interests = [...profile.example_themes, ...profile.hobbies, ...profile.interests].slice(0, 2);
  const interestsText = interests.length > 0 ? ` Use examples connected to ${interests.join(' and ')}.` : '';

  return `Learner prefers a ${tone} tone with ${pace} pacing and is focused on ${goalsText}.${interestsText}`.trim();
}

export function buildTutorProfile(
  parsed: Record<string, unknown> | null,
  transcript: InterviewTurn[]
): BuiltTutorProfile {
  const source = parsed ?? {};

  const profileBase: Omit<TutorProfileModelOutput, 'profile_summary'> = {
    preferred_name:
      typeof source.preferred_name === 'string' ? compactWhitespace(source.preferred_name).slice(0, 80) : null,
    age_band: readEnum(source.age_band, ['under_13', '13_15', '16_17', '18_plus'] as const),
    age_text: typeof source.age_text === 'string' ? compactWhitespace(source.age_text).slice(0, 40) : null,
    current_course_level:
      typeof source.current_course_level === 'string'
        ? compactWhitespace(source.current_course_level).slice(0, 120)
        : null,
    goal: readEnum(source.goal, ['pass', 'top_grade', 'understand'] as const),
    teaching_style: readEnum(
      source.teaching_style,
      ['mostly_socratic', 'mixed', 'mostly_direct_then_test'] as const
    ),
    feedback_strictness: readEnum(
      source.feedback_strictness,
      ['gentle_hints', 'normal', 'tough_minimal_hints'] as const
    ),
    language_level: readEnum(source.language_level, ['simple', 'balanced', 'technical'] as const),
    example_themes: readStringArray(source.example_themes),
    grade_level: typeof source.grade_level === 'string' ? compactWhitespace(source.grade_level).slice(0, 80) : null,
    learning_goals: readStringArray(source.learning_goals ?? source.goals),
    confidence_level: readEnum(source.confidence_level, ['low', 'medium', 'high'] as const),
    preferred_pace: readEnum(source.preferred_pace, ['slow', 'medium', 'fast'] as const),
    communication_style: readEnum(source.communication_style, ['direct', 'supportive', 'balanced'] as const),
    encouragement_style: readEnum(source.encouragement_style, ['low', 'medium', 'high'] as const),
    challenge_level: readEnum(source.challenge_level, ['guided', 'standard', 'stretch'] as const),
    hobbies: readStringArray(source.hobbies),
    interests: readStringArray(source.interests),
    notes: readStringArray(source.notes),
  };

  const normalizedSummary =
    normalizeSummary(source.profile_summary) || normalizeSummary(source.prompt_summary) || buildFallbackSummary(profileBase);

  const profileJson: Record<string, unknown> = {
    ...profileBase,
    generated_by: 'llm_onboarding_interview',
    updated_at: new Date().toISOString(),
    onboarding_turn_count: transcript.length,
    onboarding_transcript: transcript,
  };

  return {
    profileJson,
    profileSummary: normalizeSummary(normalizedSummary) || 'Learner prefers clear, supportive tutoring with concise steps.',
  };
}
