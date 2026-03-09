'use client';

import { authedFetch } from '@/lib/api/authedFetch';

export async function v2AuthedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return authedFetch(input, init);
}
