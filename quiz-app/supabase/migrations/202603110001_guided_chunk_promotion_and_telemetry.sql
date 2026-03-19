create table if not exists public.gc_lessons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  unit text not null,
  topic text not null,
  curriculum text null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gc_lesson_versions (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.gc_lessons(id) on delete cascade,
  version_no integer not null check (version_no > 0),
  status text not null check (status in ('draft', 'needs_review', 'approved', 'published', 'retired')),
  source text not null default 'ai' check (source in ('human', 'ai')),
  quality_score numeric(5,2) null check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  grade text null,
  validation_json jsonb not null default '{}'::jsonb,
  content_json jsonb not null,
  source_refs jsonb not null default '[]'::jsonb,
  runtime_version text not null,
  variant_id text not null,
  created_by uuid null references public.profiles(user_id) on delete set null,
  approved_by uuid null references auth.users(id) on delete set null,
  published_at timestamptz null,
  is_current boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (lesson_id, version_no)
);

create unique index if not exists idx_gc_lesson_versions_one_published
  on public.gc_lesson_versions (lesson_id)
  where status = 'published';

create index if not exists idx_gc_lesson_versions_lesson_updated
  on public.gc_lesson_versions (lesson_id, updated_at desc);

create table if not exists public.gc_session_summaries (
  session_id text primary key references public.gc_sessions(id) on delete cascade,
  user_id uuid null references public.profiles(user_id) on delete set null,
  lesson_code text not null,
  lesson_version_id uuid null references public.gc_lesson_versions(id) on delete set null,
  source_context text not null default 'guided_chunk_runtime',
  status text not null check (status in ('active', 'completed', 'abandoned')),
  current_lo_index integer not null default 0,
  exit_chunk_index integer null,
  review_flag_count integer not null default 0,
  repair_count integer not null default 0,
  microbreak_completed_count integer not null default 0,
  microbreak_skipped_count integer not null default 0,
  lo_tests_completed integer not null default 0,
  lo_count integer not null default 0,
  mcq_correct_total integer not null default 0,
  mcq_total integer not null default 0,
  short_answer_passed_total integer not null default 0,
  short_answer_total integer not null default 0,
  events_count integer not null default 0,
  duration_seconds integer null,
  started_at timestamptz not null,
  completed_at timestamptz null,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_gc_session_summaries_lesson_version
  on public.gc_session_summaries (lesson_code, lesson_version_id, updated_at desc);

create index if not exists idx_gc_session_summaries_source_context
  on public.gc_session_summaries (source_context, updated_at desc);

drop trigger if exists trg_gc_lessons_updated_at on public.gc_lessons;
create trigger trg_gc_lessons_updated_at
before update on public.gc_lessons
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_gc_lesson_versions_updated_at on public.gc_lesson_versions;
create trigger trg_gc_lesson_versions_updated_at
before update on public.gc_lesson_versions
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_gc_session_summaries_updated_at on public.gc_session_summaries;
create trigger trg_gc_session_summaries_updated_at
before update on public.gc_session_summaries
for each row execute function public.gc_set_updated_at();
