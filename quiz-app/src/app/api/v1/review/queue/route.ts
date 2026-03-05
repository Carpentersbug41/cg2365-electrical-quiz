import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthProgressEnabled, requireSupabaseSession } from '@/lib/authProgress/routeGuard';
import { listReviewQueue } from '@/lib/review/reviewQueueRepo';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}

function parseStatus(value: string | null): 'active' | 'resolved' | undefined {
  if (value === 'active' || value === 'resolved') return value;
  return undefined;
}

export async function GET(request: NextRequest) {
  const featureBlocked = ensureAuthProgressEnabled();
  if (featureBlocked) {
    return featureBlocked;
  }

  const { session, response } = await requireSupabaseSession(request);
  if (!session) {
    return response!;
  }

  try {
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
    const status = parseStatus(request.nextUrl.searchParams.get('status'));
    const items = await listReviewQueue(session.client, session.user.id, { limit, status });
    return NextResponse.json({
      items,
      count: items.length,
      limit,
      status: status ?? 'all',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load review queue.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
