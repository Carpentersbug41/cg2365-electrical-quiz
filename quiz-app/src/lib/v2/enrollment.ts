import type { SupabaseClient } from '@supabase/supabase-js';

const V2_DEFAULT_COURSE_CODE = 'gcse-biology';

export type V2EnrollmentStatus = 'active' | 'completed' | 'withdrawn';

type EnrollmentBaseError = {
  ok: false;
  code: 'COURSE_NOT_FOUND' | 'QUERY_FAILED';
  message: string;
};

export type V2EnrollmentAccessResult =
  | {
      ok: true;
      courseId: string;
      enrollmentId: string | null;
      status: V2EnrollmentStatus | null;
      hasAccess: boolean;
    }
  | EnrollmentBaseError;

export type V2EnrollmentMutationResult =
  | {
      ok: true;
      courseId: string;
      enrollmentId: string;
      status: V2EnrollmentStatus;
      created: boolean;
    }
  | EnrollmentBaseError
  | {
      ok: false;
      code: 'ENROLLMENT_NOT_FOUND';
      message: string;
    };

export async function getV2DefaultCourse(client: SupabaseClient): Promise<{ id: string } | EnrollmentBaseError> {
  const { data: courseRow, error: courseError } = await client
    .from('v2_courses')
    .select('id')
    .eq('code', V2_DEFAULT_COURSE_CODE)
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (courseError) {
    return { ok: false, code: 'QUERY_FAILED', message: courseError.message };
  }
  if (!courseRow?.id) {
    return { ok: false, code: 'COURSE_NOT_FOUND', message: 'Default V2 course not found.' };
  }
  return { id: courseRow.id };
}

export async function getV2DefaultEnrollmentAccess(
  client: SupabaseClient,
  userId: string
): Promise<V2EnrollmentAccessResult> {
  const course = await getV2DefaultCourse(client);
  if ('ok' in course && !course.ok) return course;

  const { data: existingEnrollment, error: enrollmentError } = await client
    .from('v2_enrollments')
    .select('id, status')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .limit(1)
    .maybeSingle<{ id: string; status: V2EnrollmentStatus }>();
  if (enrollmentError) {
    return { ok: false, code: 'QUERY_FAILED', message: enrollmentError.message };
  }

  return {
    ok: true,
    courseId: course.id,
    enrollmentId: existingEnrollment?.id ?? null,
    status: existingEnrollment?.status ?? null,
    hasAccess: existingEnrollment?.status === 'active',
  };
}

export async function setV2DefaultEnrollmentStatus(
  client: SupabaseClient,
  userId: string,
  status: V2EnrollmentStatus
): Promise<V2EnrollmentMutationResult> {
  const course = await getV2DefaultCourse(client);
  if ('ok' in course && !course.ok) return course;

  const { data: existingEnrollment, error: enrollmentError } = await client
    .from('v2_enrollments')
    .select('id, status')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .limit(1)
    .maybeSingle<{ id: string; status: V2EnrollmentStatus }>();
  if (enrollmentError) {
    return { ok: false, code: 'QUERY_FAILED', message: enrollmentError.message };
  }

  if (!existingEnrollment?.id) {
    if (status !== 'active') {
      return { ok: false, code: 'ENROLLMENT_NOT_FOUND', message: 'V2 enrollment not found for this user.' };
    }

    const { data: inserted, error: insertError } = await client
      .from('v2_enrollments')
      .insert({
        user_id: userId,
        course_id: course.id,
        status: 'active',
      })
      .select('id, status')
      .single<{ id: string; status: V2EnrollmentStatus }>();
    if (insertError) {
      return { ok: false, code: 'QUERY_FAILED', message: insertError.message };
    }

    return {
      ok: true,
      courseId: course.id,
      enrollmentId: inserted.id,
      status: inserted.status,
      created: true,
    };
  }

  const updates: { status: V2EnrollmentStatus; completed_at?: string | null } = { status };
  if (status === 'active') {
    updates.completed_at = null;
  }
  if (status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data: updated, error: updateError } = await client
    .from('v2_enrollments')
    .update(updates)
    .eq('id', existingEnrollment.id)
    .select('id, status')
    .single<{ id: string; status: V2EnrollmentStatus }>();
  if (updateError) {
    return { ok: false, code: 'QUERY_FAILED', message: updateError.message };
  }

  return {
    ok: true,
    courseId: course.id,
    enrollmentId: updated.id,
    status: updated.status,
    created: false,
  };
}
