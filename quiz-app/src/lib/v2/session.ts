import { NextRequest, NextResponse } from 'next/server';
import { getV2SupabaseSessionFromRequest } from '@/lib/v2/supabase';

export async function requireV2Session(
  request: NextRequest | Request
): Promise<{
  session: Awaited<ReturnType<typeof getV2SupabaseSessionFromRequest>>;
  response: NextResponse | null;
}> {
  const session = await getV2SupabaseSessionFromRequest(request);
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  return { session, response: null };
}
