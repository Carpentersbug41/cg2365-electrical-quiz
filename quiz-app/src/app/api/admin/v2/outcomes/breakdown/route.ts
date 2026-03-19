import { NextRequest, NextResponse } from 'next/server';
import { listV2PrivilegedUserIds } from '@/lib/v2/access';
import { createV2AdminClient, guardV2AdminAccess, toV2AdminError } from '@/lib/v2/admin/api';

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;
const DB_PAGE_SIZE = 1000;

type ProfileRow = {
  user_id: string;
  role: 'student' | 'admin';
};

type MasteryBreakdownRow = {
  user_id: string;
  lesson_id: string;
  attempts_count: number | null;
  best_score_percent: number | null;
  mastery_status: 'pending' | 'achieved';
  v2_lessons?: {
    code: string;
    title: string;
    v2_units?: {
      code: string;
      name: string;
    } | null;
  } | null;
};

type SortDir = 'asc' | 'desc';
type LessonSortField = 'mastery_rate' | 'average_best_score' | 'average_attempts' | 'learners_started' | 'lesson_code';
type UnitSortField = 'mastery_rate' | 'average_best_score' | 'average_attempts' | 'learners_started' | 'unit_code';

function parseDays(raw: string | null): number {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, value);
}

function buildSinceIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function parseSortDir(raw: string | null): SortDir {
  return raw === 'asc' ? 'asc' : 'desc';
}

function parseLimit(raw: string | null): number | null {
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.min(200, value);
}

function toPercent(numerator: number, denominator: number): number | null {
  if (denominator <= 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => Promise<{ data: T[] | null; error: Error | null }>
): Promise<T[]> {
  const rows: T[] = [];
  let from = 0;
  while (true) {
    const to = from + DB_PAGE_SIZE - 1;
    const { data, error } = await fetchPage(from, to);
    if (error) throw error;
    const pageRows = data ?? [];
    rows.push(...pageRows);
    if (pageRows.length < DB_PAGE_SIZE) break;
    from += DB_PAGE_SIZE;
  }
  return rows;
}

export async function GET(request: NextRequest) {
  const denied = await guardV2AdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createV2AdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const days = parseDays(request.nextUrl.searchParams.get('days'));
    const sinceIso = buildSinceIso(days);
    const lessonCodeFilter = request.nextUrl.searchParams.get('lessonCode')?.trim().toLowerCase() ?? '';
    const unitCodeFilter = request.nextUrl.searchParams.get('unitCode')?.trim().toLowerCase() ?? '';
    const lessonSortBy = (request.nextUrl.searchParams.get('lessonSortBy')?.trim() ?? 'mastery_rate') as LessonSortField;
    const unitSortBy = (request.nextUrl.searchParams.get('unitSortBy')?.trim() ?? 'mastery_rate') as UnitSortField;
    const sortDir = parseSortDir(request.nextUrl.searchParams.get('sortDir'));
    const limit = parseLimit(request.nextUrl.searchParams.get('limit'));

    const [profiles, masteryRows, privilegedUserIds] = await Promise.all([
      fetchAllRows<ProfileRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('profiles')
          .select('user_id, role')
          .range(from, to);
        return { data: data as ProfileRow[] | null, error: error as Error | null };
      }),
      fetchAllRows<MasteryBreakdownRow>(async (from, to) => {
        const { data, error } = await adminClient
          .from('v2_mastery_records')
          .select('user_id, lesson_id, attempts_count, best_score_percent, mastery_status, v2_lessons(code,title,v2_units(code,name))')
          .or(`last_attempt_at.gte.${sinceIso},first_attempt_at.gte.${sinceIso},achieved_at.gte.${sinceIso}`)
          .range(from, to);
        return { data: data as MasteryBreakdownRow[] | null, error: error as Error | null };
      }),
      listV2PrivilegedUserIds(adminClient),
    ]);

    const studentIds = new Set(
      profiles
        .filter((profile) => profile.role !== 'admin' && !privilegedUserIds.has(profile.user_id))
        .map((profile) => profile.user_id)
    );

    const lessonBuckets = new Map<
      string,
      {
        lesson_id: string;
        lesson_code: string;
        lesson_title: string;
        unit_code: string | null;
        unit_name: string | null;
        learners_started: number;
        learners_mastered: number;
        best_score_sum: number;
        best_score_count: number;
        attempts_sum: number;
      }
    >();

    const unitBuckets = new Map<
      string,
      {
        unit_code: string;
        unit_name: string;
        lesson_ids: Set<string>;
        learners_started: number;
        learners_mastered: number;
        best_score_sum: number;
        best_score_count: number;
        attempts_sum: number;
      }
    >();

    for (const row of masteryRows) {
      if (!studentIds.has(row.user_id)) continue;

      const lessonCode = row.v2_lessons?.code ?? row.lesson_id;
      const lessonTitle = row.v2_lessons?.title ?? row.lesson_id;
      const unitCode = row.v2_lessons?.v2_units?.code ?? null;
      const unitName = row.v2_lessons?.v2_units?.name ?? null;

      const lessonBucket =
        lessonBuckets.get(row.lesson_id) ??
        {
          lesson_id: row.lesson_id,
          lesson_code: lessonCode,
          lesson_title: lessonTitle,
          unit_code: unitCode,
          unit_name: unitName,
          learners_started: 0,
          learners_mastered: 0,
          best_score_sum: 0,
          best_score_count: 0,
          attempts_sum: 0,
        };

      lessonBucket.learners_started += 1;
      if (row.mastery_status === 'achieved') lessonBucket.learners_mastered += 1;
      if (typeof row.best_score_percent === 'number') {
        lessonBucket.best_score_sum += row.best_score_percent;
        lessonBucket.best_score_count += 1;
      }
      lessonBucket.attempts_sum += row.attempts_count ?? 0;
      lessonBuckets.set(row.lesson_id, lessonBucket);

      if (unitCode && unitName) {
        const unitBucket =
          unitBuckets.get(unitCode) ??
          {
            unit_code: unitCode,
            unit_name: unitName,
            lesson_ids: new Set<string>(),
            learners_started: 0,
            learners_mastered: 0,
            best_score_sum: 0,
            best_score_count: 0,
            attempts_sum: 0,
          };
        unitBucket.lesson_ids.add(row.lesson_id);
        unitBucket.learners_started += 1;
        if (row.mastery_status === 'achieved') unitBucket.learners_mastered += 1;
        if (typeof row.best_score_percent === 'number') {
          unitBucket.best_score_sum += row.best_score_percent;
          unitBucket.best_score_count += 1;
        }
        unitBucket.attempts_sum += row.attempts_count ?? 0;
        unitBuckets.set(unitCode, unitBucket);
      }
    }

    const lessons = Array.from(lessonBuckets.values())
      .map((bucket) => ({
        lesson_id: bucket.lesson_id,
        lesson_code: bucket.lesson_code,
        lesson_title: bucket.lesson_title,
        unit_code: bucket.unit_code,
        unit_name: bucket.unit_name,
        learners_started: bucket.learners_started,
        learners_mastered: bucket.learners_mastered,
        mastery_rate_pct: toPercent(bucket.learners_mastered, bucket.learners_started),
        average_best_score_pct:
          bucket.best_score_count > 0 ? Math.round((bucket.best_score_sum / bucket.best_score_count) * 10) / 10 : null,
        average_attempts:
          bucket.learners_started > 0 ? Math.round((bucket.attempts_sum / bucket.learners_started) * 10) / 10 : null,
      }))
      .filter((row) => {
        if (lessonCodeFilter && !row.lesson_code.toLowerCase().includes(lessonCodeFilter)) return false;
        if (unitCodeFilter && !(row.unit_code ?? '').toLowerCase().includes(unitCodeFilter)) return false;
        return true;
      });

    const units = Array.from(unitBuckets.values())
      .map((bucket) => ({
        unit_code: bucket.unit_code,
        unit_name: bucket.unit_name,
        lessons_tracked: bucket.lesson_ids.size,
        learners_started: bucket.learners_started,
        learners_mastered: bucket.learners_mastered,
        mastery_rate_pct: toPercent(bucket.learners_mastered, bucket.learners_started),
        average_best_score_pct:
          bucket.best_score_count > 0 ? Math.round((bucket.best_score_sum / bucket.best_score_count) * 10) / 10 : null,
        average_attempts:
          bucket.learners_started > 0 ? Math.round((bucket.attempts_sum / bucket.learners_started) * 10) / 10 : null,
      }))
      .filter((row) => {
        if (unitCodeFilter && !row.unit_code.toLowerCase().includes(unitCodeFilter)) return false;
        return true;
      });

    const dir = sortDir === 'asc' ? 1 : -1;
    lessons.sort((a, b) => {
      if (lessonSortBy === 'lesson_code') return a.lesson_code.localeCompare(b.lesson_code) * dir;
      if (lessonSortBy === 'learners_started') return (a.learners_started - b.learners_started) * dir;
      if (lessonSortBy === 'average_attempts') return ((a.average_attempts ?? -1) - (b.average_attempts ?? -1)) * dir;
      if (lessonSortBy === 'average_best_score') return ((a.average_best_score_pct ?? -1) - (b.average_best_score_pct ?? -1)) * dir;
      return ((a.mastery_rate_pct ?? -1) - (b.mastery_rate_pct ?? -1)) * dir;
    });
    units.sort((a, b) => {
      if (unitSortBy === 'unit_code') return a.unit_code.localeCompare(b.unit_code) * dir;
      if (unitSortBy === 'learners_started') return (a.learners_started - b.learners_started) * dir;
      if (unitSortBy === 'average_attempts') return ((a.average_attempts ?? -1) - (b.average_attempts ?? -1)) * dir;
      if (unitSortBy === 'average_best_score') return ((a.average_best_score_pct ?? -1) - (b.average_best_score_pct ?? -1)) * dir;
      return ((a.mastery_rate_pct ?? -1) - (b.mastery_rate_pct ?? -1)) * dir;
    });

    return NextResponse.json({
      success: true,
      window: { days, since_iso: sinceIso, now_iso: new Date().toISOString() },
      filters: {
        lessonCode: lessonCodeFilter || null,
        unitCode: unitCodeFilter || null,
        lessonSortBy,
        unitSortBy,
        sortDir,
        limit,
      },
      units: limit ? units.slice(0, limit) : units,
      lessons: limit ? lessons.slice(0, limit) : lessons,
    });
  } catch (error) {
    return toV2AdminError(error);
  }
}
