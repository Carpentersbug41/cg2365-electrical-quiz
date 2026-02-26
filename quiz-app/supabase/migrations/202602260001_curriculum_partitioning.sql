-- Curriculum partitioning hardening for shared tables.
-- Keeps one project/table set while enforcing explicit curriculum tagging.

alter table if exists public.syllabus_versions
  add column if not exists curriculum text not null default 'cg2365';

alter table if exists public.module_runs
  add column if not exists curriculum text not null default 'cg2365';

alter table if exists public.question_generation_runs
  add column if not exists curriculum text not null default 'cg2365';

alter table if exists public.question_items
  add column if not exists curriculum text not null default 'cg2365';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'syllabus_versions_curriculum_check'
  ) then
    alter table public.syllabus_versions
      add constraint syllabus_versions_curriculum_check
      check (curriculum in ('cg2365', 'gcse-science-physics'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'module_runs_curriculum_check'
  ) then
    alter table public.module_runs
      add constraint module_runs_curriculum_check
      check (curriculum in ('cg2365', 'gcse-science-physics'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'question_generation_runs_curriculum_check'
  ) then
    alter table public.question_generation_runs
      add constraint question_generation_runs_curriculum_check
      check (curriculum in ('cg2365', 'gcse-science-physics'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'question_items_curriculum_check'
  ) then
    alter table public.question_items
      add constraint question_items_curriculum_check
      check (curriculum in ('cg2365', 'gcse-science-physics'));
  end if;
end $$;

-- Backfill using existing semantics.
update public.syllabus_versions
set curriculum = case
  when coalesce(meta_json ->> 'curriculum', '') = 'gcse-science-physics' then 'gcse-science-physics'
  else 'cg2365'
end
where curriculum not in ('cg2365', 'gcse-science-physics')
   or curriculum is null;

update public.module_runs mr
set curriculum = coalesce(sv.curriculum, 'cg2365')
from public.syllabus_versions sv
where mr.syllabus_version_id = sv.id
  and (mr.curriculum not in ('cg2365', 'gcse-science-physics') or mr.curriculum is null);

update public.question_generation_runs
set curriculum = case
  when unit_code ~* '^PHY-' then 'gcse-science-physics'
  else 'cg2365'
end
where curriculum not in ('cg2365', 'gcse-science-physics')
   or curriculum is null;

update public.question_items qi
set curriculum = case
  when qir.curriculum in ('cg2365', 'gcse-science-physics') then qir.curriculum
  when qi.unit_code ~* '^PHY-' then 'gcse-science-physics'
  else 'cg2365'
end
from public.question_generation_runs qir
where qi.generation_run_id = qir.id
  and (qi.curriculum not in ('cg2365', 'gcse-science-physics') or qi.curriculum is null);

update public.question_items
set curriculum = case
  when unit_code ~* '^PHY-' then 'gcse-science-physics'
  else 'cg2365'
end
where (curriculum not in ('cg2365', 'gcse-science-physics') or curriculum is null);

-- Hash uniqueness must be per curriculum to avoid cross-subject collisions.
drop index if exists public.idx_question_items_hash;
create unique index if not exists idx_question_items_curriculum_hash
  on public.question_items (curriculum, hash);

-- Helpful scope indexes.
create index if not exists idx_question_generation_runs_curriculum_created
  on public.question_generation_runs (curriculum, created_at desc);

create index if not exists idx_question_items_curriculum_unit_status
  on public.question_items (curriculum, unit_code, status);

create index if not exists idx_module_runs_curriculum_created
  on public.module_runs (curriculum, created_at desc);

create index if not exists idx_syllabus_versions_curriculum_created
  on public.syllabus_versions (curriculum, created_at desc);
