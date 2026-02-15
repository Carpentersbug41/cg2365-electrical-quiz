create extension if not exists "pgcrypto";

create table if not exists public.syllabus_versions (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  content_hash text not null,
  created_at timestamptz not null default now(),
  meta_json jsonb null
);

create index if not exists idx_syllabus_versions_created_at
  on public.syllabus_versions (created_at desc);

create table if not exists public.syllabus_chunks (
  id uuid primary key default gen_random_uuid(),
  syllabus_version_id uuid not null references public.syllabus_versions(id) on delete cascade,
  ordinal integer not null check (ordinal >= 0),
  text text not null,
  anchor_json jsonb not null default '{}'::jsonb
);

create index if not exists idx_syllabus_chunks_version_ordinal
  on public.syllabus_chunks (syllabus_version_id, ordinal asc);

create table if not exists public.syllabus_structure (
  id uuid primary key default gen_random_uuid(),
  syllabus_version_id uuid not null references public.syllabus_versions(id) on delete cascade,
  unit text not null,
  structure_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (syllabus_version_id, unit)
);

create index if not exists idx_syllabus_structure_version_unit
  on public.syllabus_structure (syllabus_version_id, unit);

create table if not exists public.module_runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  syllabus_version_id uuid not null references public.syllabus_versions(id) on delete restrict,
  unit text not null,
  selected_los_json jsonb not null default '[]'::jsonb,
  constraints_json jsonb null,
  ordering_preference text null check (ordering_preference is null or ordering_preference in ('foundation-first', 'lo-order')),
  notes text null,
  request_json jsonb null,
  request_hash text null,
  chat_transcript text not null default '',
  status text not null default 'created',
  error_json jsonb null
);

create index if not exists idx_module_runs_created_at
  on public.module_runs (created_at desc);

create index if not exists idx_module_runs_request_hash
  on public.module_runs (request_hash);

create table if not exists public.module_run_artifacts (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.module_runs(id) on delete cascade,
  stage text not null check (stage in ('M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6')),
  artifact_json jsonb not null,
  retrieved_chunk_ids jsonb not null default '[]'::jsonb,
  retrieved_chunk_text text not null default '',
  created_at timestamptz not null default now(),
  unique (run_id, stage)
);

create index if not exists idx_module_run_artifacts_run_created
  on public.module_run_artifacts (run_id, created_at desc);

create table if not exists public.generated_lessons (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.module_runs(id) on delete cascade,
  blueprint_id text not null,
  lesson_id text not null,
  lesson_json jsonb null,
  status text not null check (status in ('pending', 'success', 'failed')),
  error text null,
  created_at timestamptz not null default now(),
  unique (run_id, blueprint_id)
);

create index if not exists idx_generated_lessons_run_status
  on public.generated_lessons (run_id, status);
