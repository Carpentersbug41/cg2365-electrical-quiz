import { NextRequest } from 'next/server';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';

export type AppRole = 'student' | 'admin';

export async function getUserRoleFromRequest(
  request: NextRequest | Request
): Promise<AppRole | null> {
  const session = await getSupabaseSessionFromRequest(request);
  if (!session) {
    return null;
  }

  const { data, error } = await session.client
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .maybeSingle<{ role: AppRole }>();

  if (error) {
    return null;
  }

  return data?.role ?? 'student';
}

export async function isAdminRequest(request: NextRequest | Request): Promise<boolean> {
  const role = await getUserRoleFromRequest(request);
  return role === 'admin';
}

