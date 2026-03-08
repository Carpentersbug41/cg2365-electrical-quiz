import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { guardUserAdminAccess, toUserAdminError } from '@/app/api/admin/users/_utils';
import type { Lesson } from '@/data/lessons/types';

const ORG_CODE = 'demo-org';
const ORG_NAME = 'Demo Organization';
const PROGRAM_CODE = 'gcse-science';
const PROGRAM_NAME = 'GCSE Science';
const COURSE_CODE = 'gcse-biology';
const COURSE_NAME = 'GCSE Biology';

type SeedBody = {
  dryRun?: boolean;
};

type UnitSeedInfo = {
  id: string;
  code: string;
  orderIndex: number;
};

function parseUnitCode(lessonId: string): string | null {
  const match = lessonId.match(/^(BIO-\d+)-/i);
  return match ? match[1].toUpperCase() : null;
}

function toStableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => toStableJson(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${toStableJson(v)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function loadBiologyLessonsFromDisk(): Lesson[] {
  // V2 content source must be isolated from legacy/V1 lesson JSON.
  const baseDir = path.join(process.cwd(), 'src', 'data', 'v2', 'gcse', 'biology');
  if (!fs.existsSync(baseDir)) return [];

  const files = fs.readdirSync(baseDir).filter((name) => name.endsWith('.json')).sort((a, b) => a.localeCompare(b));
  const lessons: Lesson[] = [];

  for (const fileName of files) {
    const fullPath = path.join(baseDir, fileName);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(raw) as Lesson;
    if (!parsed?.id || !/^BIO-/i.test(parsed.id)) continue;
    lessons.push(parsed);
  }

  return lessons;
}

function toOrderFromLessonCode(lessonCode: string): number {
  const tail = lessonCode.split('-').slice(-1)[0] ?? '';
  const num = Number.parseInt(tail.match(/\d+/)?.[0] ?? '0', 10);
  return Number.isFinite(num) && num > 0 ? num : 1;
}

export async function POST(request: NextRequest) {
  const denied = await guardUserAdminAccess(request);
  if (denied) return denied;

  try {
    const adminClient = createSupabaseAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, code: 'SERVICE_UNAVAILABLE', message: 'Supabase admin client is not configured.' },
        { status: 503 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as SeedBody;
    const dryRun = Boolean(body.dryRun);

    const lessons = loadBiologyLessonsFromDisk();
    if (lessons.length === 0) {
      return NextResponse.json(
        { success: false, code: 'NO_SOURCE_DATA', message: 'No GCSE Biology lesson JSON files found.' },
        { status: 404 }
      );
    }

    const { data: orgRow, error: orgError } = await adminClient
      .from('v2_organizations')
      .upsert({ code: ORG_CODE, name: ORG_NAME }, { onConflict: 'code' })
      .select('id')
      .single<{ id: string }>();
    if (orgError) throw orgError;

    const { data: programRow, error: programError } = await adminClient
      .from('v2_programs')
      .upsert(
        {
          organization_id: orgRow.id,
          code: PROGRAM_CODE,
          name: PROGRAM_NAME,
        },
        { onConflict: 'organization_id,code' }
      )
      .select('id')
      .single<{ id: string }>();
    if (programError) throw programError;

    const { data: courseRow, error: courseError } = await adminClient
      .from('v2_courses')
      .upsert(
        {
          program_id: programRow.id,
          code: COURSE_CODE,
          name: COURSE_NAME,
        },
        { onConflict: 'program_id,code' }
      )
      .select('id')
      .single<{ id: string }>();
    if (courseError) throw courseError;

    const unitCodes = Array.from(
      new Set(
        lessons
          .map((lesson) => parseUnitCode(lesson.id))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const unitByCode = new Map<string, UnitSeedInfo>();
    for (let i = 0; i < unitCodes.length; i += 1) {
      const unitCode = unitCodes[i];
      const { data: unitRow, error: unitError } = await adminClient
        .from('v2_units')
        .upsert(
          {
            course_id: courseRow.id,
            code: unitCode,
            name: `Unit ${unitCode}`,
            order_index: i + 1,
          },
          { onConflict: 'course_id,code' }
        )
        .select('id, code, order_index')
        .single<{ id: string; code: string; order_index: number }>();
      if (unitError) throw unitError;
      unitByCode.set(unitRow.code, {
        id: unitRow.id,
        code: unitRow.code,
        orderIndex: unitRow.order_index,
      });
    }

    const runStats = {
      lessonsFound: lessons.length,
      lessonsInserted: 0,
      lessonsUpdated: 0,
      versionsInserted: 0,
      versionsWouldPublish: 0,
      versionsSkippedUnchanged: 0,
    };

    const lessonResults: Array<{
      lessonCode: string;
      action: 'inserted' | 'updated' | 'skipped';
      versionInserted: boolean;
      reason?: string;
    }> = [];

    for (const lesson of lessons) {
      const unitCode = parseUnitCode(lesson.id);
      if (!unitCode) {
        lessonResults.push({
          lessonCode: lesson.id,
          action: 'skipped',
          versionInserted: false,
          reason: 'Invalid lesson id format.',
        });
        continue;
      }

      const unit = unitByCode.get(unitCode);
      if (!unit) {
        lessonResults.push({
          lessonCode: lesson.id,
          action: 'skipped',
          versionInserted: false,
          reason: 'Unit mapping missing.',
        });
        continue;
      }

      const existingLessonQuery = await adminClient
        .from('v2_lessons')
        .select('id, title')
        .eq('unit_id', unit.id)
        .eq('code', lesson.id)
        .limit(1)
        .maybeSingle<{ id: string; title: string }>();
      if (existingLessonQuery.error) throw existingLessonQuery.error;

      let lessonRowId: string;
      let lessonAction: 'inserted' | 'updated' = 'updated';

      if (!existingLessonQuery.data?.id) {
        if (dryRun) {
          lessonAction = 'inserted';
          runStats.versionsWouldPublish += 1;
          lessonResults.push({
            lessonCode: lesson.id,
            action: lessonAction,
            versionInserted: true,
          });
          continue;
        } else {
          const inserted = await adminClient
            .from('v2_lessons')
            .insert({
              unit_id: unit.id,
              code: lesson.id,
              title: lesson.title,
              order_index: toOrderFromLessonCode(lesson.id),
            })
            .select('id')
            .single<{ id: string }>();
          if (inserted.error) throw inserted.error;
          lessonRowId = inserted.data.id;
          runStats.lessonsInserted += 1;
          lessonAction = 'inserted';
        }
      } else {
        lessonRowId = existingLessonQuery.data.id;
        if (!dryRun && existingLessonQuery.data.title !== lesson.title) {
          const updated = await adminClient
            .from('v2_lessons')
            .update({ title: lesson.title, order_index: toOrderFromLessonCode(lesson.id) })
            .eq('id', lessonRowId);
          if (updated.error) throw updated.error;
          runStats.lessonsUpdated += 1;
        }
      }

      const latestVersionQuery = await adminClient
        .from('v2_lesson_versions')
        .select('id, version_no, content_json')
        .eq('lesson_id', lessonRowId)
        .order('version_no', { ascending: false })
        .limit(1)
        .maybeSingle<{ id: string; version_no: number; content_json: unknown }>();
      if (latestVersionQuery.error && !dryRun) throw latestVersionQuery.error;

      const latestVersion = latestVersionQuery.data;
      const contentChanged =
        !latestVersion || toStableJson(latestVersion.content_json) !== toStableJson(lesson);

      if (!contentChanged) {
        runStats.versionsSkippedUnchanged += 1;
        lessonResults.push({
          lessonCode: lesson.id,
          action: lessonAction,
          versionInserted: false,
          reason: 'Content unchanged.',
        });
        continue;
      }

      if (dryRun) {
        runStats.versionsWouldPublish += 1;
        lessonResults.push({
          lessonCode: lesson.id,
          action: lessonAction,
          versionInserted: true,
        });
        continue;
      }

      const nextVersion = (latestVersion?.version_no ?? 0) + 1;

      const retire = await adminClient
        .from('v2_lesson_versions')
        .update({
          is_current: false,
          status: 'retired',
        })
        .eq('lesson_id', lessonRowId)
        .eq('status', 'published');
      if (retire.error) throw retire.error;

      const insertVersion = await adminClient.from('v2_lesson_versions').insert({
        lesson_id: lessonRowId,
        version_no: nextVersion,
        status: 'published',
        source: 'human',
        quality_score: 100,
        content_json: lesson,
        is_current: true,
        created_by: null,
        approved_by: null,
        published_at: new Date().toISOString(),
      });
      if (insertVersion.error) throw insertVersion.error;

      runStats.versionsInserted += 1;
      lessonResults.push({
        lessonCode: lesson.id,
        action: lessonAction,
        versionInserted: true,
      });
    }

    return NextResponse.json({
      success: true,
      dryRun,
      scope: 'gcse-science-biology',
      runStats,
      lessonResults,
    });
  } catch (error) {
    return toUserAdminError(error);
  }
}
