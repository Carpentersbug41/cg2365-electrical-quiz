create or replace function public.v2_apply_lesson_version_transition(
  target_version_id uuid,
  target_status public.v2_content_status,
  actor_user_id uuid default null,
  transition_ts timestamptz default now()
)
returns table (
  id uuid,
  lesson_id uuid,
  status public.v2_content_status,
  version_no integer,
  is_current boolean,
  published_at timestamptz
)
language plpgsql
as $$
declare
  target_row public.v2_lesson_versions%rowtype;
begin
  select *
  into target_row
  from public.v2_lesson_versions lv
  where lv.id = target_version_id
  for update;

  if not found then
    return;
  end if;

  if target_status = 'published' then
    update public.v2_lesson_versions lv
    set
      status = case when lv.status = 'published' then 'retired' else lv.status end,
      is_current = false
    where lv.lesson_id = target_row.lesson_id
      and lv.id <> target_row.id;

    update public.v2_lesson_versions lv
    set
      status = target_status,
      is_current = true,
      published_at = transition_ts,
      approved_by = coalesce(actor_user_id, lv.approved_by)
    where lv.id = target_row.id;
  else
    update public.v2_lesson_versions lv
    set
      status = target_status,
      is_current = false,
      published_at = null,
      approved_by = case
        when target_status = 'approved' and actor_user_id is not null then actor_user_id
        else lv.approved_by
      end
    where lv.id = target_row.id;
  end if;

  return query
  select
    lv.id,
    lv.lesson_id,
    lv.status,
    lv.version_no,
    lv.is_current,
    lv.published_at
  from public.v2_lesson_versions lv
  where lv.id = target_row.id;
end;
$$;
