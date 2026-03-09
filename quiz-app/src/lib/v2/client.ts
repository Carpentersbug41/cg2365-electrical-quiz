'use client';

import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export async function v2AuthedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const client = getSupabaseBrowserClient();
  const session = client ? await client.auth.getSession() : null;
  const token = session?.data.session?.access_token ?? null;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
