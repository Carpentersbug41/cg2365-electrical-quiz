import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

function hasProfileSummary(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function GET(request: NextRequest) {
  const session = await getSupabaseSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Authentication required.' },
      { status: 401 }
    );
  }

  const { data, error } = await session.client
    .from('profiles')
    .select('tutor_profile_summary, tutor_profile_json')
    .eq('user_id', session.user.id)
    .maybeSingle<{ tutor_profile_summary: string | null; tutor_profile_json: Record<string, unknown> | null }>();

  if (error) {
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: error.message },
      { status: 500 }
    );
  }

  const profileSummary = data?.tutor_profile_summary ?? null;
  const profileJson = data?.tutor_profile_json ?? {};
  return NextResponse.json({
    success: true,
    onboardingComplete: hasProfileSummary(profileSummary),
    profileSummary,
    profileJson,
  });
}
