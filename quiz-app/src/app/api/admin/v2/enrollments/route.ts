import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import { getV2DefaultCourse, setV2DefaultEnrollmentStatus, type V2EnrollmentStatus } from '@/lib/v2/enrollment';

const AUTH_USERS_PER_PAGE = 1000;
const MAX_AUTH_USER_PAGES = 20;

type EnrollmentRow = {
  id: string;
  user_id: string;
  status: V2EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
  updated_at: string;
};

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'student' | 'admin';
};

type UpdatePayload = {
  userId?: string;
  email?: string;
  action?: 'grant' | 'withdraw';
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function buildAuthEmailLookup(
  adminClient: NonNullable<ReturnType<typeof createV2AdminClient>>
): Promise<Map<string, string | null>> {
  const lookup = new Map<string, string | null>();
  for (let page = 1; page <= MAX_AUTH_USER_PAGES; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: AUTH_USERS_PER_PAGE,
    });
    if (error) throw error;
    const users = data.users ?? [];
    for (const user of users) {
      lookup.set(user.id, user.email ?? null);
    }
    if (users.length < AUTH_USERS_PER_PAGE) break;
  }
  return lookup;
}

async function resolveUserIdByEmail(
  adminClient: NonNullable<ReturnType<typeof createV2AdminClient>>,
  email: string
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  for (let page = 1; page <= MAX_AUTH_USER_PAGES; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage: AUTH_USERS_PER_PAGE,
    });
    if (error) throw error;
    const users = data.users ?? [];
    const match = users.find((user) => (user.email ?? '').trim().toLowerCase() === normalized);
    if (match) return match.id;
    if (users.length < AUTH_USERS_PER_PAGE) break;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const defaultCourse = await getV2DefaultCourse(adminClient);
    if ('ok' in defaultCourse && !defaultCourse.ok && defaultCourse.code === 'COURSE_NOT_FOUND') {
      return NextResponse.json(
        { success: false, code: defaultCourse.code, message: defaultCourse.message },
        { status: 404 }
      );
    }
    if ('ok' in defaultCourse && !defaultCourse.ok) {
      return NextResponse.json(
        { success: false, code: defaultCourse.code, message: defaultCourse.message },
        { status: 500 }
      );
    }

    const [enrollmentsResult, profilesResult, emailById] = await Promise.all([
      adminClient
        .from('v2_enrollments')
        .select('id, user_id, status, enrolled_at, completed_at, updated_at')
        .eq('course_id', defaultCourse.id)
        .order('updated_at', { ascending: false })
        .limit(200),
      adminClient
        .from('profiles')
        .select('user_id, display_name, role')
        .limit(500),
      buildAuthEmailLookup(adminClient),
    ]);

    if (enrollmentsResult.error) throw enrollmentsResult.error;
    if (profilesResult.error) throw profilesResult.error;

    const profileByUserId = new Map(
      ((profilesResult.data ?? []) as ProfileRow[]).map((profile) => [profile.user_id, profile])
    );

    const enrollments = ((enrollmentsResult.data ?? []) as EnrollmentRow[]).map((row) => ({
      ...row,
      email: emailById.get(row.user_id) ?? null,
      display_name: profileByUserId.get(row.user_id)?.display_name ?? null,
      role: profileByUserId.get(row.user_id)?.role ?? 'student',
    }));

    return NextResponse.json({
      success: true,
      courseId: defaultCourse.id,
      enrollments,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}

export async function POST(request: NextRequest) {
  const denied = await guardV2AdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as UpdatePayload;
    const action = body.action === 'withdraw' ? 'withdraw' : 'grant';
    const userIdInput = typeof body.userId === 'string' ? body.userId.trim() : '';
    const emailInput = typeof body.email === 'string' ? body.email.trim() : '';

    let targetUserId = userIdInput;
    if (!targetUserId && emailInput) {
      targetUserId = (await resolveUserIdByEmail(adminClient, emailInput)) ?? '';
    }

    if (!isUuid(targetUserId)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'A valid userId or known email is required.' },
        { status: 400 }
      );
    }

    const mutation = await setV2DefaultEnrollmentStatus(
      adminClient,
      targetUserId,
      action === 'grant' ? 'active' : 'withdrawn'
    );
    if (!mutation.ok) {
      const status =
        mutation.code === 'COURSE_NOT_FOUND'
          ? 404
          : mutation.code === 'ENROLLMENT_NOT_FOUND'
            ? 404
            : 500;
      return NextResponse.json(
        { success: false, code: mutation.code, message: mutation.message },
        { status }
      );
    }

    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(targetUserId);
    if (userError) throw userError;

    const { data: profileData, error: profileError } = await adminClient
      .from('profiles')
      .select('user_id, display_name, role')
      .eq('user_id', targetUserId)
      .limit(1)
      .maybeSingle<ProfileRow>();
    if (profileError) throw profileError;

    return NextResponse.json({
      success: true,
      enrollment: {
        user_id: targetUserId,
        email: userData.user?.email ?? null,
        display_name: profileData?.display_name ?? null,
        role: profileData?.role ?? 'student',
        course_id: mutation.courseId,
        enrollment_id: mutation.enrollmentId,
        status: mutation.status,
        created: mutation.created,
      },
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
