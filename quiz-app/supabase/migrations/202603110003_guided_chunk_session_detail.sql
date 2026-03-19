alter table if exists public.gc_sessions
  add column if not exists lesson_version_id uuid null references public.gc_lesson_versions(id) on delete set null,
  add column if not exists lesson_status text null,
  add column if not exists source_context text not null default 'guided_chunk_runtime',
  add column if not exists current_lo_index integer not null default 0,
  add column if not exists thread_count integer not null default 0,
  add column if not exists events_count integer not null default 0,
  add column if not exists review_flag_count integer not null default 0;

create table if not exists public.gc_session_turns (
  session_id text not null references public.gc_sessions(id) on delete cascade,
  turn_id text not null,
  turn_index integer not null,
  lesson_code text not null,
  lesson_version_id uuid null references public.gc_lesson_versions(id) on delete set null,
  role text not null,
  kind text not null,
  content_text text null,
  turn_json jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, turn_id)
);

create index if not exists idx_gc_session_turns_session_order
  on public.gc_session_turns (session_id, turn_index);

create index if not exists idx_gc_session_turns_lesson_version
  on public.gc_session_turns (lesson_code, lesson_version_id, created_at desc);

create table if not exists public.gc_session_events (
  session_id text not null references public.gc_sessions(id) on delete cascade,
  event_id text not null,
  event_index integer not null,
  lesson_code text not null,
  lesson_version_id uuid null references public.gc_lesson_versions(id) on delete set null,
  event_type text not null,
  payload_json jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, event_id)
);

create index if not exists idx_gc_session_events_session_order
  on public.gc_session_events (session_id, event_index);

create index if not exists idx_gc_session_events_lesson_version
  on public.gc_session_events (lesson_code, lesson_version_id, created_at desc);

drop trigger if exists trg_gc_session_turns_updated_at on public.gc_session_turns;
create trigger trg_gc_session_turns_updated_at
before update on public.gc_session_turns
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_gc_session_events_updated_at on public.gc_session_events;
create trigger trg_gc_session_events_updated_at
before update on public.gc_session_events
for each row execute function public.gc_set_updated_at();
