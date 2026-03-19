do $$
begin
  create type public.v2_user_role as enum ('learner', 'content_operator', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.v2_user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.v2_user_role not null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create index if not exists idx_v2_user_roles_role_user
  on public.v2_user_roles (role, user_id);

alter table public.v2_user_roles enable row level security;

drop policy if exists "v2_user_roles_select_own_or_admin" on public.v2_user_roles;
create policy "v2_user_roles_select_own_or_admin" on public.v2_user_roles
for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "v2_user_roles_admin_write" on public.v2_user_roles;
create policy "v2_user_roles_admin_write" on public.v2_user_roles
for all using (public.is_admin()) with check (public.is_admin());

create unique index if not exists idx_v2_quiz_sessions_one_open_per_lesson_session
  on public.v2_quiz_sessions (lesson_session_id)
  where submitted_at is null and lesson_session_id is not null;
