create table if not exists public.dgv2_sessions (
  id text primary key,
  user_id uuid null references public.profiles(user_id) on delete set null,
  lesson_code text not null,
  lesson_version_id text null,
  source_context text not null default 'dynamic_guided_v2_runtime',
  runtime_surface text not null check (runtime_surface in ('simple_chatbot', 'dynamic_guided_v2')),
  runtime_variant text null,
  status text not null check (status in ('started', 'completed', 'abandoned')),
  thread_count integer not null default 0,
  event_count integer not null default 0,
  current_step_index integer null,
  current_phase text null,
  session_json jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_dgv2_sessions_user_updated
  on public.dgv2_sessions (user_id, updated_at desc);

create index if not exists idx_dgv2_sessions_lesson_updated
  on public.dgv2_sessions (lesson_code, runtime_surface, updated_at desc);

create table if not exists public.dgv2_session_turns (
  session_id text not null references public.dgv2_sessions(id) on delete cascade,
  turn_id text not null,
  turn_index integer not null,
  lesson_code text not null,
  lesson_version_id text null,
  role text not null,
  kind text not null,
  content_text text null,
  turn_json jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, turn_id)
);

create index if not exists idx_dgv2_session_turns_session_order
  on public.dgv2_session_turns (session_id, turn_index);

create index if not exists idx_dgv2_session_turns_lesson_version
  on public.dgv2_session_turns (lesson_code, lesson_version_id, created_at desc);

create table if not exists public.dgv2_session_events (
  session_id text not null references public.dgv2_sessions(id) on delete cascade,
  event_id text not null,
  event_index integer not null,
  lesson_code text not null,
  lesson_version_id text null,
  event_type text not null,
  payload_json jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, event_id)
);

create index if not exists idx_dgv2_session_events_session_order
  on public.dgv2_session_events (session_id, event_index);

create index if not exists idx_dgv2_session_events_lesson_version
  on public.dgv2_session_events (lesson_code, lesson_version_id, created_at desc);

drop trigger if exists trg_dgv2_sessions_updated_at on public.dgv2_sessions;
create trigger trg_dgv2_sessions_updated_at
before update on public.dgv2_sessions
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_dgv2_session_turns_updated_at on public.dgv2_session_turns;
create trigger trg_dgv2_session_turns_updated_at
before update on public.dgv2_session_turns
for each row execute function public.gc_set_updated_at();

drop trigger if exists trg_dgv2_session_events_updated_at on public.dgv2_session_events;
create trigger trg_dgv2_session_events_updated_at
before update on public.dgv2_session_events
for each row execute function public.gc_set_updated_at();
