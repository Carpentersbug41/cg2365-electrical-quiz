import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseSessionFromRequest, SupabaseRequestSession } from '@/lib/supabase/server';
import { isAuthProgressEnabled } from './featureFlag';

export function ensureAuthProgressEnabled(): NextResponse | null {
  if (!isAuthProgressEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return null;
}

export async function requireSupabaseSession(
  request: NextRequest | Request
): Promise<{ session: SupabaseRequestSession | null; response: NextResponse | null }> {
  const session = await getSupabaseSessionFromRequest(request);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  return { session, response: null };
}

