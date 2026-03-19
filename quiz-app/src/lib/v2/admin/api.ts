import { NextRequest, NextResponse } from 'next/server';
import { hasV2Role, type V2Role } from '@/lib/v2/access';
import { isV2AdminOverrideEmail } from '@/lib/v2/auth';
import { createV2SupabaseAdminClient, getV2SupabaseSessionFromRequest } from '@/lib/v2/supabase';

export function createV2AdminClient() {
  return createV2SupabaseAdminClient();
}

export async function getV2ActorUserId(request: NextRequest | Request): Promise<string | null> {
  const session = await getV2SupabaseSessionFromRequest(request);
  return session?.user?.id ?? null;
}

async function hasRequiredRole(request: NextRequest | Request, requiredRole: V2Role): Promise<boolean> {
  const session = await getV2SupabaseSessionFromRequest(request);
  if (!session) return false;

  if (isV2AdminOverrideEmail(session.user.email)) {
    return true;
  }
  return hasV2Role(session.client, session.user.id, requiredRole);
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

function isLocalDevelopmentHost(hostHeader: string | null): boolean {
  if (!hostHeader) return false;
  const hostname = hostHeader.split(':')[0]?.trim().toLowerCase();
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function allowLocalDevAdminBypass(request: NextRequest | Request): boolean {
  if (request.headers.get('x-v2-dev-bypass') !== '1') return false;
  return isLocalDevelopmentHost(request.headers.get('host'));
}

export async function guardV2AdminAccess(
  request: NextRequest | Request,
  requiredRole: V2Role = 'admin'
): Promise<NextResponse | null> {
  if (allowLocalDevAdminBypass(request)) {
    return null;
  }

  const expectedToken =
    process.env.V2_ADMIN_TOKEN ??
    process.env.USER_ADMIN_TOKEN ??
    process.env.QUESTION_ADMIN_TOKEN ??
    process.env.MODULE_PLANNER_ADMIN_TOKEN;

  const hasRole = await hasRequiredRole(request, requiredRole);
  if (expectedToken && expectedToken.trim().length > 0) {
    const provided = getProvidedV2AdminToken(request);
    if (provided === expectedToken.trim() || hasRole) {
      return null;
    }
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Missing or invalid V2 admin token.' },
      { status: 401 }
    );
  }

  if (!hasRole) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: `V2 ${requiredRole} role required.` },
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
