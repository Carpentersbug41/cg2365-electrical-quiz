create table if not exists public.syllabus_ingestions (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  state text not null check (state in ('RUNNING', 'READY', 'FAILED')),
  syllabus_version_id uuid null references public.syllabus_versions(id) on delete set null,
  error_message text null,
  meta_json jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_syllabus_ingestions_created_at
  on public.syllabus_ingestions (created_at desc);
