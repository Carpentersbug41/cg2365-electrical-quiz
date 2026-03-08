-- V2 Phase 1 foundation schema
-- Intentionally isolated from PoC tables via v2_ prefix.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Shared enums

do $$
begin
  create type public.v2_content_status as enum ('draft', 'needs_review', 'approved', 'published', 'retired');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.v2_generation_status as enum ('queued', 'running', 'succeeded', 'failed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.v2_review_status as enum ('due', 'completed', 'resolved');
exception
  when duplicate_object then null;
end $$;

-- Curriculum + content

create table if not exists public.v2_organizations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.v2_programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.v2_organizations(id) on delete cascade,
  code text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists public.v2_courses (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.v2_programs(id) on delete cascade,
  code text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_id, code)
);

create table if not exists public.v2_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.v2_courses(id) on delete cascade,
  code text not null,
  name text not null,
  order_index integer not null default 1 check (order_index >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, code)
);

create table if not exists public.v2_lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.v2_units(id) on delete cascade,
  code text not null,
  title text not null,
  order_index integer not null default 1 check (order_index >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, code)
);

create table if not exists public.v2_lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  version_no integer not null check (version_no >= 1),
  status public.v2_content_status not null default 'draft',
  source text not null default 'human' check (source in ('human', 'ai')),
  quality_score numeric(5,2) null check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  content_json jsonb not null default '{}'::jsonb,
  is_current boolean not null default false,
  created_by uuid null references auth.users(id) on delete set null,
  approved_by uuid null references auth.users(id) on delete set null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (lesson_id, version_no)
);

create unique index if not exists idx_v2_lesson_versions_one_published
  on public.v2_lesson_versions (lesson_id)
  where status = 'published';

create unique index if not exists idx_v2_lesson_versions_one_current
  on public.v2_lesson_versions (lesson_id)
  where is_current = true;

create table if not exists public.v2_questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid null references public.v2_lessons(id) on delete set null,
  stable_key text not null unique,
  question_type text not null check (question_type in ('mcq', 'short', 'numeric', 'other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.v2_question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.v2_questions(id) on delete cascade,
  version_no integer not null check (version_no >= 1),
  status public.v2_content_status not null default 'draft',
  source text not null default 'human' check (source in ('human', 'ai')),
  quality_score numeric(5,2) null check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  stem text not null,
  answer_key jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  is_current boolean not null default false,
  created_by uuid null references auth.users(id) on delete set null,
  approved_by uuid null references auth.users(id) on delete set null,
  published_at timestamptz null,
  created_at timestamptz not null default now(),
  unique (question_id, version_no)
);

create unique index if not exists idx_v2_question_versions_one_published
  on public.v2_question_versions (question_id)
  where status = 'published';

create unique index if not exists idx_v2_question_versions_one_current
  on public.v2_question_versions (question_id)
  where is_current = true;

-- Learner runtime

create table if not exists public.v2_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.v2_courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'withdrawn')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create table if not exists public.v2_lesson_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  lesson_version_id uuid not null references public.v2_lesson_versions(id) on delete restrict,
  status text not null default 'started' check (status in ('started', 'completed', 'abandoned')),
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.v2_quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_session_id uuid null references public.v2_lesson_sessions(id) on delete set null,
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  lesson_version_id uuid not null references public.v2_lesson_versions(id) on delete restrict,
  source_context text not null default 'lesson_quiz',
  started_at timestamptz not null default now(),
  submitted_at timestamptz null,
  score_percent numeric(5,2) null check (score_percent is null or (score_percent >= 0 and score_percent <= 100)),
  created_at timestamptz not null default now()
);

create table if not exists public.v2_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_session_id uuid not null references public.v2_quiz_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  question_id uuid null references public.v2_questions(id) on delete set null,
  question_version_id uuid null references public.v2_question_versions(id) on delete set null,
  question_stable_id text not null,
  attempt_no integer not null default 1 check (attempt_no >= 1),
  is_correct boolean not null,
  score numeric(7,2) null,
  max_score numeric(7,2) null,
  response_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.v2_mastery_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  mastery_status text not null default 'pending' check (mastery_status in ('pending', 'achieved')),
  best_score_percent numeric(5,2) null check (best_score_percent is null or (best_score_percent >= 0 and best_score_percent <= 100)),
  attempts_count integer not null default 0 check (attempts_count >= 0),
  first_attempt_at timestamptz null,
  last_attempt_at timestamptz null,
  achieved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.v2_review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid null references public.v2_lessons(id) on delete set null,
  question_stable_id text not null,
  status public.v2_review_status not null default 'due',
  due_at timestamptz not null default now(),
  completed_at timestamptz null,
  resolved_at timestamptz null,
  times_wrong integer not null default 0 check (times_wrong >= 0),
  times_right integer not null default 0 check (times_right >= 0),
  source_attempt_id uuid null references public.v2_attempts(id) on delete set null,
  notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_stable_id)
);

create table if not exists public.v2_review_events (
  id uuid primary key default gen_random_uuid(),
  review_item_id uuid not null references public.v2_review_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('due', 'completed', 'resolved', 'reopened')),
  event_ts timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

-- Generation workflow

create table if not exists public.v2_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('lesson_draft', 'question_draft')),
  status public.v2_generation_status not null default 'queued',
  organization_id uuid null references public.v2_organizations(id) on delete set null,
  lesson_id uuid null references public.v2_lessons(id) on delete set null,
  question_id uuid null references public.v2_questions(id) on delete set null,
  requested_by uuid null references auth.users(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  attempts_made integer not null default 0 check (attempts_made >= 0),
  max_attempts integer not null default 3 check (max_attempts >= 1 and max_attempts <= 10),
  locked_by text null,
  locked_at timestamptz null,
  error_message text null,
  queued_at timestamptz not null default now(),
  started_at timestamptz null,
  finished_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.v2_generation_job_steps (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.v2_generation_jobs(id) on delete cascade,
  step_key text not null,
  status public.v2_generation_status not null,
  input_json jsonb not null default '{}'::jsonb,
  output_json jsonb not null default '{}'::jsonb,
  error_message text null,
  duration_ms integer null check (duration_ms is null or duration_ms >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.v2_generation_artifacts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.v2_generation_jobs(id) on delete cascade,
  artifact_type text not null,
  storage_path text null,
  artifact_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.v2_approval_decisions (
  id uuid primary key default gen_random_uuid(),
  lesson_version_id uuid null references public.v2_lesson_versions(id) on delete cascade,
  question_version_id uuid null references public.v2_question_versions(id) on delete cascade,
  decided_by uuid not null references auth.users(id) on delete restrict,
  decision text not null check (decision in ('approved', 'rejected', 'override_publish')),
  reason text null,
  created_at timestamptz not null default now(),
  check (
    (lesson_version_id is not null and question_version_id is null)
    or (lesson_version_id is null and question_version_id is not null)
  )
);

-- Event log + daily aggregates

create table if not exists public.v2_event_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_ts timestamptz not null default now(),
  event_version integer not null default 1 check (event_version >= 1),
  user_id uuid null references auth.users(id) on delete set null,
  organization_id uuid null references public.v2_organizations(id) on delete set null,
  program_id uuid null references public.v2_programs(id) on delete set null,
  course_id uuid null references public.v2_courses(id) on delete set null,
  unit_id uuid null references public.v2_units(id) on delete set null,
  lesson_id uuid null references public.v2_lessons(id) on delete set null,
  lesson_version_id uuid null references public.v2_lesson_versions(id) on delete set null,
  question_id uuid null references public.v2_questions(id) on delete set null,
  question_version_id uuid null references public.v2_question_versions(id) on delete set null,
  session_id uuid null,
  source_context text not null default 'runtime',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.v2_daily_user_metrics (
  day date not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  attempts_count integer not null default 0 check (attempts_count >= 0),
  accuracy_percent numeric(5,2) null check (accuracy_percent is null or (accuracy_percent >= 0 and accuracy_percent <= 100)),
  lessons_started integer not null default 0 check (lessons_started >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  mastered_lessons integer not null default 0 check (mastered_lessons >= 0),
  review_due integer not null default 0 check (review_due >= 0),
  review_resolved integer not null default 0 check (review_resolved >= 0),
  generation_jobs_succeeded integer not null default 0 check (generation_jobs_succeeded >= 0),
  generation_jobs_failed integer not null default 0 check (generation_jobs_failed >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (day, user_id)
);

create table if not exists public.v2_lesson_outcome_metrics (
  day date not null,
  lesson_id uuid not null references public.v2_lessons(id) on delete cascade,
  attempts_count integer not null default 0 check (attempts_count >= 0),
  completion_count integer not null default 0 check (completion_count >= 0),
  mastery_count integer not null default 0 check (mastery_count >= 0),
  avg_score_percent numeric(5,2) null check (avg_score_percent is null or (avg_score_percent >= 0 and avg_score_percent <= 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (day, lesson_id)
);

create table if not exists public.v2_question_quality_metrics (
  day date not null,
  question_id uuid not null references public.v2_questions(id) on delete cascade,
  attempts_count integer not null default 0 check (attempts_count >= 0),
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (day, question_id)
);

-- Indexes

create index if not exists idx_v2_units_course_order
  on public.v2_units (course_id, order_index);

create index if not exists idx_v2_lessons_unit_order
  on public.v2_lessons (unit_id, order_index);

create index if not exists idx_v2_quiz_sessions_user_started
  on public.v2_quiz_sessions (user_id, started_at desc);

create index if not exists idx_v2_attempts_user_lesson_created
  on public.v2_attempts (user_id, lesson_id, created_at desc);

create index if not exists idx_v2_review_items_user_status_due
  on public.v2_review_items (user_id, status, due_at asc);

create index if not exists idx_v2_generation_jobs_status_queued
  on public.v2_generation_jobs (status, queued_at asc);

create index if not exists idx_v2_event_log_event_ts
  on public.v2_event_log (event_type, event_ts desc);

create index if not exists idx_v2_event_log_user_ts
  on public.v2_event_log (user_id, event_ts desc);

create index if not exists idx_v2_event_log_lesson_ts
  on public.v2_event_log (lesson_id, event_ts desc);

-- Triggers

drop trigger if exists trg_v2_organizations_set_updated_at on public.v2_organizations;
create trigger trg_v2_organizations_set_updated_at
before update on public.v2_organizations
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_programs_set_updated_at on public.v2_programs;
create trigger trg_v2_programs_set_updated_at
before update on public.v2_programs
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_courses_set_updated_at on public.v2_courses;
create trigger trg_v2_courses_set_updated_at
before update on public.v2_courses
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_units_set_updated_at on public.v2_units;
create trigger trg_v2_units_set_updated_at
before update on public.v2_units
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_lessons_set_updated_at on public.v2_lessons;
create trigger trg_v2_lessons_set_updated_at
before update on public.v2_lessons
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_enrollments_set_updated_at on public.v2_enrollments;
create trigger trg_v2_enrollments_set_updated_at
before update on public.v2_enrollments
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_lesson_sessions_set_updated_at on public.v2_lesson_sessions;
create trigger trg_v2_lesson_sessions_set_updated_at
before update on public.v2_lesson_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_mastery_records_set_updated_at on public.v2_mastery_records;
create trigger trg_v2_mastery_records_set_updated_at
before update on public.v2_mastery_records
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_review_items_set_updated_at on public.v2_review_items;
create trigger trg_v2_review_items_set_updated_at
before update on public.v2_review_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_generation_jobs_set_updated_at on public.v2_generation_jobs;
create trigger trg_v2_generation_jobs_set_updated_at
before update on public.v2_generation_jobs
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_daily_user_metrics_set_updated_at on public.v2_daily_user_metrics;
create trigger trg_v2_daily_user_metrics_set_updated_at
before update on public.v2_daily_user_metrics
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_lesson_outcome_metrics_set_updated_at on public.v2_lesson_outcome_metrics;
create trigger trg_v2_lesson_outcome_metrics_set_updated_at
before update on public.v2_lesson_outcome_metrics
for each row
execute function public.set_updated_at();

drop trigger if exists trg_v2_question_quality_metrics_set_updated_at on public.v2_question_quality_metrics;
create trigger trg_v2_question_quality_metrics_set_updated_at
before update on public.v2_question_quality_metrics
for each row
execute function public.set_updated_at();

-- RLS

alter table public.v2_organizations enable row level security;
alter table public.v2_programs enable row level security;
alter table public.v2_courses enable row level security;
alter table public.v2_units enable row level security;
alter table public.v2_lessons enable row level security;
alter table public.v2_lesson_versions enable row level security;
alter table public.v2_questions enable row level security;
alter table public.v2_question_versions enable row level security;
alter table public.v2_enrollments enable row level security;
alter table public.v2_lesson_sessions enable row level security;
alter table public.v2_quiz_sessions enable row level security;
alter table public.v2_attempts enable row level security;
alter table public.v2_mastery_records enable row level security;
alter table public.v2_review_items enable row level security;
alter table public.v2_review_events enable row level security;
alter table public.v2_generation_jobs enable row level security;
alter table public.v2_generation_job_steps enable row level security;
alter table public.v2_generation_artifacts enable row level security;
alter table public.v2_approval_decisions enable row level security;
alter table public.v2_event_log enable row level security;
alter table public.v2_daily_user_metrics enable row level security;
alter table public.v2_lesson_outcome_metrics enable row level security;
alter table public.v2_question_quality_metrics enable row level security;

-- Reference content: authenticated can read; admin can write.

drop policy if exists "v2_reference_read" on public.v2_organizations;
create policy "v2_reference_read" on public.v2_organizations
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_reference_admin_write" on public.v2_organizations;
create policy "v2_reference_admin_write" on public.v2_organizations
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_programs_read" on public.v2_programs;
create policy "v2_programs_read" on public.v2_programs
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_programs_admin_write" on public.v2_programs;
create policy "v2_programs_admin_write" on public.v2_programs
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_courses_read" on public.v2_courses;
create policy "v2_courses_read" on public.v2_courses
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_courses_admin_write" on public.v2_courses;
create policy "v2_courses_admin_write" on public.v2_courses
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_units_read" on public.v2_units;
create policy "v2_units_read" on public.v2_units
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_units_admin_write" on public.v2_units;
create policy "v2_units_admin_write" on public.v2_units
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_lessons_read" on public.v2_lessons;
create policy "v2_lessons_read" on public.v2_lessons
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_lessons_admin_write" on public.v2_lessons;
create policy "v2_lessons_admin_write" on public.v2_lessons
for all using (public.is_admin()) with check (public.is_admin());

-- Versioned content: learners read published only.

drop policy if exists "v2_lesson_versions_read" on public.v2_lesson_versions;
create policy "v2_lesson_versions_read" on public.v2_lesson_versions
for select using (status = 'published' or public.is_admin());

drop policy if exists "v2_lesson_versions_admin_write" on public.v2_lesson_versions;
create policy "v2_lesson_versions_admin_write" on public.v2_lesson_versions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_questions_read" on public.v2_questions;
create policy "v2_questions_read" on public.v2_questions
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_questions_admin_write" on public.v2_questions;
create policy "v2_questions_admin_write" on public.v2_questions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_question_versions_read" on public.v2_question_versions;
create policy "v2_question_versions_read" on public.v2_question_versions
for select using (status = 'published' or public.is_admin());

drop policy if exists "v2_question_versions_admin_write" on public.v2_question_versions;
create policy "v2_question_versions_admin_write" on public.v2_question_versions
for all using (public.is_admin()) with check (public.is_admin());

-- Learner-owned runtime entities.

drop policy if exists "v2_enrollments_select_own_or_admin" on public.v2_enrollments;
create policy "v2_enrollments_select_own_or_admin" on public.v2_enrollments
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_enrollments_insert_own_or_admin" on public.v2_enrollments;
create policy "v2_enrollments_insert_own_or_admin" on public.v2_enrollments
for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_enrollments_update_own_or_admin" on public.v2_enrollments;
create policy "v2_enrollments_update_own_or_admin" on public.v2_enrollments
for update using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_lesson_sessions_own_or_admin" on public.v2_lesson_sessions;
create policy "v2_lesson_sessions_own_or_admin" on public.v2_lesson_sessions
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_quiz_sessions_own_or_admin" on public.v2_quiz_sessions;
create policy "v2_quiz_sessions_own_or_admin" on public.v2_quiz_sessions
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_attempts_own_or_admin" on public.v2_attempts;
create policy "v2_attempts_own_or_admin" on public.v2_attempts
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_mastery_records_own_or_admin" on public.v2_mastery_records;
create policy "v2_mastery_records_own_or_admin" on public.v2_mastery_records
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_review_items_own_or_admin" on public.v2_review_items;
create policy "v2_review_items_own_or_admin" on public.v2_review_items
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_review_events_own_or_admin" on public.v2_review_events;
create policy "v2_review_events_own_or_admin" on public.v2_review_events
for all using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

-- Admin/operator entities.

drop policy if exists "v2_generation_jobs_admin_all" on public.v2_generation_jobs;
create policy "v2_generation_jobs_admin_all" on public.v2_generation_jobs
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_generation_job_steps_admin_all" on public.v2_generation_job_steps;
create policy "v2_generation_job_steps_admin_all" on public.v2_generation_job_steps
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_generation_artifacts_admin_all" on public.v2_generation_artifacts;
create policy "v2_generation_artifacts_admin_all" on public.v2_generation_artifacts
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_approval_decisions_admin_all" on public.v2_approval_decisions;
create policy "v2_approval_decisions_admin_all" on public.v2_approval_decisions
for all using (public.is_admin()) with check (public.is_admin());

-- Event log and metrics: users can read own metrics/events; admins can access all.

drop policy if exists "v2_event_log_select_own_or_admin" on public.v2_event_log;
create policy "v2_event_log_select_own_or_admin" on public.v2_event_log
for select using (user_id = auth.uid() or public.is_admin() or user_id is null);

drop policy if exists "v2_event_log_insert_own_or_admin" on public.v2_event_log;
create policy "v2_event_log_insert_own_or_admin" on public.v2_event_log
for insert with check (user_id = auth.uid() or public.is_admin() or user_id is null);

drop policy if exists "v2_daily_user_metrics_select_own_or_admin" on public.v2_daily_user_metrics;
create policy "v2_daily_user_metrics_select_own_or_admin" on public.v2_daily_user_metrics
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_daily_user_metrics_admin_write" on public.v2_daily_user_metrics;
create policy "v2_daily_user_metrics_admin_write" on public.v2_daily_user_metrics
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_lesson_outcome_metrics_read_authenticated" on public.v2_lesson_outcome_metrics;
create policy "v2_lesson_outcome_metrics_read_authenticated" on public.v2_lesson_outcome_metrics
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_lesson_outcome_metrics_admin_write" on public.v2_lesson_outcome_metrics;
create policy "v2_lesson_outcome_metrics_admin_write" on public.v2_lesson_outcome_metrics
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "v2_question_quality_metrics_read_authenticated" on public.v2_question_quality_metrics;
create policy "v2_question_quality_metrics_read_authenticated" on public.v2_question_quality_metrics
for select using (auth.role() = 'authenticated');

drop policy if exists "v2_question_quality_metrics_admin_write" on public.v2_question_quality_metrics;
create policy "v2_question_quality_metrics_admin_write" on public.v2_question_quality_metrics
for all using (public.is_admin()) with check (public.is_admin());
