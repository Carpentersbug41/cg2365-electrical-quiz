create or replace function public.v2_apply_question_version_transition(
  target_version_id uuid,
  target_status public.v2_content_status,
  actor_user_id uuid default null,
  transition_ts timestamptz default now()
)
returns table (
  id uuid,
  question_id uuid,
  status public.v2_content_status,
  version_no integer,
  is_current boolean,
  published_at timestamptz
)
language plpgsql
as $$
declare
  target_row public.v2_question_versions%rowtype;
begin
  select *
  into target_row
  from public.v2_question_versions qv
  where qv.id = target_version_id
  for update;

  if not found then
    return;
  end if;

  if target_status = 'published' then
    update public.v2_question_versions qv
    set
      status = case when qv.status = 'published' then 'retired' else qv.status end,
      is_current = false
    where qv.question_id = target_row.question_id
      and qv.id <> target_row.id;

    update public.v2_question_versions qv
    set
      status = target_status,
      is_current = true,
      published_at = transition_ts,
      approved_by = coalesce(actor_user_id, qv.approved_by)
    where qv.id = target_row.id;
  else
    update public.v2_question_versions qv
    set
      status = target_status,
      is_current = false,
      published_at = null,
      approved_by = case
        when target_status = 'approved' and actor_user_id is not null then actor_user_id
        else qv.approved_by
      end
    where qv.id = target_row.id;
  end if;

  return query
  select
    qv.id,
    qv.question_id,
    qv.status,
    qv.version_no,
    qv.is_current,
    qv.published_at
  from public.v2_question_versions qv
  where qv.id = target_row.id;
end;
$$;
