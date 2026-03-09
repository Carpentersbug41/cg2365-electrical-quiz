import { NextRequest, NextResponse } from 'next/server';
import { getV2DefaultEnrollmentAccess } from '@/lib/v2/enrollment';
import { requireV2Session } from '@/lib/v2/session';

export async function POST(request: NextRequest) {
  const { session, response } = await requireV2Session(request);
  if (!session) return response!;

  const result = await getV2DefaultEnrollmentAccess(session.client, session.user.id);
  if (!result.ok) {
    const status = result.code === 'COURSE_NOT_FOUND' ? 404 : 500;
    return NextResponse.json({ success: false, code: result.code, message: result.message }, { status });
  }

  if (!result.hasAccess) {
    return NextResponse.json(
      {
        success: false,
        code: 'ENROLLMENT_REQUIRED',
        message: 'This account does not yet have V2 course access.',
      },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    courseId: result.courseId,
    enrollmentId: result.enrollmentId,
    status: result.status,
  });
}
