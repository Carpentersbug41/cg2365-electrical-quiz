import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { GuidedChunkFrame } from '@/lib/guidedChunk/types';
import type { GuidedChunkGenerationScore } from '@/lib/generation/guidedChunk/types';

export type GuidedChunkContentStatus = 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
export type GuidedChunkVersionAction = 'submit_review' | 'approve' | 'publish' | 'retire' | 'revert_draft';

export type GuidedChunkVersionValidation = {
  passed: boolean;
  issues: string[];
};

export type GuidedChunkVersionSummary = {
  id: string;
  lessonId: string;
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  curriculum?: string | null;
  versionNo: number;
  status: GuidedChunkContentStatus;
  source: 'human' | 'ai';
  qualityScore?: number | null;
  grade?: string | null;
  validation?: GuidedChunkVersionValidation | null;
  report?: GuidedChunkGenerationScore | null;
  runtimeVersion: string;
  variantId: string;
  loCount: number;
  chunkCount: number;
  isCurrent: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type LocalGuidedLesson = {
  id: string;
  code: string;
  title: string;
  unit: string;
  topic: string;
  curriculum?: string | null;
  createdAt: string;
  updatedAt: string;
};

type LocalGuidedLessonVersion = {
  id: string;
  lessonId: string;
  versionNo: number;
  status: GuidedChunkContentStatus;
  source: 'human' | 'ai';
  qualityScore?: number | null;
  grade?: string | null;
  validation?: GuidedChunkVersionValidation | null;
  report?: GuidedChunkGenerationScore | null;
  frame: GuidedChunkFrame;
  sourceRefs: string[];
  createdBy?: string | null;
  approvedBy?: string | null;
  publishedAt?: string | null;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
};

type LocalStore = {
  lessons: LocalGuidedLesson[];
  versions: LocalGuidedLessonVersion[];
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
  unit: string;
  topic: string;
  curriculum: string | null;
};

type VersionRow = {
  id: string;
  lesson_id: string;
  version_no: number;
  status: GuidedChunkContentStatus;
  source: 'human' | 'ai';
  quality_score: number | null;
  grade: string | null;
  validation_json: GuidedChunkVersionValidation | null;
  report_json: GuidedChunkGenerationScore | null;
  content_json: GuidedChunkFrame;
  runtime_version: string;
  variant_id: string;
  published_at: string | null;
  is_current: boolean;
  created_at: string;
  updated_at: string;
  gc_lessons?: LessonRow | LessonRow[] | null;
};

const STORE_DIR = path.join(process.cwd(), '.runtime');
const STORE_PATH = path.join(STORE_DIR, 'guided-chunk-version-store.json');

const ALLOWED_TRANSITIONS: Record<GuidedChunkContentStatus, GuidedChunkVersionAction[]> = {
  draft: ['submit_review', 'retire'],
  needs_review: ['approve', 'revert_draft', 'retire'],
  approved: ['publish', 'revert_draft', 'retire'],
  published: ['retire'],
  retired: ['revert_draft'],
};

function ensureStoreDir(): void {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function readLocalStore(): LocalStore {
  try {
    if (!existsSync(STORE_PATH)) {
      return { lessons: [], versions: [] };
    }
    const raw = JSON.parse(readFileSync(STORE_PATH, 'utf8')) as Partial<LocalStore>;
    return {
      lessons: Array.isArray(raw.lessons) ? raw.lessons : [],
      versions: Array.isArray(raw.versions) ? raw.versions : [],
    };
  } catch {
    return { lessons: [], versions: [] };
  }
}

function writeLocalStore(store: LocalStore): void {
  ensureStoreDir();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function summarizeVersion(lesson: LocalGuidedLesson, version: LocalGuidedLessonVersion): GuidedChunkVersionSummary {
  return {
    id: version.id,
    lessonId: lesson.id,
    lessonCode: lesson.code,
    title: lesson.title,
    unit: lesson.unit,
    topic: lesson.topic,
    curriculum: lesson.curriculum ?? null,
    versionNo: version.versionNo,
    status: version.status,
    source: version.source,
    qualityScore: version.qualityScore ?? null,
    grade: version.grade ?? null,
    validation: version.validation ?? null,
    report: version.report ?? null,
    runtimeVersion: version.frame.runtimeVersion,
    variantId: version.frame.variantId,
    loCount: version.frame.loSequence.length,
    chunkCount: version.frame.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0),
    isCurrent: version.isCurrent,
    publishedAt: version.publishedAt ?? null,
    createdAt: version.createdAt,
    updatedAt: version.updatedAt,
  };
}

function mapDbVersionSummary(row: VersionRow): GuidedChunkVersionSummary | null {
  const lesson = Array.isArray(row.gc_lessons) ? row.gc_lessons[0] : row.gc_lessons;
  if (!lesson) return null;
  return {
    id: row.id,
    lessonId: row.lesson_id,
    lessonCode: lesson.code,
    title: lesson.title,
    unit: lesson.unit,
    topic: lesson.topic,
    curriculum: lesson.curriculum ?? null,
    versionNo: row.version_no,
    status: row.status,
    source: row.source,
    qualityScore: row.quality_score ?? null,
    grade: row.grade ?? null,
    validation: row.validation_json ?? null,
    report: row.report_json ?? null,
    runtimeVersion: row.runtime_version,
    variantId: row.variant_id,
    loCount: row.content_json.loSequence.length,
    chunkCount: row.content_json.loSequence.reduce((sum, lo) => sum + lo.chunkPlan.length, 0),
    isCurrent: row.is_current,
    publishedAt: row.published_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function ensureDbLesson(input: {
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  curriculum?: string | null;
}): Promise<string | null> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return null;

  const { data: existingRows, error: existingError } = await adminClient
    .from('gc_lessons')
    .select('id')
    .eq('code', input.lessonCode)
    .order('created_at', { ascending: true });
  const existing = Array.isArray(existingRows) ? existingRows[0] : null;
  if (!existingError && existing?.id) {
    await adminClient
      .from('gc_lessons')
      .update({
        title: input.title,
        unit: input.unit,
        topic: input.topic,
        curriculum: input.curriculum ?? null,
      })
      .eq('id', existing.id);
    return existing.id;
  }

  const { data, error } = await adminClient
    .from('gc_lessons')
    .insert({
      code: input.lessonCode,
      title: input.title,
      unit: input.unit,
      topic: input.topic,
      curriculum: input.curriculum ?? null,
    })
    .select('id')
    .single<{ id: string }>();
  if (error) return null;
  return data.id;
}

function ensureLocalLesson(store: LocalStore, input: {
  lessonCode: string;
  title: string;
  unit: string;
  topic: string;
  curriculum?: string | null;
}): LocalGuidedLesson {
  const now = nowIso();
  const existing = store.lessons.find((lesson) => lesson.code === input.lessonCode);
  if (existing) {
    existing.title = input.title;
    existing.unit = input.unit;
    existing.topic = input.topic;
    existing.curriculum = input.curriculum ?? null;
    existing.updatedAt = now;
    return existing;
  }

  const lesson: LocalGuidedLesson = {
    id: randomUUID(),
    code: input.lessonCode,
    title: input.title,
    unit: input.unit,
    topic: input.topic,
    curriculum: input.curriculum ?? null,
    createdAt: now,
    updatedAt: now,
  };
  store.lessons.push(lesson);
  return lesson;
}

function resolveNextStatus(action: GuidedChunkVersionAction): GuidedChunkContentStatus {
  if (action === 'submit_review') return 'needs_review';
  if (action === 'approve') return 'approved';
  if (action === 'publish') return 'published';
  if (action === 'retire') return 'retired';
  return 'draft';
}

export async function createGuidedLessonDraftVersion(input: {
  frame: GuidedChunkFrame;
  curriculum?: string | null;
  qualityScore?: number | null;
  grade?: string | null;
  validation?: GuidedChunkVersionValidation | null;
  report?: GuidedChunkGenerationScore | null;
  source?: 'human' | 'ai';
  createdBy?: string | null;
}): Promise<GuidedChunkVersionSummary> {
  const adminClient = createSupabaseAdminClient();
  const source = input.source ?? 'ai';

  if (adminClient) {
    const lessonId = await ensureDbLesson({
      lessonCode: input.frame.lessonCode,
      title: input.frame.title,
      unit: input.frame.unit,
      topic: input.frame.topic,
      curriculum: input.curriculum ?? null,
    });

    if (lessonId) {
      const { data: latestVersion } = await adminClient
        .from('gc_lesson_versions')
        .select('version_no')
        .eq('lesson_id', lessonId)
        .order('version_no', { ascending: false })
        .limit(1)
        .maybeSingle<{ version_no: number }>();

      const versionNo = (latestVersion?.version_no ?? 0) + 1;
      await adminClient
        .from('gc_lesson_versions')
        .update({ is_current: false })
        .eq('lesson_id', lessonId)
        .eq('is_current', true);

      const { data, error } = await adminClient
        .from('gc_lesson_versions')
        .insert({
          lesson_id: lessonId,
          version_no: versionNo,
          status: 'draft',
          source,
          quality_score: input.qualityScore ?? null,
          grade: input.grade ?? null,
          validation_json: input.validation ?? { passed: true, issues: [] },
          report_json: input.report ?? null,
          content_json: input.frame,
          source_refs: input.frame.sourceRefs ?? [],
          runtime_version: input.frame.runtimeVersion,
          variant_id: input.frame.variantId,
          created_by: input.createdBy ?? null,
          is_current: true,
        })
        .select(
          'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, report_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
        )
        .single<VersionRow>();

      if (!error && data) {
        const summary = mapDbVersionSummary(data);
        if (summary) return summary;
      }
    }
  }

  const store = readLocalStore();
  const lesson = ensureLocalLesson(store, {
    lessonCode: input.frame.lessonCode,
    title: input.frame.title,
    unit: input.frame.unit,
    topic: input.frame.topic,
    curriculum: input.curriculum ?? null,
  });
  const versionNo = Math.max(0, ...store.versions.filter((version) => version.lessonId === lesson.id).map((version) => version.versionNo)) + 1;
  for (const version of store.versions.filter((entry) => entry.lessonId === lesson.id && entry.isCurrent)) {
    version.isCurrent = false;
    version.updatedAt = nowIso();
  }
  const version: LocalGuidedLessonVersion = {
    id: randomUUID(),
    lessonId: lesson.id,
    versionNo,
    status: 'draft',
    source,
    qualityScore: input.qualityScore ?? null,
    grade: input.grade ?? null,
    validation: input.validation ?? { passed: true, issues: [] },
    report: input.report ?? null,
    frame: input.frame,
    sourceRefs: input.frame.sourceRefs ?? [],
    createdBy: input.createdBy ?? null,
    approvedBy: null,
    publishedAt: null,
    isCurrent: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.versions.push(version);
  writeLocalStore(store);
  return summarizeVersion(lesson, version);
}

export async function loadPublishedGuidedChunkFrame(lessonCode: string): Promise<GuidedChunkFrame | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_lesson_versions')
      .select('content_json, gc_lessons!inner(code)')
      .eq('status', 'published')
      .eq('gc_lessons.code', lessonCode)
      .order('published_at', { ascending: false })
      .order('version_no', { ascending: false });
    const row = Array.isArray(data) ? data[0] : null;
    if (!error && row?.content_json) {
      return row.content_json;
    }
  }

  const store = readLocalStore();
  const lesson = store.lessons.find((entry) => entry.code === lessonCode);
  if (!lesson) return null;
  const published = store.versions.find((version) => version.lessonId === lesson.id && version.status === 'published');
  return published?.frame ?? null;
}

export async function getPublishedGuidedChunkVersionSummaryByCode(
  lessonCode: string
): Promise<GuidedChunkVersionSummary | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_lesson_versions')
      .select(
        'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, report_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
      )
      .eq('status', 'published')
      .eq('gc_lessons.code', lessonCode)
      .order('published_at', { ascending: false })
      .order('version_no', { ascending: false });
    const row = Array.isArray(data) ? data[0] : null;
    if (!error && row) {
      return mapDbVersionSummary(row);
    }
  }

  const store = readLocalStore();
  const lesson = store.lessons.find((entry) => entry.code === lessonCode);
  if (!lesson) return null;
  const version = store.versions.find((entry) => entry.lessonId === lesson.id && entry.status === 'published');
  return version ? summarizeVersion(lesson, version) : null;
}

export async function loadGuidedChunkVersionFrame(versionId: string): Promise<GuidedChunkFrame | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_lesson_versions')
      .select('content_json')
      .eq('id', versionId)
      .limit(1)
      .maybeSingle<{ content_json: GuidedChunkFrame }>();
    if (!error && data?.content_json) {
      return data.content_json;
    }
  }

  const store = readLocalStore();
  return store.versions.find((version) => version.id === versionId)?.frame ?? null;
}

export async function getGuidedChunkVersionSummary(versionId: string): Promise<GuidedChunkVersionSummary | null> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_lesson_versions')
      .select(
        'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, report_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
      )
      .eq('id', versionId)
      .limit(1)
      .maybeSingle<VersionRow>();
    if (!error && data) {
      return mapDbVersionSummary(data);
    }
  }

  const store = readLocalStore();
  const version = store.versions.find((entry) => entry.id === versionId);
  if (!version) return null;
  const lesson = store.lessons.find((entry) => entry.id === version.lessonId);
  return lesson ? summarizeVersion(lesson, version) : null;
}

export async function listGuidedLessonVersions(): Promise<GuidedChunkVersionSummary[]> {
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    const { data, error } = await adminClient
      .from('gc_lesson_versions')
      .select(
        'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, report_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
      )
      .order('updated_at', { ascending: false });
    if (!error && data) {
      return data
        .map((row) => mapDbVersionSummary(row as unknown as VersionRow))
        .filter((row): row is GuidedChunkVersionSummary => Boolean(row));
    }
  }

  const store = readLocalStore();
  return store.versions
    .map((version) => {
      const lesson = store.lessons.find((entry) => entry.id === version.lessonId);
      return lesson ? summarizeVersion(lesson, version) : null;
    })
    .filter((row): row is GuidedChunkVersionSummary => Boolean(row))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function transitionGuidedLessonVersion(input: {
  versionId: string;
  action: GuidedChunkVersionAction;
  actorUserId?: string | null;
}): Promise<GuidedChunkVersionSummary> {
  const adminClient = createSupabaseAdminClient();
  const nextStatus = resolveNextStatus(input.action);

  if (adminClient) {
    const { data: current, error } = await adminClient
      .from('gc_lesson_versions')
      .select(
        'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
      )
      .eq('id', input.versionId)
      .limit(1)
      .maybeSingle<VersionRow>();
    if (!error && current) {
      const allowed = ALLOWED_TRANSITIONS[current.status] ?? [];
      if (!allowed.includes(input.action)) {
        throw new Error(`Action ${input.action} is not allowed from status ${current.status}.`);
      }

      if (nextStatus === 'published') {
        await adminClient
          .from('gc_lesson_versions')
          .update({
            status: 'retired',
            is_current: false,
          })
          .eq('lesson_id', current.lesson_id)
          .eq('status', 'published');
      }

      const patch: Record<string, unknown> = {
        status: nextStatus,
        is_current: true,
      };
      if (input.action === 'approve' || input.action === 'publish') {
        patch.approved_by = input.actorUserId ?? null;
      }
      if (nextStatus === 'published') {
        patch.published_at = nowIso();
      } else if (input.action === 'revert_draft') {
        patch.published_at = null;
      }

      const { data: updated, error: updateError } = await adminClient
        .from('gc_lesson_versions')
        .update(patch)
        .eq('id', input.versionId)
        .select(
          'id, lesson_id, version_no, status, source, quality_score, grade, validation_json, report_json, content_json, runtime_version, variant_id, published_at, is_current, created_at, updated_at, gc_lessons!inner(id, code, title, unit, topic, curriculum)'
        )
        .single<VersionRow>();
      if (!updateError && updated) {
        const summary = mapDbVersionSummary(updated);
        if (summary) return summary;
      }
    }
  }

  const store = readLocalStore();
  const version = store.versions.find((entry) => entry.id === input.versionId);
  if (!version) {
    throw new Error('Guided lesson version not found.');
  }
  const allowed = ALLOWED_TRANSITIONS[version.status] ?? [];
  if (!allowed.includes(input.action)) {
    throw new Error(`Action ${input.action} is not allowed from status ${version.status}.`);
  }
  if (nextStatus === 'published') {
    for (const sibling of store.versions.filter((entry) => entry.lessonId === version.lessonId && entry.status === 'published')) {
      sibling.status = 'retired';
      sibling.isCurrent = false;
      sibling.updatedAt = nowIso();
    }
  }
  for (const sibling of store.versions.filter((entry) => entry.lessonId === version.lessonId && entry.id !== version.id)) {
    sibling.isCurrent = false;
  }
  version.status = nextStatus;
  version.isCurrent = nextStatus !== 'retired';
  version.updatedAt = nowIso();
  if (input.action === 'approve' || input.action === 'publish') {
    version.approvedBy = input.actorUserId ?? null;
  }
  if (nextStatus === 'published') {
    version.publishedAt = nowIso();
  } else if (input.action === 'revert_draft') {
    version.publishedAt = null;
  }
  writeLocalStore(store);
  const lesson = store.lessons.find((entry) => entry.id === version.lessonId);
  if (!lesson) {
    throw new Error('Guided lesson not found.');
  }
  return summarizeVersion(lesson, version);
}
