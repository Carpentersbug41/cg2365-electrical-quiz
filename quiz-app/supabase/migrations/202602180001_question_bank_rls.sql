create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select
    coalesce((auth.jwt() ->> 'role') = 'admin', false)
    or coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

alter table public.question_items enable row level security;
alter table public.question_generation_runs enable row level security;
alter table public.question_generation_run_steps enable row level security;
alter table public.question_reviews enable row level security;

revoke all on table public.question_items from anon, authenticated;
revoke all on table public.question_generation_runs from anon, authenticated;
revoke all on table public.question_generation_run_steps from anon, authenticated;
revoke all on table public.question_reviews from anon, authenticated;

grant select on table public.question_items to anon, authenticated;
grant select, insert, update, delete on table public.question_items to authenticated;
grant select, insert, update, delete on table public.question_generation_runs to authenticated;
grant select, insert, update, delete on table public.question_generation_run_steps to authenticated;
grant select, insert, update, delete on table public.question_reviews to authenticated;

drop policy if exists question_items_learner_select_approved on public.question_items;
create policy question_items_learner_select_approved
on public.question_items
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists question_items_admin_select_all on public.question_items;
create policy question_items_admin_select_all
on public.question_items
for select
to authenticated
using (public.is_admin());

drop policy if exists question_items_admin_insert on public.question_items;
create policy question_items_admin_insert
on public.question_items
for insert
to authenticated
with check (public.is_admin());

drop policy if exists question_items_admin_update on public.question_items;
create policy question_items_admin_update
on public.question_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists question_items_admin_delete on public.question_items;
create policy question_items_admin_delete
on public.question_items
for delete
to authenticated
using (public.is_admin());

drop policy if exists question_generation_runs_admin_all on public.question_generation_runs;
create policy question_generation_runs_admin_all
on public.question_generation_runs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists question_generation_run_steps_admin_all on public.question_generation_run_steps;
create policy question_generation_run_steps_admin_all
on public.question_generation_run_steps
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists question_reviews_admin_all on public.question_reviews;
create policy question_reviews_admin_all
on public.question_reviews
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
