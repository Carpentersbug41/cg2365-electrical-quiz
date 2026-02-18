create extension if not exists "pgcrypto";

create table if not exists public.question_items (
  id uuid primary key default gen_random_uuid(),
  generation_run_id uuid null,
  unit_code text not null,
  lo_code text null,
  ac_code text null,
  level integer not null check (level in (2, 3)),
  difficulty text not null check (difficulty in ('easy', 'med', 'hard')),
  format text not null check (format in ('mcq', 'multi_select', 'short_answer', 'scenario', 'ordering', 'matching')),
  stem text not null,
  options jsonb null,
  correct jsonb not null,
  rationale text null,
  tags jsonb null,
  source text not null check (source in ('static', 'generated', 'syllabus_seed')),
  status text not null check (status in ('draft', 'approved', 'rejected', 'retired')),
  hash text not null,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null,
  approved_by uuid null,
  approved_at timestamptz null,
  doc_ref text null
);

create table if not exists public.question_generation_runs (
  id uuid primary key default gen_random_uuid(),
  unit_code text not null,
  level integer not null check (level in (2, 3)),
  lo_codes jsonb null,
  target_count integer not null check (target_count > 0),
  format_mix jsonb not null,
  difficulty_mix jsonb not null,
  status text not null check (status in ('queued', 'running', 'completed', 'failed', 'cancelled')),
  created_at timestamptz not null default now(),
  created_by uuid null,
  summary jsonb null
);

alter table public.question_items
  drop constraint if exists question_items_generation_run_id_fkey;

alter table public.question_items
  add constraint question_items_generation_run_id_fkey
  foreign key (generation_run_id) references public.question_generation_runs(id) on delete set null;

create table if not exists public.question_generation_run_steps (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.question_generation_runs(id) on delete cascade,
  step_key text not null check (step_key in ('distill', 'analyze', 'extract_coverage', 'plan', 'build_blueprints', 'validate', 'refresh_summary')),
  status text not null check (status in ('queued', 'running', 'completed', 'failed', 'skipped')),
  started_at timestamptz null,
  completed_at timestamptz null,
  output jsonb null,
  error text null,
  unique (run_id, step_key)
);

create table if not exists public.question_reviews (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.question_items(id) on delete cascade,
  action text not null check (action in ('approve', 'reject', 'edit', 'retire')),
  before jsonb null,
  after jsonb null,
  actor uuid null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_question_items_hash
  on public.question_items (hash);

create index if not exists idx_question_items_unit_status
  on public.question_items (unit_code, status);

create index if not exists idx_question_items_unit_lo_status
  on public.question_items (unit_code, lo_code, status);

create index if not exists idx_question_items_unit_lo_ac_status
  on public.question_items (unit_code, lo_code, ac_code, status);

create index if not exists idx_question_items_format
  on public.question_items (format);

create index if not exists idx_question_items_level
  on public.question_items (level);

create index if not exists idx_question_items_run_status
  on public.question_items (generation_run_id, status);

create index if not exists idx_qgr_unit_created
  on public.question_generation_runs (unit_code, created_at desc);
