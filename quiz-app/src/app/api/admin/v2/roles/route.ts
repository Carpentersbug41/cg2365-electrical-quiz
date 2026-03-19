import { NextRequest, NextResponse } from 'next/server';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';
import type { V2Role } from '@/lib/v2/access';

const AUTH_USERS_PER_PAGE = 1000;
const MAX_AUTH_USER_PAGES = 20;

type UpdatePayload = {
  userId?: string;
  email?: string;
  role?: V2Role;
  action?: 'grant' | 'revoke';
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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

    const { data, error } = await adminClient
      .from('v2_user_roles')
      .select('id, user_id, role, created_by, created_at')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      roles: data ?? [],
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
    const role: V2Role =
      body.role === 'content_operator' || body.role === 'learner' || body.role === 'admin'
        ? body.role
        : 'learner';
    const action = body.action === 'revoke' ? 'revoke' : 'grant';
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

    if (action === 'grant') {
      const { error } = await adminClient.from('v2_user_roles').upsert(
        {
          user_id: targetUserId,
          role,
        },
        { onConflict: 'user_id,role' }
      );
      if (error) throw error;
    } else {
      const { error } = await adminClient
        .from('v2_user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', role);
      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      userId: targetUserId,
      role,
      action,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
