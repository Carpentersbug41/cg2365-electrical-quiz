create table if not exists public.gc_generated_frames (
  id uuid primary key default gen_random_uuid(),
  lesson_code text not null unique,
  title text not null,
  unit text not null,
  topic text not null,
  runtime_version text not null,
  variant_id text not null,
  curriculum text null,
  quality_score integer null,
  grade text null,
  frame_json jsonb not null,
  source_refs jsonb not null default '[]'::jsonb,
  created_by uuid null references public.profiles(user_id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gc_sessions (
  id text primary key,
  user_id uuid null references public.profiles(user_id) on delete set null,
  lesson_code text not null,
  runtime_version text not null,
  variant_id text not null,
  status text not null check (status in ('active', 'completed', 'abandoned')),
  session_json jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_gc_generated_frames_updated_at
  on public.gc_generated_frames (updated_at desc);

create index if not exists idx_gc_sessions_user_updated
  on public.gc_sessions (user_id, updated_at desc);

create or replace function public.gc_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_gc_generated_frames_updated_at on public.gc_generated_frames;
create trigger trg_gc_generated_frames_updated_at
before update on public.gc_generated_frames
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_gc_sessions_updated_at on public.gc_sessions;
create trigger trg_gc_sessions_updated_at
before update on public.gc_sessions
for each row execute function public.gc_set_updated_at();
