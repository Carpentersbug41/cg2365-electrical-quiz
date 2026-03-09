import { NextRequest, NextResponse } from 'next/server';
import { getV2DefaultEnrollmentAccess } from '@/lib/v2/enrollment';
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

export async function requireV2EnrolledSession(
  request: NextRequest | Request
): Promise<{
  session: Awaited<ReturnType<typeof getV2SupabaseSessionFromRequest>>;
  response: NextResponse | null;
}> {
  const base = await requireV2Session(request);
  if (!base.session) return base;

  const enrollment = await getV2DefaultEnrollmentAccess(base.session.client, base.session.user.id);
  if (!enrollment.ok) {
    return {
      session: null,
      response: NextResponse.json(
        { error: enrollment.message, code: enrollment.code },
        { status: enrollment.code === 'COURSE_NOT_FOUND' ? 404 : 500 }
      ),
    };
  }

  if (!enrollment.hasAccess) {
    return {
      session: null,
      response: NextResponse.json(
        {
          error: 'V2 enrollment required for this account.',
          code: 'ENROLLMENT_REQUIRED',
        },
        { status: 403 }
      ),
    };
  }

  return base;
}
