create or replace function public.v2_insert_published_lesson_version(
  target_lesson_id uuid,
  version_source text,
  version_quality_score numeric,
  version_content_json jsonb,
  actor_user_id uuid default null,
  publish_ts timestamptz default now()
)
returns table (
  id uuid,
  lesson_id uuid,
  version_no integer,
  status public.v2_content_status,
  is_current boolean,
  published_at timestamptz
)
language plpgsql
as $$
declare
  next_version_no integer;
begin
  perform 1
  from public.v2_lessons l
  where l.id = target_lesson_id
  for update;

  if not found then
    return;
  end if;

  select coalesce(max(v.version_no), 0) + 1
  into next_version_no
  from public.v2_lesson_versions v
  where v.lesson_id = target_lesson_id;

  update public.v2_lesson_versions lv
  set
    status = case when lv.status = 'published' then 'retired' else lv.status end,
    is_current = false
  where lv.lesson_id = target_lesson_id
    and (lv.is_current = true or lv.status = 'published');

  return query
  insert into public.v2_lesson_versions (
    lesson_id,
    version_no,
    status,
    source,
    quality_score,
    content_json,
    is_current,
    created_by,
    approved_by,
    published_at
  )
  values (
    target_lesson_id,
    next_version_no,
    'published',
    version_source,
    version_quality_score,
    version_content_json,
    true,
    actor_user_id,
    actor_user_id,
    publish_ts
  )
  returning
    v2_lesson_versions.id,
    v2_lesson_versions.lesson_id,
    v2_lesson_versions.version_no,
    v2_lesson_versions.status,
    v2_lesson_versions.is_current,
    v2_lesson_versions.published_at;
end;
$$;
