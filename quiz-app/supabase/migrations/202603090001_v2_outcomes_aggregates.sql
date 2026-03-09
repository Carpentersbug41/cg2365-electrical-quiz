alter table public.v2_daily_user_metrics
  add column if not exists attempts_correct integer not null default 0 check (attempts_correct >= 0),
  add column if not exists review_on_time integer not null default 0 check (review_on_time >= 0),
  add column if not exists review_backlog integer not null default 0 check (review_backlog >= 0),
  add column if not exists review_recovery_denominator integer not null default 0 check (review_recovery_denominator >= 0),
  add column if not exists review_recovery_numerator integer not null default 0 check (review_recovery_numerator >= 0);

create table if not exists public.v2_daily_ops_metrics (
  day date primary key,
  generation_jobs_total integer not null default 0 check (generation_jobs_total >= 0),
  generation_jobs_succeeded integer not null default 0 check (generation_jobs_succeeded >= 0),
  generation_jobs_failed integer not null default 0 check (generation_jobs_failed >= 0),
  generation_duration_ms_sum bigint not null default 0 check (generation_duration_ms_sum >= 0),
  generation_duration_count integer not null default 0 check (generation_duration_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_v2_daily_ops_metrics_set_updated_at on public.v2_daily_ops_metrics;
create trigger trg_v2_daily_ops_metrics_set_updated_at
before update on public.v2_daily_ops_metrics
for each row execute function public.set_updated_at();

alter table public.v2_daily_ops_metrics enable row level security;

drop policy if exists "v2_daily_ops_metrics_admin_read" on public.v2_daily_ops_metrics;
create policy "v2_daily_ops_metrics_admin_read" on public.v2_daily_ops_metrics
  for select using (public.is_admin());

drop policy if exists "v2_daily_ops_metrics_admin_write" on public.v2_daily_ops_metrics;
create policy "v2_daily_ops_metrics_admin_write" on public.v2_daily_ops_metrics
  for all using (public.is_admin()) with check (public.is_admin());
