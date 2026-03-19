alter table public.gc_session_summaries
  add column if not exists avg_response_latency_seconds numeric(8,2) null,
  add column if not exists fatigue_score numeric(5,2) null,
  add column if not exists fatigue_onset_chunk_index integer null,
  add column if not exists confusion_score numeric(5,2) null,
  add column if not exists disengagement_score numeric(5,2) null,
  add column if not exists support_dependence_score numeric(5,2) null,
  add column if not exists recovery_rate_pct numeric(5,2) null,
  add column if not exists transfer_quality_pct numeric(5,2) null,
  add column if not exists pace_mismatch_score numeric(5,2) null,
  add column if not exists learning_efficiency numeric(8,2) null;

create table if not exists public.gc_experiments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null check (status in ('draft', 'active', 'completed', 'rolled_back', 'cancelled')),
  change_type text not null check (change_type in ('prompt', 'ui', 'runtime', 'telemetry', 'content')),
  hypothesis text not null,
  baseline_variant_id text null,
  target_variant_id text not null,
  runtime_version text null,
  source_context text not null default 'guided_chunk_runtime',
  metrics_to_watch jsonb not null default '[]'::jsonb,
  notes text null,
  created_by uuid null references public.profiles(user_id) on delete set null,
  started_at timestamptz null,
  ended_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gc_experiment_changes (
  id uuid primary key default gen_random_uuid(),
  experiment_id uuid not null references public.gc_experiments(id) on delete cascade,
  lesson_code text null,
  lesson_version_id uuid null references public.gc_lesson_versions(id) on delete set null,
  change_type text not null check (change_type in ('prompt', 'ui', 'runtime', 'telemetry', 'content')),
  runtime_version text null,
  variant_id text not null,
  baseline_variant_id text null,
  source_context text not null default 'guided_chunk_runtime',
  description text not null,
  expected_effect_json jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'completed', 'rolled_back', 'cancelled')),
  result_json jsonb not null default '{}'::jsonb,
  created_by uuid null references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_gc_session_summaries_variant_metrics
  on public.gc_session_summaries (lesson_code, lesson_version_id, source_context, updated_at desc);

create index if not exists idx_gc_experiments_status_updated
  on public.gc_experiments (status, updated_at desc);

create index if not exists idx_gc_experiment_changes_experiment
  on public.gc_experiment_changes (experiment_id, updated_at desc);

create index if not exists idx_gc_experiment_changes_variant
  on public.gc_experiment_changes (variant_id, baseline_variant_id, updated_at desc);

drop trigger if exists trg_gc_experiments_updated_at on public.gc_experiments;
create trigger trg_gc_experiments_updated_at
before update on public.gc_experiments
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_gc_experiment_changes_updated_at on public.gc_experiment_changes;
create trigger trg_gc_experiment_changes_updated_at
before update on public.gc_experiment_changes
for each row execute function public.gc_set_updated_at();
