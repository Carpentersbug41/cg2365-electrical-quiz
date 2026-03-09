import { NextRequest, NextResponse } from 'next/server';
import { isV2AdminOverrideEmail } from '@/lib/v2/auth';
import { createV2SupabaseAdminClient, getV2SupabaseSessionFromRequest } from '@/lib/v2/supabase';

export function createV2AdminClient() {
  return createV2SupabaseAdminClient();
}

export async function getV2ActorUserId(request: NextRequest | Request): Promise<string | null> {
  const session = await getV2SupabaseSessionFromRequest(request);
  return session?.user?.id ?? null;
}

async function isV2AdminRequest(request: NextRequest | Request): Promise<boolean> {
  const session = await getV2SupabaseSessionFromRequest(request);
  if (!session) return false;

  if (isV2AdminOverrideEmail(session.user.email)) {
    return true;
  }

  const { data, error } = await session.client
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .maybeSingle<{ role: 'student' | 'admin' }>();

  if (error) return false;
  return data?.role === 'admin';
}

function getProvidedV2AdminToken(request: NextRequest | Request): string {
  const direct = request.headers.get('x-v2-admin-token');
  const authHeader = request.headers.get('authorization');
  const bearer =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null;
  return (direct && direct.trim().length > 0 ? direct.trim() : bearer) ?? '';
}

export async function guardV2AdminAccess(request: NextRequest | Request): Promise<NextResponse | null> {
  const expectedToken =
    process.env.V2_ADMIN_TOKEN ??
    process.env.USER_ADMIN_TOKEN ??
    process.env.QUESTION_ADMIN_TOKEN ??
    process.env.MODULE_PLANNER_ADMIN_TOKEN;

  const isAdmin = await isV2AdminRequest(request);
  if (expectedToken && expectedToken.trim().length > 0) {
    const provided = getProvidedV2AdminToken(request);
    if (provided === expectedToken.trim() || isAdmin) {
      return null;
    }
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Missing or invalid V2 admin token.' },
      { status: 401 }
    );
  }

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'V2 admin role required.' },
      { status: 401 }
    );
  }

  return null;
}

export function toV2AdminError(error: unknown): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown V2 admin error.',
    },
    { status: 500 }
  );
}
