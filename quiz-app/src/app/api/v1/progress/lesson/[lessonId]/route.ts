import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';

interface RouteContext {
  params: Promise<{ lessonId: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  const { lessonId } = await context.params;
  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
  }

  const { data, error } = await session.client
    .from('lesson_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data ?? null });
}

