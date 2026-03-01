import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';
import {
  compactPromptText,
  DEFAULT_PROMPT_INJECTIONS,
  getPromptInjectionSettings,
  invalidatePromptInjectionCache,
  PROMPT_INJECTION_KEYS,
  PROMPT_INJECTION_LIMITS,
  validatePromptInjection,
} from '@/lib/prompting/profileInjections';

type PromptInjectionPatchBody = {
  lessonGenerationProfile?: unknown;
  tutorResponseProfile?: unknown;
};

export async function GET(request: NextRequest) {
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const settings = await getPromptInjectionSettings({ forceRefresh: true });
    return NextResponse.json({
      success: true,
      settings,
      limits: PROMPT_INJECTION_LIMITS,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json()) as PromptInjectionPatchBody;

    const hasLessonUpdate = body.lessonGenerationProfile !== undefined;
    const hasTutorUpdate = body.tutorResponseProfile !== undefined;

    if (!hasLessonUpdate && !hasTutorUpdate) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'Provide lessonGenerationProfile and/or tutorResponseProfile.' },
        { status: 400 }
      );
    }

    const updates: Array<{ key: string; value: string }> = [];

    if (hasLessonUpdate) {
      if (typeof body.lessonGenerationProfile !== 'string') {
        return NextResponse.json(
          { success: false, code: 'INVALID_INPUT', message: 'lessonGenerationProfile must be a string.' },
          { status: 400 }
        );
      }
      const cleaned = compactPromptText(body.lessonGenerationProfile);
      const validationError = validatePromptInjection(cleaned);
      if (validationError) {
        return NextResponse.json(
          { success: false, code: 'INVALID_INPUT', message: `Lesson generation profile: ${validationError}` },
          { status: 400 }
        );
      }
      updates.push({
        key: PROMPT_INJECTION_KEYS.lessonGenerationProfile,
        value: cleaned,
      });
    }

    if (hasTutorUpdate) {
      if (typeof body.tutorResponseProfile !== 'string') {
        return NextResponse.json(
          { success: false, code: 'INVALID_INPUT', message: 'tutorResponseProfile must be a string.' },
          { status: 400 }
        );
      }
      const cleaned = compactPromptText(body.tutorResponseProfile);
      const validationError = validatePromptInjection(cleaned);
      if (validationError) {
        return NextResponse.json(
          { success: false, code: 'INVALID_INPUT', message: `Tutor response profile: ${validationError}` },
          { status: 400 }
        );
      }
      updates.push({
        key: PROMPT_INJECTION_KEYS.tutorResponseProfile,
        value: cleaned,
      });
    }

    const { error } = await adminClient
      .from('prompt_injections')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      throw error;
    }

    invalidatePromptInjectionCache();
    const settings = await getPromptInjectionSettings({ forceRefresh: true });

    return NextResponse.json({
      success: true,
      settings,
      defaults: DEFAULT_PROMPT_INJECTIONS,
      limits: PROMPT_INJECTION_LIMITS,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
