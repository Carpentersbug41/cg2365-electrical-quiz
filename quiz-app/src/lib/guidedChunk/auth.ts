import type { NextRequest } from 'next/server';
import { getSupabaseSessionFromRequest } from '@/lib/supabase/server';
import type { GuidedChunkSession } from '@/lib/guidedChunk/types';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';

export async function assertGuidedChunkSessionAccess(
  request: NextRequest,
  session: GuidedChunkSession
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (session.lessonVersionId && session.lessonStatus && session.lessonStatus !== 'published' && session.lessonStatus !== 'builtin') {
    const denied = await guardV2AdminAccess(request, 'content_operator');
    if (denied) {
      return { ok: false, status: denied.status, error: 'Admin access required for guided preview sessions.' };
    }
  }

  if (!session.userId) {
    return { ok: true };
  }

  const authSession = await getSupabaseSessionFromRequest(request);
  if (!authSession?.user.id) {
    return { ok: false, status: 401, error: 'Authentication required for this session.' };
  }

  if (authSession.user.id !== session.userId) {
    return { ok: false, status: 403, error: 'You do not have access to this session.' };
  }

  return { ok: true };
}
