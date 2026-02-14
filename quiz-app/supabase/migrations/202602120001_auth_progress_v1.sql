-- Auth + Progress Tracking + Retest System (V1)
-- Additive schema; safe to disable via AUTH_PROGRESS_ENABLED.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text null,
  role text not null default 'student' check (role in ('student', 'admin')),
  course_id text null,
  timezone text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  status text not null check (status in ('started', 'completed', 'abandoned')),
  mastery_status text not null default 'pending' check (mastery_status in ('pending', 'achieved')),
  score_best numeric null,
  attempts_count integer not null default 0 check (attempts_count >= 0),
  started_at timestamptz null,
  last_activity_at timestamptz null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text null,
  block_id text null,
  question_stable_id text not null,
  question_type text not null check (question_type in ('mcq', 'short', 'numeric', 'other')),
  correct boolean not null,
  score numeric null,
  user_answer text null,
  attempt_number integer not null default 1 check (attempt_number >= 1),
  response_time_ms integer null check (response_time_ms is null or response_time_ms >= 0),
  ac_key text null,
  ac_source text not null default 'none' check (ac_source in ('question', 'block', 'lesson', 'none')),
  grading_mode text not null check (grading_mode in ('deterministic', 'llm')),
  created_at timestamptz not null default now()
);

create index if not exists idx_question_attempts_user_created_at
  on public.question_attempts (user_id, created_at desc);

create index if not exists idx_question_attempts_user_lesson
  on public.question_attempts (user_id, lesson_id);

create index if not exists idx_question_attempts_user_question_stable
  on public.question_attempts (user_id, question_stable_id);

create index if not exists idx_question_attempts_user_ac_key
  on public.question_attempts (user_id, ac_key);

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_lesson_progress_set_updated_at on public.lesson_progress;
create trigger trg_lesson_progress_set_updated_at
before update on public.lesson_progress
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.question_attempts enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_select_own_or_admin" on public.lesson_progress;
create policy "lesson_progress_select_own_or_admin"
on public.lesson_progress
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "lesson_progress_insert_own" on public.lesson_progress;
create policy "lesson_progress_insert_own"
on public.lesson_progress
for insert
with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_update_own" on public.lesson_progress;
create policy "lesson_progress_update_own"
on public.lesson_progress
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_delete_own" on public.lesson_progress;
create policy "lesson_progress_delete_own"
on public.lesson_progress
for delete
using (auth.uid() = user_id);

drop policy if exists "question_attempts_select_own_or_admin" on public.question_attempts;
create policy "question_attempts_select_own_or_admin"
on public.question_attempts
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "question_attempts_insert_own" on public.question_attempts;
create policy "question_attempts_insert_own"
on public.question_attempts
for insert
with check (auth.uid() = user_id);

drop policy if exists "question_attempts_update_own" on public.question_attempts;
create policy "question_attempts_update_own"
on public.question_attempts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "question_attempts_delete_own" on public.question_attempts;
create policy "question_attempts_delete_own"
on public.question_attempts
for delete
using (auth.uid() = user_id);
