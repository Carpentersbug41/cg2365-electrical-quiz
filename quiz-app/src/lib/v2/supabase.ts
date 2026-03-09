import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { getSupabaseSessionFromRequest, type SupabaseRequestSession } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export function createV2SupabaseAdminClient() {
  return createSupabaseAdminClient();
}

export async function getV2SupabaseSessionFromRequest(
  request: NextRequest | Request
): Promise<SupabaseRequestSession | null> {
  return getSupabaseSessionFromRequest(request);
}
