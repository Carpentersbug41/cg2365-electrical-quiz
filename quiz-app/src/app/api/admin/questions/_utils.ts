import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/roles';

function getTokenFromRequest(request: NextRequest | Request): string | null {
  const direct = request.headers.get('x-question-admin-token');
  if (direct && direct.trim().length > 0) return direct.trim();

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const value = auth.slice('Bearer '.length).trim();
    if (value.length > 0) return value;
  }
  return null;
}

export async function guardQuestionAdminAccess(request: NextRequest | Request): Promise<NextResponse | null> {
  const expectedToken = process.env.QUESTION_ADMIN_TOKEN ?? process.env.MODULE_PLANNER_ADMIN_TOKEN;
  if (expectedToken && expectedToken.trim().length > 0) {
    const provided = getTokenFromRequest(request);
    if (provided !== expectedToken.trim()) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Missing or invalid question admin token.' },
        { status: 401 }
      );
    }
    return null;
  }

  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'Admin role required.' },
      { status: 401 }
    );
  }
  return null;
}

export function toQuestionAdminError(error: unknown): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown question admin error.',
    },
    { status: 500 }
  );
}
