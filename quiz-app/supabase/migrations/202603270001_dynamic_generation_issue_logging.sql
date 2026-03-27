create table if not exists public.dynamic_generation_runs (
  id uuid primary key default gen_random_uuid(),
  lesson_code text not null,
  source_context text null,
  prompt_version text null,
  run_fingerprint text null,
  origin text not null default 'live_generation' check (origin in ('live_generation', 'artifact_backfill')),
  accepted boolean not null,
  refined boolean not null,
  lesson_score integer not null,
  lesson_grade text not null,
  plan_score integer not null,
  fidelity_score integer not null,
  validation_passed boolean not null,
  issue_count integer not null,
  remaining_patchable_issue_count integer not null,
  attempted_patch_count integer not null,
  accepted_patch_count integer not null,
  repair_stop_reason text null,
  rejection_reason text null,
  report_json jsonb not null default '{}'::jsonb,
  repair_summary_json jsonb null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.dynamic_generation_runs
  add column if not exists run_fingerprint text null,
  add column if not exists origin text not null default 'live_generation';

update public.dynamic_generation_runs
set run_fingerprint = concat('legacy:', id::text)
where run_fingerprint is null;

alter table public.dynamic_generation_runs
  alter column run_fingerprint set not null;

create unique index if not exists idx_dynamic_generation_runs_run_fingerprint
  on public.dynamic_generation_runs (run_fingerprint);

create table if not exists public.dynamic_generation_issues (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.dynamic_generation_runs(id) on delete cascade,
  lesson_code text not null,
  issue_index integer not null,
  category text not null,
  problem text not null,
  why_it_matters text null,
  solution text null,
  suggestion text null,
  json_pointers jsonb not null default '[]'::jsonb,
  repairable boolean not null default false,
  repair_class text null,
  normalized_key text not null,
  resolved_by_repair boolean not null default false,
  score_phase text not null default 'final',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_dynamic_generation_issues_run_issue
  on public.dynamic_generation_issues (run_id, issue_index);

create index if not exists idx_dynamic_generation_runs_created
  on public.dynamic_generation_runs (created_at desc);

create index if not exists idx_dynamic_generation_runs_lesson_created
  on public.dynamic_generation_runs (lesson_code, created_at desc);

create index if not exists idx_dynamic_generation_runs_origin_created
  on public.dynamic_generation_runs (origin, created_at desc);

create index if not exists idx_dynamic_generation_runs_score
  on public.dynamic_generation_runs (lesson_score, created_at desc);

create index if not exists idx_dynamic_generation_issues_key_created
  on public.dynamic_generation_issues (normalized_key, created_at desc);

create index if not exists idx_dynamic_generation_issues_lesson_created
  on public.dynamic_generation_issues (lesson_code, created_at desc);

create index if not exists idx_dynamic_generation_issues_repairable
  on public.dynamic_generation_issues (repairable, created_at desc);
