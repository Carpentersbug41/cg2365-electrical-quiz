import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { lowerReviewQueuePriorityOnRetryPass } from '@/lib/review/reviewQueueRepo';

export async function POST(request: NextRequest) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const questionStableId = typeof (body as { questionStableId?: unknown })?.questionStableId === 'string'
    ? (body as { questionStableId: string }).questionStableId
    : '';
  if (!questionStableId.trim()) {
    return NextResponse.json({ error: 'questionStableId is required.' }, { status: 400 });
  }

  try {
    await lowerReviewQueuePriorityOnRetryPass(session.client, session.user.id, questionStableId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update review priority.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
