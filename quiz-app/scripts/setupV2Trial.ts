import fs from 'node:fs';
import path from 'node:path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { V2Lesson } from '../src/lib/v2/contentTypes';
import { syncPublishedLessonQuestions } from '../src/lib/v2/questionBank';
import { setV2DefaultEnrollmentStatus } from '../src/lib/v2/enrollment';

const ROOT_DIR = process.cwd();

const ORG_CODE = 'demo-org';
const ORG_NAME = 'Demo Organization';
const PROGRAM_CODE = 'gcse-science';
const PROGRAM_NAME = 'GCSE Science';
const COURSE_CODE = 'gcse-biology';
const COURSE_NAME = 'GCSE Biology';

type Role = 'student' | 'admin';

type ManagedUser = {
  userId: string;
  email: string;
  password: string;
  role: Role;
  created: boolean;
};

function loadEnvFile(fileName: string) {
  const filePath = path.join(ROOT_DIR, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 1) continue;

    const key = line.slice(0, idx).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function parseUnitCode(lessonId: string): string | null {
  const match = lessonId.match(/^(BIO-\d+)-/i);
  return match ? match[1].toUpperCase() : null;
}

function loadBiologyLessonsFromDisk(): V2Lesson[] {
  const baseDir = path.join(ROOT_DIR, 'src', 'data', 'v2', 'gcse', 'biology');
  const files = fs.existsSync(baseDir)
    ? fs.readdirSync(baseDir).filter((name) => name.endsWith('.json')).sort((a, b) => a.localeCompare(b))
    : [];

  return files
    .map((fileName) => JSON.parse(fs.readFileSync(path.join(baseDir, fileName), 'utf8')) as V2Lesson)
    .filter((lesson) => lesson?.id?.startsWith('BIO-'));
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, inner]) => `${JSON.stringify(key)}:${stableJson(inner)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function toOrderFromLessonCode(lessonCode: string): number {
  const tail = lessonCode.split('-').slice(-1)[0] ?? '';
  const num = Number.parseInt(tail.match(/\d+/)?.[0] ?? '0', 10);
  return Number.isFinite(num) && num > 0 ? num : 1;
}

async function ensureUser(
  adminClient: SupabaseClient,
  input: { email: string; password: string; role: Role; displayName: string }
): Promise<ManagedUser> {
  const normalizedEmail = input.email.trim().toLowerCase();
  let foundUser: { id: string } | null = null;
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data.users ?? [];
    const match = users.find((user) => (user.email ?? '').trim().toLowerCase() === normalizedEmail);
    if (match) {
      foundUser = { id: match.id };
      break;
    }
    if (users.length < perPage) break;
    page += 1;
  }

  let userId: string;
  let created = false;
  if (foundUser) {
    const { data, error } = await adminClient.auth.admin.updateUserById(foundUser.id, {
      password: input.password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password: input.password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
    created = true;
  }

  const { error: profileError } = await adminClient.from('profiles').upsert(
    {
      user_id: userId,
      role: input.role,
      display_name: input.displayName,
      tutor_profile_summary: `${input.displayName} (${input.role})`,
    },
    { onConflict: 'user_id' }
  );
  if (profileError) throw profileError;

  return {
    userId,
    email: normalizedEmail,
    password: input.password,
    role: input.role,
    created,
  };
}

async function resetLearnerState(adminClient: SupabaseClient, userId: string) {
  const deletions: Array<{ table: string; column: string }> = [
    { table: 'v2_review_events', column: 'user_id' },
    { table: 'v2_attempts', column: 'user_id' },
    { table: 'v2_quiz_sessions', column: 'user_id' },
    { table: 'v2_lesson_sessions', column: 'user_id' },
    { table: 'v2_review_items', column: 'user_id' },
    { table: 'v2_mastery_records', column: 'user_id' },
    { table: 'v2_event_log', column: 'user_id' },
  ];

  for (const deletion of deletions) {
    const { error } = await adminClient.from(deletion.table).delete().eq(deletion.column, userId);
    if (error) throw error;
  }
}

async function createPublishedLessonVersion(
  adminClient: SupabaseClient,
  input: {
    lessonId: string;
    source: 'human' | 'ai';
    qualityScore: number | null;
    contentJson: unknown;
  }
): Promise<{ id: string }> {
  const { data: latestVersion, error: latestVersionError } = await adminClient
    .from('v2_lesson_versions')
    .select('version_no')
    .eq('lesson_id', input.lessonId)
    .order('version_no', { ascending: false })
    .limit(1)
    .maybeSingle<{ version_no: number }>();
  if (latestVersionError) throw latestVersionError;

  const nextVersionNo = (latestVersion?.version_no ?? 0) + 1;
  const publishTs = new Date().toISOString();

  const { error: retirePublishedError } = await adminClient
    .from('v2_lesson_versions')
    .update({
      status: 'retired',
      is_current: false,
    })
    .eq('lesson_id', input.lessonId)
    .eq('status', 'published');
  if (retirePublishedError) throw retirePublishedError;

  const { error: retireCurrentError } = await adminClient
    .from('v2_lesson_versions')
    .update({
      is_current: false,
    })
    .eq('lesson_id', input.lessonId)
    .eq('is_current', true);
  if (retireCurrentError) throw retireCurrentError;

  const { data: insertedVersion, error: insertVersionError } = await adminClient
    .from('v2_lesson_versions')
    .insert({
      lesson_id: input.lessonId,
      version_no: nextVersionNo,
      status: 'published',
      source: input.source,
      quality_score: input.qualityScore,
      content_json: input.contentJson,
      is_current: true,
      created_by: null,
      approved_by: null,
      published_at: publishTs,
    })
    .select('id')
    .single<{ id: string }>();
  if (insertVersionError) throw insertVersionError;

  return insertedVersion;
}

async function ensureBiologySeed(adminClient: SupabaseClient) {
  const lessons = loadBiologyLessonsFromDisk();
  if (lessons.length === 0) {
    throw new Error('No V2 Biology lesson JSON files found.');
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
    new Set(lessons.map((lesson) => parseUnitCode(lesson.id)).filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const unitByCode = new Map<string, { id: string }>();
  for (let i = 0; i < unitCodes.length; i += 1) {
    const { data: unitRow, error: unitError } = await adminClient
      .from('v2_units')
      .upsert(
        {
          course_id: courseRow.id,
          code: unitCodes[i],
          name: `Unit ${unitCodes[i]}`,
          order_index: i + 1,
        },
        { onConflict: 'course_id,code' }
      )
      .select('id, code')
      .single<{ id: string; code: string }>();
    if (unitError) throw unitError;
    unitByCode.set(unitCodes[i], { id: unitRow.id });
  }

  let publishedCount = 0;
  let questionCoverageCount = 0;

  for (const lesson of lessons) {
    const unitCode = parseUnitCode(lesson.id);
    if (!unitCode) continue;
    const unit = unitByCode.get(unitCode);
    if (!unit) continue;

    const { data: existingLesson, error: existingLessonError } = await adminClient
      .from('v2_lessons')
      .select('id, title')
      .eq('unit_id', unit.id)
      .eq('code', lesson.id)
      .limit(1)
      .maybeSingle<{ id: string; title: string }>();
    if (existingLessonError) throw existingLessonError;

    let lessonRowId = existingLesson?.id ?? '';
    if (!lessonRowId) {
      const { data: insertedLesson, error: insertLessonError } = await adminClient
        .from('v2_lessons')
        .insert({
          unit_id: unit.id,
          code: lesson.id,
          title: lesson.title,
          order_index: toOrderFromLessonCode(lesson.id),
        })
        .select('id')
        .single<{ id: string }>();
      if (insertLessonError) throw insertLessonError;
      lessonRowId = insertedLesson.id;
    } else if (existingLesson.title !== lesson.title) {
      const { error: updateLessonError } = await adminClient
        .from('v2_lessons')
        .update({
          title: lesson.title,
          order_index: toOrderFromLessonCode(lesson.id),
        })
        .eq('id', lessonRowId);
      if (updateLessonError) throw updateLessonError;
    }

    const { data: latestVersion, error: latestVersionError } = await adminClient
      .from('v2_lesson_versions')
      .select('id, version_no, status, source, quality_score, content_json')
      .eq('lesson_id', lessonRowId)
      .order('version_no', { ascending: false })
      .limit(1)
      .maybeSingle<{
        id: string;
        version_no: number;
        status: 'draft' | 'needs_review' | 'approved' | 'published' | 'retired';
        source: 'human' | 'ai';
        quality_score: number | null;
        content_json: unknown;
      }>();
    if (latestVersionError) throw latestVersionError;

    let lessonVersionId = latestVersion?.id ?? '';
    const contentChanged = !latestVersion || stableJson(latestVersion.content_json) !== stableJson(lesson);
    if (contentChanged) {
      const insertedVersion = await createPublishedLessonVersion(adminClient, {
        lessonId: lessonRowId,
        source: 'human',
        qualityScore: 100,
        contentJson: lesson,
      });
      lessonVersionId = insertedVersion.id;
    } else if (latestVersion.status !== 'published') {
      const insertedVersion = await createPublishedLessonVersion(adminClient, {
        lessonId: lessonRowId,
        source: latestVersion.source,
        qualityScore: latestVersion.quality_score,
        contentJson: latestVersion.content_json,
      });
      lessonVersionId = insertedVersion.id;
    }

    publishedCount += 1;
    const questionSync = await syncPublishedLessonQuestions(adminClient, {
      lessonId: lessonRowId,
      lessonCode: lesson.id,
      lessonVersionId,
      contentJson: lesson,
      source: 'human',
      qualityScore: 100,
    });
    if (questionSync.questionCount > 0) {
      questionCoverageCount += 1;
    }
  }

  return {
    courseId: courseRow.id,
    lessonsTotal: lessons.length,
    publishedCount,
    questionCoverageCount,
  };
}

async function getLessonReadiness(adminClient: SupabaseClient, lessonCode: string) {
  const { data: lessonRow, error: lessonError } = await adminClient
    .from('v2_lessons')
    .select('id, code, title')
    .eq('code', lessonCode)
    .limit(1)
    .maybeSingle<{ id: string; code: string; title: string }>();
  if (lessonError) throw lessonError;
  if (!lessonRow?.id) {
    throw new Error(`Lesson ${lessonCode} was not found after seeding.`);
  }

  const { data: questions, error: questionsError } = await adminClient
    .from('v2_question_versions')
    .select('id, v2_questions!inner(lesson_id)')
    .eq('status', 'published')
    .eq('is_current', true)
    .eq('v2_questions.lesson_id', lessonRow.id);
  if (questionsError) throw questionsError;

  return {
    lessonId: lessonRow.id,
    lessonCode: lessonRow.code,
    lessonTitle: lessonRow.title,
    publishedQuestionCount: Array.isArray(questions) ? questions.length : 0,
  };
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  const baseUrl = (process.env.TRIAL_BASE_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
  const lessonCode = (process.env.TRIAL_LESSON_CODE || 'BIO-101-1A').trim().toUpperCase();
  const learnerEmail = (process.env.TRIAL_LEARNER_EMAIL || 'trial.v2.learner@example.com').trim().toLowerCase();
  const learnerPassword = (process.env.TRIAL_LEARNER_PASSWORD || 'Trial-pass-123!').trim();
  const adminEmail = (process.env.TRIAL_ADMIN_EMAIL || 'trial.v2.admin@example.com').trim().toLowerCase();
  const adminPassword = (process.env.TRIAL_ADMIN_PASSWORD || 'Trial-admin-123!').trim();

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const learner = await ensureUser(adminClient, {
    email: learnerEmail,
    password: learnerPassword,
    role: 'student',
    displayName: 'V2 Trial Learner',
  });
  const admin = await ensureUser(adminClient, {
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    displayName: 'V2 Trial Admin',
  });

  const enrollment = await setV2DefaultEnrollmentStatus(adminClient, learner.userId, 'active');
  if (!enrollment.ok) {
    throw new Error(`Failed to ensure learner enrollment: ${enrollment.message}`);
  }
  const adminEnrollment = await setV2DefaultEnrollmentStatus(adminClient, admin.userId, 'active');
  if (!adminEnrollment.ok) {
    throw new Error(`Failed to ensure admin enrollment: ${adminEnrollment.message}`);
  }

  await resetLearnerState(adminClient, learner.userId);
  const seed = await ensureBiologySeed(adminClient);
  const readiness = await getLessonReadiness(adminClient, lessonCode);

  console.log('V2 trial setup complete');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Sign-in URL: ${baseUrl}/auth/sign-in?next=${encodeURIComponent(`/v2/learn/${lessonCode}`)}`);
  console.log(`Learner email: ${learner.email}`);
  console.log(`Learner password: ${learner.password}`);
  console.log(`Admin email: ${admin.email}`);
  console.log(`Admin password: ${admin.password}`);
  console.log(`Lesson URL: ${baseUrl}/v2/learn/${lessonCode}`);
  console.log(`Quiz URL: ${baseUrl}/v2/quiz/${lessonCode}`);
  console.log(`Review URL: ${baseUrl}/v2/review`);
  console.log(`Progress URL: ${baseUrl}/v2/progress`);
  console.log(`Admin URL: ${baseUrl}/v2/admin`);
  console.log(`Seeded lessons: ${seed.lessonsTotal}`);
  console.log(`Published lessons ready: ${seed.publishedCount}`);
  console.log(`Lessons with question coverage: ${seed.questionCoverageCount}`);
  console.log(`Chosen lesson title: ${readiness.lessonTitle}`);
  console.log(`Chosen lesson published questions: ${readiness.publishedQuestionCount}`);
  console.log(`Learner enrollment created: ${enrollment.created ? 'yes' : 'no'}`);
  console.log(`Admin enrollment created: ${adminEnrollment.created ? 'yes' : 'no'}`);
  console.log('Learner V2 progress state was reset before provisioning.');
}

main().catch((error) => {
  console.error('[setupV2Trial] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
