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

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    new URLSearchParams(window.location.search).get('devBypassAuth') === '1'
  ) {
    headers.set('x-v2-dev-bypass', '1');
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
