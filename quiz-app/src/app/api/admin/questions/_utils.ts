import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/roles';
import { getCurriculumScopeFromReferer, isUnitAllowedForScope, type CurriculumScope } from '@/lib/routing/curriculumScope';
import { getQuestionById } from '@/lib/questions/bankRepo';

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
  const isAdmin = await isAdminRequest(request);
  if (expectedToken && expectedToken.trim().length > 0) {
    const provided = getTokenFromRequest(request);
    if (provided === expectedToken.trim() || isAdmin) {
      return null;
    }
    if (provided !== expectedToken.trim()) {
      return NextResponse.json(
        { success: false, code: 'UNAUTHORIZED', message: 'Missing or invalid question admin token.' },
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

export function getQuestionAdminScope(request: NextRequest | Request): CurriculumScope {
  return getCurriculumScopeFromReferer(request.headers.get('referer'));
}

export function assertUnitInQuestionScope(unitCode: string, scope: CurriculumScope): NextResponse | null {
  if (!isUnitAllowedForScope(unitCode, scope)) {
    return NextResponse.json(
      { success: false, code: 'FORBIDDEN_SCOPE', message: 'Unit is not allowed in current curriculum scope.' },
      { status: 403 }
    );
  }
  return null;
}

export async function assertQuestionIdInScope(
  questionId: string,
  scope: CurriculumScope
): Promise<{ denied: NextResponse | null; questionUnitCode: string | null }> {
  const question = await getQuestionById(questionId);
  if (!question) {
    return { denied: NextResponse.json({ success: false, message: `Question not found: ${questionId}` }, { status: 404 }), questionUnitCode: null };
  }
  const denied = assertUnitInQuestionScope(question.unit_code, scope);
  if (denied) {
    return {
      denied: NextResponse.json({ success: false, message: `Question not found: ${questionId}` }, { status: 404 }),
      questionUnitCode: question.unit_code,
    };
  }
  return { denied: null, questionUnitCode: question.unit_code };
}
