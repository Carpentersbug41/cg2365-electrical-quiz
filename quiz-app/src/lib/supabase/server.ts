import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { getSupabaseConfig } from './config';

const BEARER_PREFIX = 'Bearer ';

export interface SupabaseRequestSession {
  accessToken: string;
  user: User;
  client: SupabaseClient;
}

export function createSupabaseServerClient(accessToken?: string): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) {
    return null;
  }

  const headers: Record<string, string> = {};
  if (accessToken) {
    headers.Authorization = `${BEARER_PREFIX}${accessToken}`;
  }

  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers,
    },
  });
}

export function getBearerTokenFromRequest(request: NextRequest | Request): string | null {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith(BEARER_PREFIX)) {
    return null;
  }

  return header.slice(BEARER_PREFIX.length).trim() || null;
}

export async function getSupabaseSessionFromRequest(
  request: NextRequest | Request
): Promise<SupabaseRequestSession | null> {
  const accessToken = getBearerTokenFromRequest(request);
  if (!accessToken) {
    return null;
  }

  const client = createSupabaseServerClient(accessToken);
  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  return {
    accessToken,
    user: data.user,
    client,
  };
}
