import type { SupabaseClient } from '@supabase/supabase-js';

export type V2Role = 'learner' | 'content_operator' | 'admin';

type ProfileRoleRow = {
  role: 'student' | 'admin' | null;
};

type V2RoleRow = {
  role: V2Role;
};

export async function listV2UserRoles(
  client: SupabaseClient,
  userId: string
): Promise<V2Role[]> {
  try {
    const { data, error } = await client
      .from('v2_user_roles')
      .select('role')
      .eq('user_id', userId)
      .returns<V2RoleRow[]>();
    if (!error && Array.isArray(data) && data.length > 0) {
      return Array.from(new Set(data.map((row) => row.role)));
    }
  } catch {
    // Fallback to legacy profile role while the new table is rolling out.
  }

  const { data: profile } = await client
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle<ProfileRoleRow>();
  if (profile?.role === 'admin') {
    return ['admin'];
  }

  return [];
}

export async function hasV2Role(
  client: SupabaseClient,
  userId: string,
  requiredRole: V2Role
): Promise<boolean> {
  const roles = await listV2UserRoles(client, userId);
  if (requiredRole === 'learner') {
    return roles.includes('learner') || roles.length === 0;
  }
  if (requiredRole === 'content_operator') {
    return roles.includes('content_operator') || roles.includes('admin');
  }
  return roles.includes('admin');
}

export async function listV2PrivilegedUserIds(client: SupabaseClient): Promise<Set<string>> {
  const privileged = new Set<string>();

  try {
    const { data: roleRows } = await client
      .from('v2_user_roles')
      .select('user_id, role')
      .in('role', ['content_operator', 'admin'])
      .returns<Array<{ user_id: string; role: V2Role }>>();
    for (const row of roleRows ?? []) {
      privileged.add(row.user_id);
    }
  } catch {
    // Fallback below covers legacy admin-only environments.
  }

  try {
    const { data: adminProfiles } = await client
      .from('profiles')
      .select('user_id, role')
      .eq('role', 'admin')
      .returns<Array<{ user_id: string; role: 'student' | 'admin' }>>();
    for (const row of adminProfiles ?? []) {
      privileged.add(row.user_id);
    }
  } catch {
    // Ignore and return any privileged ids discovered so far.
  }

  return privileged;
}
