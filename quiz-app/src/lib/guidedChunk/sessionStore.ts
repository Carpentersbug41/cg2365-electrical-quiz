import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { GuidedChunkSession } from '@/lib/guidedChunk/types';

const STORE_DIR = path.join(process.cwd(), '.runtime', 'guided-chunk-sessions');

async function ensureStoreDir(): Promise<void> {
  await mkdir(STORE_DIR, { recursive: true });
}

function getSessionPath(sessionId: string): string {
  return path.join(STORE_DIR, `${sessionId}.json`);
}

export async function saveGuidedChunkSession(session: GuidedChunkSession): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { error } = await adminClient.from('gc_sessions').upsert(
      {
        id: session.id,
        user_id: session.userId ?? null,
        lesson_code: session.lessonCode,
        lesson_version_id: session.lessonVersionId ?? null,
        lesson_status: session.lessonStatus ?? null,
        source_context: session.sourceContext ?? 'guided_chunk_runtime',
        runtime_version: session.runtimeVersion,
        variant_id: session.variantId,
        status: session.status,
        current_lo_index: session.currentLoIndex,
        thread_count: session.thread.length,
        events_count: session.events.length,
        review_flag_count: session.reviewFlags.length,
        session_json: session,
      },
      { onConflict: 'id' }
    );
    if (!error) {
      const { error: turnsDeleteError } = await adminClient.from('gc_session_turns').delete().eq('session_id', session.id);
      const { error: eventsDeleteError } = await adminClient.from('gc_session_events').delete().eq('session_id', session.id);

      if (!turnsDeleteError && session.thread.length > 0) {
        const { error: turnsInsertError } = await adminClient.from('gc_session_turns').insert(
          session.thread.map((turn, turnIndex) => ({
            session_id: session.id,
            turn_id: turn.id,
            turn_index: turnIndex,
            lesson_code: session.lessonCode,
            lesson_version_id: session.lessonVersionId ?? null,
            role: turn.role,
            kind: turn.kind,
            content_text: 'content' in turn ? turn.content : null,
            turn_json: turn,
            created_at: turn.createdAt,
          }))
        );
        if (turnsInsertError) {
          await ensureStoreDir();
          await writeFile(getSessionPath(session.id), JSON.stringify(session, null, 2), 'utf8');
          return;
        }
      }

      if (!eventsDeleteError && session.events.length > 0) {
        const { error: eventsInsertError } = await adminClient.from('gc_session_events').insert(
          session.events.map((event, eventIndex) => ({
            session_id: session.id,
            event_id: event.id,
            event_index: eventIndex,
            lesson_code: session.lessonCode,
            lesson_version_id: session.lessonVersionId ?? null,
            event_type: event.type,
            payload_json: event.payload,
            created_at: event.createdAt,
          }))
        );
        if (eventsInsertError) {
          await ensureStoreDir();
          await writeFile(getSessionPath(session.id), JSON.stringify(session, null, 2), 'utf8');
          return;
        }
      }

      return;
    }
  }

  await ensureStoreDir();
  await writeFile(getSessionPath(session.id), JSON.stringify(session, null, 2), 'utf8');
}

export async function loadGuidedChunkSession(sessionId: string): Promise<GuidedChunkSession | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_sessions')
      .select('session_json')
      .eq('id', sessionId)
      .limit(1)
      .maybeSingle<{ session_json: GuidedChunkSession }>();
    if (!error && data?.session_json) {
      return data.session_json;
    }
  }

  try {
    const raw = await readFile(getSessionPath(sessionId), 'utf8');
    return JSON.parse(raw) as GuidedChunkSession;
  } catch {
    return null;
  }
}
