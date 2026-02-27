import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';

type ProfileRow = {
  user_id: string;
  display_name: string | null;
  role: 'student' | 'admin';
  course_id: string | null;
  tutor_profile_summary: string | null;
  tutor_profile_json: Record<string, unknown> | null;
  updated_at: string;
};

function normalizeSummary(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  return cleaned.slice(0, 500);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function GET(request: NextRequest) {
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('user_id, display_name, role, course_id, tutor_profile_summary, tutor_profile_json, updated_at')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (profilesError) {
      throw profilesError;
    }

    const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      throw usersError;
    }

    const emailById = new Map<string, string | null>(
      (usersData.users ?? []).map((user) => [user.id, user.email ?? null])
    );

    const rows = (profiles ?? []).map((row) => {
      const profile = row as ProfileRow;
      return {
        ...profile,
        email: emailById.get(profile.user_id) ?? null,
      };
    });

    return NextResponse.json({ success: true, profiles: rows });
  } catch (error) {
    return toUserAdminError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json()) as {
      userId?: string;
      tutorProfileSummary?: unknown;
      tutorProfileJson?: unknown;
    };

    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    if (!isUuid(userId)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'A valid userId is required.' },
        { status: 400 }
      );
    }

    if (body.tutorProfileSummary !== undefined && typeof body.tutorProfileSummary !== 'string' && body.tutorProfileSummary !== null) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'tutorProfileSummary must be a string or null.' },
        { status: 400 }
      );
    }

    if (
      body.tutorProfileJson !== undefined &&
      (typeof body.tutorProfileJson !== 'object' || body.tutorProfileJson === null || Array.isArray(body.tutorProfileJson))
    ) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'tutorProfileJson must be an object when provided.' },
        { status: 400 }
      );
    }

    const hasSummaryUpdate = body.tutorProfileSummary !== undefined;
    const hasJsonUpdate = body.tutorProfileJson !== undefined;
    if (!hasSummaryUpdate && !hasJsonUpdate) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'Provide tutorProfileSummary and/or tutorProfileJson.' },
        { status: 400 }
      );
    }

    const { data: userData, error: userLookupError } = await adminClient.auth.admin.getUserById(userId);
    if (userLookupError || !userData.user) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'User not found.' },
        { status: 404 }
      );
    }

    const payload: {
      user_id: string;
      tutor_profile_summary?: string | null;
      tutor_profile_json?: Record<string, unknown>;
    } = {
      user_id: userId,
    };

    if (body.tutorProfileSummary !== undefined) {
      payload.tutor_profile_summary = normalizeSummary(body.tutorProfileSummary);
    }
    if (body.tutorProfileJson !== undefined) {
      payload.tutor_profile_json = body.tutorProfileJson as Record<string, unknown>;
    }

    const { data: row, error } = await adminClient
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select('user_id, display_name, role, course_id, tutor_profile_summary, tutor_profile_json, updated_at')
      .single();

    if (error) {
      throw error;
    }

    const email = userData.user?.email ?? null;

    return NextResponse.json({
      success: true,
      profile: {
        ...(row as ProfileRow),
        email,
      },
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
