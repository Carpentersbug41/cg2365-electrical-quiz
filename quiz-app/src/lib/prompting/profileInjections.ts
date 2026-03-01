import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

export const PROMPT_INJECTION_KEYS = {
  lessonGenerationProfile: 'lesson_generation_profile',
  tutorResponseProfile: 'tutor_response_profile',
} as const;

export const PROMPT_INJECTION_LIMITS = {
  maxChars: 500,
  minSentences: 2,
  maxSentences: 3,
} as const;

export interface PromptInjectionSettings {
  lessonGenerationProfile: string;
  tutorResponseProfile: string;
}

type PromptInjectionRow = {
  key: string;
  value: string;
  updated_at: string;
};

export const DEFAULT_PROMPT_INJECTIONS: PromptInjectionSettings = {
  lessonGenerationProfile:
    'Primary audience is beginner-to-intermediate learners preparing for technical assessments. Use clear, confidence-building language with practical examples and avoid dense jargon. Keep explanations structured, concise, and directly aligned to lesson outcomes.',
  tutorResponseProfile:
    "Respond with concise, supportive coaching tailored to the learner's pace and confidence. Prioritize clear hints, short feedback, and simple language before technical depth. Guide reasoning without revealing full solutions unless the mode explicitly allows it.",
};

const CACHE_TTL_MS = 30_000;
let cachedSettings:
  | {
      value: PromptInjectionSettings;
      expiresAt: number;
    }
  | null = null;

export function compactPromptText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

export function countSentences(value: string): number {
  const text = compactPromptText(value);
  if (!text) return 0;

  const segments = text
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  if (segments.length > 0) return segments.length;
  return 1;
}

export function validatePromptInjection(value: string): string | null {
  const cleaned = compactPromptText(value);
  if (!cleaned) {
    return 'Prompt injection cannot be empty.';
  }
  if (cleaned.length > PROMPT_INJECTION_LIMITS.maxChars) {
    return `Prompt injection must be ${PROMPT_INJECTION_LIMITS.maxChars} characters or fewer.`;
  }

  const sentenceCount = countSentences(cleaned);
  if (sentenceCount < PROMPT_INJECTION_LIMITS.minSentences || sentenceCount > PROMPT_INJECTION_LIMITS.maxSentences) {
    return `Prompt injection must be ${PROMPT_INJECTION_LIMITS.minSentences}-${PROMPT_INJECTION_LIMITS.maxSentences} sentences.`;
  }

  return null;
}

export function invalidatePromptInjectionCache(): void {
  cachedSettings = null;
}

export async function getPromptInjectionSettings(options?: {
  forceRefresh?: boolean;
}): Promise<PromptInjectionSettings> {
  const now = Date.now();
  if (!options?.forceRefresh && cachedSettings && cachedSettings.expiresAt > now) {
    return cachedSettings.value;
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return DEFAULT_PROMPT_INJECTIONS;
  }

  try {
    const { data, error } = await adminClient
      .from('prompt_injections')
      .select('key, value, updated_at')
      .in('key', [PROMPT_INJECTION_KEYS.lessonGenerationProfile, PROMPT_INJECTION_KEYS.tutorResponseProfile]);

    if (error) {
      return DEFAULT_PROMPT_INJECTIONS;
    }

    const rows = (data ?? []) as PromptInjectionRow[];
    const byKey = new Map(rows.map((row) => [row.key, compactPromptText(row.value)]));

    const resolved: PromptInjectionSettings = {
      lessonGenerationProfile:
        byKey.get(PROMPT_INJECTION_KEYS.lessonGenerationProfile) || DEFAULT_PROMPT_INJECTIONS.lessonGenerationProfile,
      tutorResponseProfile:
        byKey.get(PROMPT_INJECTION_KEYS.tutorResponseProfile) || DEFAULT_PROMPT_INJECTIONS.tutorResponseProfile,
    };

    cachedSettings = {
      value: resolved,
      expiresAt: now + CACHE_TTL_MS,
    };

    return resolved;
  } catch {
    return DEFAULT_PROMPT_INJECTIONS;
  }
}

export function sanitizeUserProfileSummary(value: unknown): string | null {
  const cleaned = compactPromptText(value);
  if (!cleaned) return null;
  return cleaned.slice(0, PROMPT_INJECTION_LIMITS.maxChars);
}

export async function getUserTutorProfileSummaryForRequest(
  request: Request
): Promise<string | null> {
  const session = await getSupabaseSessionFromRequest(request);
  if (!session) return null;

  const { data, error } = await session.client
    .from('profiles')
    .select('tutor_profile_summary')
    .eq('user_id', session.user.id)
    .maybeSingle<{ tutor_profile_summary: string | null }>();

  if (error) return null;
  return sanitizeUserProfileSummary(data?.tutor_profile_summary ?? null);
}
