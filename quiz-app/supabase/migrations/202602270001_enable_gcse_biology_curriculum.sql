-- Enable GCSE Biology curriculum key across partitioned tables.
-- This migration is required before biology syllabus uploads can be inserted.

do $$
begin
  -- Replace existing checks with expanded curriculum set.
  if exists (
    select 1 from pg_constraint
    where conname = 'syllabus_versions_curriculum_check'
  ) then
    alter table public.syllabus_versions
      drop constraint syllabus_versions_curriculum_check;
  end if;
  alter table public.syllabus_versions
    add constraint syllabus_versions_curriculum_check
    check (curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology'));

  if exists (
    select 1 from pg_constraint
    where conname = 'module_runs_curriculum_check'
  ) then
    alter table public.module_runs
      drop constraint module_runs_curriculum_check;
  end if;
  alter table public.module_runs
    add constraint module_runs_curriculum_check
    check (curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology'));

  if exists (
    select 1 from pg_constraint
    where conname = 'question_generation_runs_curriculum_check'
  ) then
    alter table public.question_generation_runs
      drop constraint question_generation_runs_curriculum_check;
  end if;
  alter table public.question_generation_runs
    add constraint question_generation_runs_curriculum_check
    check (curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology'));

  if exists (
    select 1 from pg_constraint
    where conname = 'question_items_curriculum_check'
  ) then
    alter table public.question_items
      drop constraint question_items_curriculum_check;
  end if;
  alter table public.question_items
    add constraint question_items_curriculum_check
    check (curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology'));
end $$;

-- Backfill any null/legacy/invalid values.
update public.syllabus_versions
set curriculum = case
  when coalesce(meta_json ->> 'curriculum', '') = 'gcse-science-physics' then 'gcse-science-physics'
  when coalesce(meta_json ->> 'curriculum', '') = 'gcse-science-biology' then 'gcse-science-biology'
  else 'cg2365'
end
where curriculum not in ('cg2365', 'gcse-science-physics', 'gcse-science-biology')
   or curriculum is null;

update public.module_runs mr
set curriculum = case
  when sv.curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology') then sv.curriculum
  when mr.unit ~* '^PHY-' then 'gcse-science-physics'
  when mr.unit ~* '^BIO-' then 'gcse-science-biology'
  else 'cg2365'
end
from public.syllabus_versions sv
where mr.syllabus_version_id = sv.id
  and (mr.curriculum not in ('cg2365', 'gcse-science-physics', 'gcse-science-biology') or mr.curriculum is null);

update public.question_generation_runs
set curriculum = case
  when unit_code ~* '^PHY-' then 'gcse-science-physics'
  when unit_code ~* '^BIO-' then 'gcse-science-biology'
  else 'cg2365'
end
where curriculum not in ('cg2365', 'gcse-science-physics', 'gcse-science-biology')
   or curriculum is null;

update public.question_items qi
set curriculum = case
  when qir.curriculum in ('cg2365', 'gcse-science-physics', 'gcse-science-biology') then qir.curriculum
  when qi.unit_code ~* '^PHY-' then 'gcse-science-physics'
  when qi.unit_code ~* '^BIO-' then 'gcse-science-biology'
  else 'cg2365'
end
from public.question_generation_runs qir
where qi.generation_run_id = qir.id
  and (qi.curriculum not in ('cg2365', 'gcse-science-physics', 'gcse-science-biology') or qi.curriculum is null);

update public.question_items
set curriculum = case
  when unit_code ~* '^PHY-' then 'gcse-science-physics'
  when unit_code ~* '^BIO-' then 'gcse-science-biology'
  else 'cg2365'
end
where curriculum not in ('cg2365', 'gcse-science-physics', 'gcse-science-biology')
   or curriculum is null;

