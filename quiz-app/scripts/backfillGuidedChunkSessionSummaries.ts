import { loadEnvFiles, createConfiguredAdminClient } from './lib/v2ContentWorkflow';
import { buildGuidedChunkSessionSummary } from '../src/lib/guidedChunk/telemetry';
import type { GuidedChunkFrame, GuidedChunkSession } from '../src/lib/guidedChunk/types';

type SessionRow = {
  id: string;
  lesson_code: string;
  lesson_version_id: string | null;
  session_json: GuidedChunkSession;
};

type FrameRow = {
  content_json: GuidedChunkFrame;
};

async function main() {
  loadEnvFiles();
  const adminClient = await createConfiguredAdminClient();

  const { data: sessions, error } = await adminClient
    .from('gc_sessions')
    .select('id, lesson_code, lesson_version_id, session_json')
    .order('updated_at', { ascending: false })
    .returns<SessionRow[]>();

  if (error) {
    throw error;
  }

  const rows = sessions ?? [];
  let updated = 0;

  for (const row of rows) {
    const session = structuredClone(row.session_json) as GuidedChunkSession;
    if (!session) continue;

    let frame: GuidedChunkFrame | null = null;
    let versionExists = false;

    if (row.lesson_version_id) {
      const { data: versionFrame, error: versionError } = await adminClient
        .from('gc_lesson_versions')
        .select('content_json')
        .eq('id', row.lesson_version_id)
        .limit(1)
        .maybeSingle<FrameRow>();
      if (versionError) {
        throw versionError;
      }
      versionExists = Boolean(versionFrame?.content_json);
      frame = versionFrame?.content_json ?? null;
    }

    if (!frame) {
      const { data: generatedFrame, error: generatedError } = await adminClient
        .from('gc_generated_frames')
        .select('frame_json')
        .eq('lesson_code', row.lesson_code)
        .limit(1)
        .maybeSingle<{ frame_json: GuidedChunkFrame }>();
      if (generatedError) {
        throw generatedError;
      }
      frame = generatedFrame?.frame_json ?? null;
    }

    if (!frame) {
      console.warn(`[backfill] skipping ${row.id} (${row.lesson_code}) - frame not found`);
      continue;
    }

    if ((row.lesson_version_id || session.lessonVersionId) && !versionExists) {
      session.lessonVersionId = null;
      session.lessonStatus = 'builtin';
    }

    const summary = buildGuidedChunkSessionSummary(frame, session);
    if ((row.lesson_version_id || row.session_json.lessonVersionId) && !versionExists) {
      summary.lesson_version_id = null;
    }
    const { error: upsertError } = await adminClient.from('gc_session_summaries').upsert(summary, {
      onConflict: 'session_id',
    });
    if (upsertError) {
      console.error(
        JSON.stringify(
          {
            sessionId: row.id,
            lessonCode: row.lesson_code,
            rowLessonVersionId: row.lesson_version_id,
            sessionLessonVersionId: session.lessonVersionId,
            summaryLessonVersionId: summary.lesson_version_id,
            versionExists,
          },
          null,
          2
        )
      );
      throw upsertError;
    }
    updated += 1;
  }

  console.log(JSON.stringify({ processed: rows.length, updated }, null, 2));
}

main().catch((error) => {
  console.error('[backfillGuidedChunkSessionSummaries] failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
