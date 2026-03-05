-- Personal quiz sets + persistent review queue (student-owned)
-- Adds account-scoped quiz-set authoring and wrong-answer lifecycle tracking.

create extension if not exists "pgcrypto";

create table if not exists public.student_quiz_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  unit_code text not null,
  level integer not null check (level in (2, 3)),
  question_count integer not null default 20 check (question_count >= 1 and question_count <= 100),
  cadence_days integer not null default 3 check (cadence_days >= 1 and cadence_days <= 60),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_quiz_set_los (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.student_quiz_sets(id) on delete cascade,
  lo_code text not null,
  created_at timestamptz not null default now(),
  unique (set_id, lo_code)
);

create table if not exists public.student_review_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_stable_id text not null,
  unit_code text null,
  lo_code text null,
  ac_code text null,
  status text not null default 'active' check (status in ('active', 'resolved')),
  times_wrong integer not null default 0 check (times_wrong >= 0),
  times_right integer not null default 0 check (times_right >= 0),
  last_wrong_at timestamptz null,
  last_right_at timestamptz null,
  due_at timestamptz not null default now(),
  llm_why_wrong text null,
  llm_how_to_fix text null,
  llm_what_to_review jsonb null,
  resolved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_stable_id)
);

alter table public.question_attempts
  add column if not exists quiz_set_id uuid null references public.student_quiz_sets(id) on delete set null;

create index if not exists idx_student_quiz_sets_user_active
  on public.student_quiz_sets (user_id, is_active, updated_at desc);

create index if not exists idx_student_quiz_set_los_set
  on public.student_quiz_set_los (set_id);

create index if not exists idx_student_review_queue_user_status_due
  on public.student_review_queue (user_id, status, due_at asc);

create index if not exists idx_student_review_queue_user_question
  on public.student_review_queue (user_id, question_stable_id);

create index if not exists idx_question_attempts_user_quiz_set
  on public.question_attempts (user_id, quiz_set_id);

drop trigger if exists trg_student_quiz_sets_set_updated_at on public.student_quiz_sets;
create trigger trg_student_quiz_sets_set_updated_at
before update on public.student_quiz_sets
for each row
execute function public.set_updated_at();

drop trigger if exists trg_student_review_queue_set_updated_at on public.student_review_queue;
create trigger trg_student_review_queue_set_updated_at
before update on public.student_review_queue
for each row
execute function public.set_updated_at();

alter table public.student_quiz_sets enable row level security;
alter table public.student_quiz_set_los enable row level security;
alter table public.student_review_queue enable row level security;

drop policy if exists "student_quiz_sets_select_own_or_admin" on public.student_quiz_sets;
create policy "student_quiz_sets_select_own_or_admin"
on public.student_quiz_sets
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "student_quiz_sets_insert_own" on public.student_quiz_sets;
create policy "student_quiz_sets_insert_own"
on public.student_quiz_sets
for insert
with check (auth.uid() = user_id);

drop policy if exists "student_quiz_sets_update_own" on public.student_quiz_sets;
create policy "student_quiz_sets_update_own"
on public.student_quiz_sets
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "student_quiz_sets_delete_own" on public.student_quiz_sets;
create policy "student_quiz_sets_delete_own"
on public.student_quiz_sets
for delete
using (auth.uid() = user_id);

drop policy if exists "student_quiz_set_los_select_own_or_admin" on public.student_quiz_set_los;
create policy "student_quiz_set_los_select_own_or_admin"
on public.student_quiz_set_los
for select
using (
  exists (
    select 1
    from public.student_quiz_sets s
    where s.id = student_quiz_set_los.set_id
      and (s.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "student_quiz_set_los_insert_own" on public.student_quiz_set_los;
create policy "student_quiz_set_los_insert_own"
on public.student_quiz_set_los
for insert
with check (
  exists (
    select 1
    from public.student_quiz_sets s
    where s.id = student_quiz_set_los.set_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "student_quiz_set_los_update_own" on public.student_quiz_set_los;
create policy "student_quiz_set_los_update_own"
on public.student_quiz_set_los
for update
using (
  exists (
    select 1
    from public.student_quiz_sets s
    where s.id = student_quiz_set_los.set_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.student_quiz_sets s
    where s.id = student_quiz_set_los.set_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "student_quiz_set_los_delete_own" on public.student_quiz_set_los;
create policy "student_quiz_set_los_delete_own"
on public.student_quiz_set_los
for delete
using (
  exists (
    select 1
    from public.student_quiz_sets s
    where s.id = student_quiz_set_los.set_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "student_review_queue_select_own_or_admin" on public.student_review_queue;
create policy "student_review_queue_select_own_or_admin"
on public.student_review_queue
for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "student_review_queue_insert_own" on public.student_review_queue;
create policy "student_review_queue_insert_own"
on public.student_review_queue
for insert
with check (auth.uid() = user_id);

drop policy if exists "student_review_queue_update_own" on public.student_review_queue;
create policy "student_review_queue_update_own"
on public.student_review_queue
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "student_review_queue_delete_own" on public.student_review_queue;
create policy "student_review_queue_delete_own"
on public.student_review_queue
for delete
using (auth.uid() = user_id);
