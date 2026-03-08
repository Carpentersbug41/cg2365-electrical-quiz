import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/roles';

export async function guardUserAdminAccess(request: NextRequest | Request): Promise<NextResponse | null> {
  const expectedToken =
    process.env.USER_ADMIN_TOKEN ??
    process.env.QUESTION_ADMIN_TOKEN ??
    process.env.MODULE_PLANNER_ADMIN_TOKEN;
  const isAdmin = await isAdminRequest(request);

  if (expectedToken && expectedToken.trim().length > 0) {
    const direct = request.headers.get('x-user-admin-token');
    const authHeader = request.headers.get('authorization');
    const bearer =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : null;
    const provided = (direct && direct.trim().length > 0 ? direct : bearer) ?? '';
    if (provided === expectedToken.trim() || isAdmin) {
      return null;
    }
    if (provided !== expectedToken.trim()) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Missing or invalid user admin token.' },
        { status: 401 }
      );
    }
  }

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Admin role required.' },
      { status: 401 }
    );
  }

  return null;
}

export function toUserAdminError(error: unknown): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown user admin error.',
    },
    { status: 500 }
  );
}
