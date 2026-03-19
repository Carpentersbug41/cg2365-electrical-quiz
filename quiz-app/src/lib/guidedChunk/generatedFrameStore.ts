import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';

const STORE_DIR = path.join(process.cwd(), '.runtime', 'guided-chunk-frames');

function ensureStoreDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function getFramePath(lessonCode: string): string {
  return path.join(STORE_DIR, `${lessonCode}.json`);
}

type LocalStoredFrame = {
  frame: GuidedChunkFrame;
  curriculum?: string | null;
  qualityScore?: number | null;
  grade?: string | null;
  updated: string;
};

function readLocalStoredFrame(lessonCode: string): LocalStoredFrame | null {
  try {
    const framePath = getFramePath(lessonCode);
    if (!existsSync(framePath)) return null;
    const raw = JSON.parse(readFileSync(framePath, 'utf8')) as LocalStoredFrame | GuidedChunkFrame;
    if ('frame' in raw && raw.frame) {
      return raw as LocalStoredFrame;
    }
    const legacyFrame = raw as GuidedChunkFrame;
    return {
      frame: legacyFrame,
      updated: legacyFrame.metadata?.updated ?? legacyFrame.metadata?.created ?? '',
      qualityScore: null,
      grade: null,
    };
  } catch {
    return null;
  }
}

function saveLocalFrame(frame: GuidedChunkFrame, options?: { curriculum?: string | null; qualityScore?: number | null; grade?: string | null }): void {
  ensureStoreDir();
  const stored: LocalStoredFrame = {
    frame,
    curriculum: options?.curriculum ?? null,
    qualityScore: options?.qualityScore ?? null,
    grade: options?.grade ?? null,
    updated: frame.metadata?.updated ?? frame.metadata?.created ?? new Date().toISOString(),
  };
  writeFileSync(getFramePath(frame.lessonCode), JSON.stringify(stored, null, 2), 'utf8');
}

function loadLocalFrame(lessonCode: string): GuidedChunkFrame | null {
  return readLocalStoredFrame(lessonCode)?.frame ?? null;
}

export type StoredGuidedChunkFrameSummary = {
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  runtimeVersion: string;
  variantId: string;
  updated: string;
  loCount: number;
  chunkCount: number;
  qualityScore?: number | null;
  grade?: string | null;
};

function listLocalFrames(): StoredGuidedChunkFrameSummary[] {
  ensureStoreDir();
  const files = readdirSync(STORE_DIR).filter((file) => file.endsWith('.json'));
  const summaries: StoredGuidedChunkFrameSummary[] = [];

  for (const file of files) {
    try {
      const lessonCode = file.replace(/\.json$/i, '');
      const stored = readLocalStoredFrame(lessonCode);
      if (!stored) continue;
      const frame = stored.frame;
      summaries.push({
        lessonCode: frame.lessonCode,
        title: frame.title,
        unit: frame.unit,
        topic: frame.topic,
        runtimeVersion: frame.runtimeVersion,
        variantId: frame.variantId,
        updated: stored.updated,
        loCount: frame.loSequence.length,
        chunkCount: frame.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0),
        qualityScore: stored.qualityScore ?? null,
        grade: stored.grade ?? null,
      });
    } catch {
      continue;
    }
  }

  return summaries.sort((a, b) => b.updated.localeCompare(a.updated));
}

export async function saveGeneratedGuidedChunkFrame(
  frame: GuidedChunkFrame,
  options?: { curriculum?: string | null; qualityScore?: number | null; grade?: string | null; createdBy?: string | null }
): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { error } = await adminClient.from('gc_generated_frames').upsert(
      {
        lesson_code: frame.lessonCode,
        title: frame.title,
        unit: frame.unit,
        topic: frame.topic,
        runtime_version: frame.runtimeVersion,
        variant_id: frame.variantId,
        curriculum: options?.curriculum ?? null,
        quality_score: options?.qualityScore ?? null,
        grade: options?.grade ?? null,
        frame_json: frame,
        source_refs: frame.sourceRefs ?? [],
        created_by: options?.createdBy ?? null,
      },
      { onConflict: 'lesson_code' }
    );
    if (!error) return;
  }

  saveLocalFrame(frame, options);
}

export async function loadGeneratedGuidedChunkFrame(lessonCode: string): Promise<GuidedChunkFrame | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_generated_frames')
      .select('frame_json')
      .eq('lesson_code', lessonCode)
      .limit(1)
      .maybeSingle<{ frame_json: GuidedChunkFrame }>();
    if (!error && data?.frame_json) {
      return data.frame_json;
    }
  }

  return loadLocalFrame(lessonCode);
}

export async function listGeneratedGuidedChunkFrames(): Promise<StoredGuidedChunkFrameSummary[]> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_generated_frames')
      .select('lesson_code, title, unit, topic, runtime_version, variant_id, updated_at, quality_score, grade, frame_json')
      .order('updated_at', { ascending: false });
    if (!error && data) {
      return data.map((row) => {
        const frame = row.frame_json as GuidedChunkFrame;
        return {
          lessonCode: row.lesson_code,
          title: row.title,
          unit: row.unit,
          topic: row.topic,
          runtimeVersion: row.runtime_version,
          variantId: row.variant_id,
          updated: row.updated_at,
          loCount: frame.loSequence.length,
          chunkCount: frame.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0),
          qualityScore: row.quality_score ?? null,
          grade: row.grade ?? null,
        };
      });
    }
  }

  return listLocalFrames();
}
